import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FORMS, emptyValues, ONE_OF_MESSAGE } from '../../data/commissionForm.js';
import { submitCommission } from '../../lib/api.js';
import { useCommission } from '../../context/CommissionContext.jsx';
import Field from './Field.jsx';
import FileField from './FileField.jsx';
import Button from '../ui/Button.jsx';
import ButtonEye from '../ui/ButtonEye.jsx';
import Spiral from '../ui/Spiral.jsx';
import styles from './CommissionModal.module.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export default function CommissionModal() {
  const { isOpen, prefill, close } = useCommission();
  // Куклы и портреты — разные наборы вопросов; вид приходит от кнопки
  const form = FORMS[prefill?.kind] ?? FORMS.doll;
  const steps = form.steps;
  const [step, setStep] = useState(0);
  /* Откуда пришли на текущий шаг. Шаги идут не всегда подряд: у кукол
     с развилки «всё уже в файле» прыгают сразу на последний, и «Назад»
     должен вернуть на развилку, а не на шаг про обувь. */
  const [trail, setTrail] = useState([]);
  // Ленивая инициализация обязана получить форму: emptyValues теперь
  // строит поля по её описанию, а не по единственному глобальному набору
  const [values, setValues] = useState(() => emptyValues(form));
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);
  const [failed, setFailed] = useState(null);

  const panelRef = useRef(null);
  const bodyRef = useRef(null);
  const footRef = useRef(null);

  /* Высота стеклянного подвала — в переменную окна (--foot-h): по ней
     анкета оставляет снизу место, чтобы последнее поле не пряталось
     под подвалом. Меняется: строка ошибки, перенос на телефоне. */
  useLayoutEffect(() => {
    const foot = footRef.current;
    const panel = panelRef.current;
    if (!foot || !panel) return undefined;
    const ro = new ResizeObserver(() => {
      panel.style.setProperty('--foot-h', `${foot.offsetHeight}px`);
    });
    ro.observe(foot);
    return () => ro.disconnect();
  });
  const headingRef = useRef(null);

  // Свежая анкета на каждое открытие: чужие ответы в форме сбивают с толку
  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setTrail([]);
    /* Новая анкета — новый ряд: прошлый путь не должен «погаснуть»
       при открытии. */
    setLeaving([]);
    prevRoute.current = null;
    lastHeight.current = null;
    setErrors({});
    setSent(null);
    setFailed(null);
    /* «Хочу такую же» подставляет имя работы в описание замысла; у
       готового сквида замысла нет, туда приходят готовые значения
       полей — имя модели и цена. */
    const base = emptyValues(form);
    if (prefill?.name && 'idea' in base) base.idea = `Something like "${prefill.name}".\n\n`;
    setValues({ ...base, ...prefill?.values });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, prefill]);

  // Фон не должен прокручиваться под открытой анкетой
  /* Страница под анкетой замирает. overflow: hidden на iPhone
     не держит: при открытии клавиатуры Safari всё равно прокручивал
     страницу под окном, и поле ввода съезжало от пальца. Надёжно —
     зафиксировать body на месте и вернуть прокрутку при закрытии. */
  useEffect(() => {
    if (!isOpen) return undefined;
    const y = window.scrollY;
    const body = document.body.style;
    const prev = { position: body.position, top: body.top, width: body.width, overflow: body.overflow };
    body.position = 'fixed';
    body.top = `-${y}px`;
    body.width = '100%';
    body.overflow = 'hidden';
    return () => {
      Object.assign(body, prev);
      /* instant: на сайте включена плавная прокрутка, и страница
         заметно ехала бы на место, а не стояла там, где была. */
      window.scrollTo({ top: y, behavior: 'instant' });
    };
  }, [isOpen]);

  /* Поле в фокусе — на видное место внутри анкеты. Ищем строку поля
     целиком (с подписью), чтобы над полем было видно, что это за поле. */
  const revealFocused = () => {
    const body = bodyRef.current;
    const el = document.activeElement;
    if (!body || !el || !body.contains(el)) return;
    const row = [...body.children].find((c) => c.contains(el)) ?? el;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    row.scrollIntoView({ block: 'center', behavior: still ? 'auto' : 'smooth' });
  };

  /* «Далее» на клавиатуре телефона (Enter) — в следующее поле, а не
     попытка отправить анкету. В последнем поле шага — просто убрать
     клавиатуру: дальше человек нажмёт Next сам. */
  const onFieldKey = (e) => {
    if (e.key !== 'Enter' || e.target.tagName !== 'INPUT' || e.target.type === 'checkbox'
      || e.target.type === 'radio' || e.target.type === 'file') return;
    e.preventDefault();
    const fields = [...bodyRef.current.querySelectorAll('input, select, textarea')]
      .filter((n) => !n.closest('[inert]') && n.type !== 'file' && n.type !== 'hidden'
        && n.offsetParent !== null);
    const next = fields[fields.indexOf(e.target) + 1];
    if (next) next.focus(); else e.target.blur();
  };

  /* Окно — по видимой части экрана: без клавиатуры это весь экран, с
     ней — то, что над ней. Иначе низ окна с полем и кнопками уходил
     под клавиатуру. */
  useEffect(() => {
    const vv = window.visualViewport;
    const overlay = panelRef.current?.parentElement;
    if (!isOpen || !vv || !overlay) return undefined;
    const fit = () => {
      overlay.style.setProperty('--vv-h', `${vv.height}px`);
      overlay.style.setProperty('--vv-top', `${vv.offsetTop}px`);
      /* Клавиатура открыта — экрана стало заметно меньше. Тогда шапка
         ужимается до одной строки (см. data-keyboard в стилях), иначе
         с ней и подвалом на поля оставалась щель в пару строк. */
      const kb = window.innerHeight - vv.height > 120;
      overlay.toggleAttribute('data-keyboard', kb);
      /* Окно поменяло размер — поле в фокусе могло уехать под
         клавиатуру или под подвал: докручиваем к нему. */
      if (kb) revealFocused();
    };
    fit();
    vv.addEventListener('resize', fit);
    vv.addEventListener('scroll', fit);

    /* Телефон сообщает новый размер (resize выше), только когда
       клавиатура уже совсем закрылась, — через полсекунды. Окно ждало
       и разворачивалось с опозданием. Но закрытие клавиатуры видно
       раньше: поле ввода теряет фокус и он никуда не переходит. В этот
       момент и начинаем разворачивать — вместе с клавиатурой, а не
       после неё. Пришёл resize — он только подтвердит то же самое. */
    const typing = (n) => n && (n.tagName === 'TEXTAREA' || n.tagName === 'SELECT'
      || (n.tagName === 'INPUT' && !['checkbox', 'radio', 'file', 'button'].includes(n.type)));
    const onBlur = (e) => {
      if (!overlay.hasAttribute('data-keyboard') || typing(e.relatedTarget)) return;
      overlay.style.setProperty('--vv-h', `${window.innerHeight}px`);
      overlay.style.setProperty('--vv-top', '0px');
      overlay.removeAttribute('data-keyboard');
    };
    overlay.addEventListener('focusout', onBlur);
    return () => {
      vv.removeEventListener('resize', fit);
      vv.removeEventListener('scroll', fit);
      overlay.removeEventListener('focusout', onBlur);
    };
  }, [isOpen]);

  // Escape закрывает, Tab не выпускает фокус наружу
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const nodes = [...(panelRef.current?.querySelectorAll(FOCUSABLE) ?? [])]
        .filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  // При смене шага фокус уходит на заголовок — иначе скринридер
  // молчит и человек не понимает, что экран сменился
  /* ПЕРЕХОД МЕЖДУ ШАГАМИ.
     Шаги разной длины, и окно прыгало по высоте. Высоту окна
     запоминаем перед сменой шага (go ниже), а после отрисовки нового
     — до того, как его покажут, — ставим старую и даём доехать до
     новой. Сам новый шаг въезжает со стороны движения: Next — справа,
     Back — слева (dir). */
  const dir = useRef(1);
  const lastHeight = useRef(null);
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const from = lastHeight.current;
    lastHeight.current = null;
    if (!panel || from === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    panel.style.height = '';
    const to = panel.getBoundingClientRect().height;
    if (Math.abs(to - from) < 2) return;
    panel.style.transition = 'none';
    panel.style.height = `${from}px`;
    void panel.offsetHeight;            // зафиксировать старую высоту
    panel.style.transition = 'height 0.4s var(--ease-out)';
    panel.style.height = `${to}px`;
    const done = (e) => {
      if (e.target !== panel || e.propertyName !== 'height') return;
      panel.style.height = '';
      panel.style.transition = '';
      panel.removeEventListener('transitionend', done);
    };
    panel.addEventListener('transitionend', done);
  }, [step, sent]);

  /** Сменить шаг: запомнить, откуда и с какой высоты. */
  const go = (to, d) => {
    dir.current = d;
    lastHeight.current = panelRef.current?.getBoundingClientRect().height ?? null;
    setStep(to);
  };

  useEffect(() => {
    if (isOpen) headingRef.current?.focus();
  }, [isOpen, step, sent]);

  const current = steps[step];
  const isLast = step === steps.length - 1;
  /* Поля с условием (второй адрес под счёт) видны и проверяются,
     только когда условие выполнено. */
  const visible = current.fields.filter((f) => !f.showIf || f.showIf(values));
  /* Анкета в один шаг: «шаг 1 из 1» и дорожка из одной пуговицы
     ничего не сообщают, их не показываем. */
  const single = steps.length === 1;

  /* Путь по анкете при нынешних ответах: с первого шага, дальше — куда
     скажет next, иначе по порядку. Дорожка пуговиц рисует его, а не
     все шаги подряд: у кукол путь «всё в файле» — три шага, и прыжок
     со второй пуговицы на девятую выглядел поломкой. Выбрали «по
     шагам» — пуговицы между развилкой и финалом дорастают. */
  const route = [];
  for (let i = 0; i < steps.length && !route.includes(i);) {
    route.push(i);
    const to = steps[i].next?.(values);
    const at = to ? steps.findIndex((s) => s.id === to) : -1;
    i = at >= 0 ? at : i + 1;
  }
  const here = route.indexOf(step);

  /* Пуговицы, которые ушли из пути (передумали и выбрали «всё в
     файле»), не исчезают сразу — гаснут и сжимаются, как появлялись.
     Для этого они ещё одну анимацию остаются в ряду: список уходящих
     ведём сами. Слой — до отрисовки (layout), иначе на один кадр ряд
     успевал бы мигнуть уже коротким. */
  const routeKey = route.join(',');
  const prevRoute = useRef(route);
  const [leaving, setLeaving] = useState([]);
  useLayoutEffect(() => {
    const gone = prevRoute.current ? prevRoute.current.filter((i) => !route.includes(i)) : [];
    prevRoute.current = route;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLeaving((l) => [
      ...l.filter((i) => !route.includes(i)),
      ...(still ? [] : gone.filter((i) => !l.includes(i))),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);
  /* Ряд целиком: путь и уходящие, по порядку шагов. Шаги в анкете идут
     вперёд, поэтому порядок номеров и есть порядок в ряду. */
  const railSteps = [...route, ...leaving.filter((i) => !route.includes(i))].sort((a, b) => a - b);
  /* У готового сквида в шапке — его имя: другого места для него в
     анкете нет. «Order Bluet», а не «Order a ready-made squid · Bluet»:
     длинная строка вместе с номером шага переносилась на вторую. */
  const heading = prefill?.heading
    ?? (prefill?.values?.model ? `Order ${prefill.values.model}` : form.title);

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    /* Поле из пары «снимок или описание»: заполнили одно — ошибка
       снимается у обоих, она стоит под описанием, а не под снимком. */
    const pair = current.oneOf?.includes(name) ? current.oneOf : [name];
    setErrors((e) => (pair.some((n) => e[n])
      ? { ...e, ...Object.fromEntries(pair.map((n) => [n, undefined])) }
      : e));
  };

  const validate = () => {
    const next = {};
    for (const f of visible) {
      if (f.type === 'heading' || f.type === 'note') continue;
      const v = values[f.name];
      if (f.type === 'checkbox') {
        /* У галочки «заполнено» — это true, а не непустая строка:
           общая проверка ниже считала бы false заполненным. */
        if (f.required && v !== true) next[f.name] = 'This one has to be ticked';
      } else if (f.required && (Array.isArray(v) ? !v.length : !String(v).trim())) {
        next[f.name] = 'This one is needed';
      } else if (f.type === 'email' && String(v).trim() && !isEmail(v)) {
        next[f.name] = 'Check the address — the reply has to land';
      }
    }
    if (current.oneOf) {
      const filled = current.oneOf.some((n) => {
        const v = values[n];
        return Array.isArray(v) ? v.length : String(v ?? '').trim();
      });
      if (!filled) next[current.oneOf.at(-1)] = ONE_OF_MESSAGE;
    }
    setErrors(next);
    const ok = !Object.keys(next).length;
    if (!ok) requestAnimationFrame(() => requestAnimationFrame(showFirstError));
    return ok;
  };

  /* Не пустили дальше — показать, что именно не так. Ошибка могла
     остаться ниже края окна (галочка согласия в самом низу), и казалось,
     что кнопка просто не работает. Прокручиваем к первому полю с
     ошибкой — оно встаёт посередине — и ставим в него курсор.
     Два кадра: в первом React ещё только дорисовывает подписи ошибок. */
  const showFirstError = () => {
    const body = bodyRef.current;
    const bad = body?.querySelector('[aria-invalid="true"], [role="alert"]');
    if (!bad) return;
    const field = [...body.children].find((child) => child.contains(bad)) ?? bad;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    field.scrollIntoView({ block: 'center', behavior: still ? 'auto' : 'smooth' });
    field.querySelector('input:not([type="file"]), textarea, select')?.focus({ preventScroll: true });
  };

  const back = () => {
    setErrors({});
    go(trail.at(-1) ?? 0, -1);
    setTrail((t) => t.slice(0, -1));
  };
  const forward = () => {
    if (!validate()) return;
    /* Шаг может сам сказать, куда дальше (next), иначе — по порядку. */
    const to = current.next?.(values);
    const at = to ? steps.findIndex((s) => s.id === to) : -1;
    setTrail((t) => [...t, step]);
    go(at >= 0 ? at : step + 1, 1);
  };
  /* Анкета на куклу — только тексты Риты: без подписей у дорожки, без
     строчки в подвале и без адреса после отправки (form.bare). */
  const bare = !!form.bare;

  const send = async () => {
    if (!validate()) return;
    setSending(true);
    setFailed(null);
    try {
      const result = await submitCommission(values, form.kind);
      lastHeight.current = panelRef.current?.getBoundingClientRect().height ?? null;
      dir.current = 1;
      setSent(result);
    } catch (err) {
      setFailed(err?.message || 'Could not send. Try again?');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="commission-title"
      >
        <button className={styles.close} onClick={close}>
          <span className="visually-hidden">Close the form</span>
          <span aria-hidden="true">✕</span>
        </button>

        {sent ? (
          <div className={`${styles.done} ${styles.stepIn}`}>
            <Spiral size={56} color="var(--rose)" />
            <h2 id="commission-title" ref={headingRef} tabIndex={-1} className={styles.doneTitle}>
              Sent!
            </h2>
            {/* У кукол и сквидов текст свой, абзацами (form.done). У
                портретов — прежний текст Риты: про случайный отбор там
                сказано нарочно, человек должен узнать об этом сразу,
                а не гадать неделю, почему нет ответа. */}
            {(form.done ?? [
              'Dear dolly, thank you so much for taking the time to fill out the '
              + 'application so carefully! I usually reply within 1–2 days. Please '
              + 'keep in mind that due to the high demand, your order may not be '
              + 'selected this time. To keep the process fair, the order list is '
              + 'chosen randomly. You’ll receive a response either way ♡',
            ]).map((line, i) => (
              <p key={i} className={`prose ${styles.doneText}`}>
                {/* Абзац — строка или куски; { u } — подчёркнутое слово. */}
                {[].concat(line).map((part, j) => (typeof part === 'string'
                  ? part
                  : <u key={j} className={styles.doneMark}>{part.u}</u>))}
              </p>
            ))}
            {/* Адрес показываем ещё раз: опечатка в нём — единственная
                ошибка анкеты, которую уже не исправить, письмо просто
                не дойдёт. Здесь её видно, пока окно не закрыто. */}
            {!bare && <p className={styles.doneTo}>The answer goes to {values.email}</p>}
            <Button onClick={close}>Close</Button>
          </div>
        ) : (
          <>
            <header className={`${styles.head} ${bare ? styles.headBare : ''}`}>
              <div key={current.id} className={`${styles.headMain} ${styles.stepIn}`} style={{ '--dir': dir.current }}>
                {!bare && (
                  <p className="eyebrow">{single ? heading : `${heading} · step ${here + 1} of ${route.length}`}</p>
                )}
                {/* У шагов без своего заголовка (первые шаги куклы) —
                    название анкеты. */}
                <h2 id="commission-title" ref={headingRef} tabIndex={-1} className={styles.title}>
                  {current.title ?? heading}
                </h2>
                {current.hint && <p className={styles.hint}>{current.hint}</p>}
              </div>

              {/* Справа пустовало — ставим весь путь целиком: видно,
                  сколько осталось и что будет дальше. На узком экране
                  сворачивается в ряд пуговиц без подписей. */}
              {/* У кукол — ряд горящих пуговиц сверху, без подписей. */}
              {!single && <ol className={`${styles.rail} ${bare ? styles.railBare : ''}`} aria-label={`Step ${here + 1} of ${route.length}`}>
                {railSteps.map((si) => {
                  const n = route.indexOf(si);
                  const out = n < 0;
                  /* Уходят справа налево: последняя гаснет первой. */
                  const outOrder = railSteps.filter((x) => x > si && !route.includes(x)).length;
                  return (
                  <li
                    /* Ключ — шаг, а не место в ряду: дорощенные пуговицы
                       появляются, а уже стоящие остаются на месте. */
                    key={steps[si].id}
                    className={`${styles.railItem} ${out ? styles.railLeave : ''} ${n === here ? styles.railNow : ''} ${!out && n < here ? styles.railDone : ''}`}
                    aria-current={n === here ? 'step' : undefined}
                    aria-hidden={out || undefined}
                    style={{ '--n': out ? 0 : n, '--out': outOrder }}
                    /* Только своя анимация: событие всплывает и от
                       пуговицы внутри, она мигает своей. */
                    onAnimationEnd={out ? (e) => {
                      if (e.target === e.currentTarget) setLeaving((l) => l.filter((i) => i !== si));
                    } : undefined}
                  >
                    <ButtonEye
                      size={n === here ? 15 : 11}
                      holes={2}
                      color={!out && n <= here ? 'var(--rose)' : 'var(--fog)'}
                    />
                    {!bare && <span className={styles.railName}>{steps[si].title}</span>}
                  </li>
                  );
                })}
              </ol>}
            </header>

            {/* key — шаг: новый шаг монтируется заново и въезжает, а
                прокрутка поля не тянется с прошлого шага. */}
            <div
              ref={bodyRef}
              key={current.id}
              className={`${styles.body} ${styles.stepIn}`}
              style={{ '--dir': dir.current }}
              onKeyDown={onFieldKey}
              /* Нажали в поле, когда клавиатура уже открыта, — размер
                 окна не меняется, докручиваем сами. Задержка — на
                 подъём клавиатуры, если она только открывается. */
              onFocus={() => setTimeout(revealFocused, 320)}
            >
              {current.fields.map((f) => {
                const node = f.type === 'files' ? (
                  <div key={f.name} className={`${styles.fileBlock} ${f.showIf ? '' : (f.half ? styles.half : '')}`}>
                    {f.label && <span className={styles.fileLabel}>{f.label}</span>}
                    {/* Что будет с чужими фотографиями — сказано там, где
                        их отдают, а не только на странице приватности. */}
                    {f.hint && <p className={styles.fileHint}>{f.hint}</p>}
                    <FileField
                      files={values[f.name]}
                      accept={f.accept}
                      onChange={(v) => set(f.name, v)}
                      /* В паре «снимок или описание» подпись ошибки одна,
                         под описанием, а подсвечены оба поля. */
                      invalid={!!errors[f.name]
                        || (!!current.oneOf?.includes(f.name) && current.oneOf.some((n) => errors[n]))}
                    />
                    {errors[f.name] && <p className={styles.failed} role="alert">{errors[f.name]}</p>}
                  </div>
                ) : (
                  <Field
                    key={f.name}
                    field={f}
                    value={values[f.name]}
                    error={errors[f.name]}
                    onChange={set}
                    className={!f.showIf && f.half ? styles.half : ''}
                  />
                );
                if (!f.showIf) return node;

                /* Поле по выбору (showIf) стоит в разметке всегда, но
                   свёрнуто в ноль. Так его можно плавно развернуть по
                   высоте — и окно растёт вместе с ним, а не прыгает.
                   Пока свёрнуто — inert: ни фокуса, ни скринридера. */
                const open = f.showIf(values);
                return (
                  <div
                    key={f.name}
                    className={`${styles.collapse} ${open ? styles.collapseOpen : ''} ${f.half ? styles.half : ''}`}
                    inert={open ? undefined : ''}
                  >
                    <div className={styles.collapseInner}>{node}</div>
                  </div>
                );
              })}
            </div>

            <footer ref={footRef} className={styles.foot}>
              {failed && <p className={styles.failed} role="alert">{failed}</p>}

              {/* Одна строка: «Назад» — примечание — основная кнопка.
                  Раньше примечание висело отдельной строкой под кнопкой
                  и оставляло пустую полосу во всю ширину. */}
              <div className={styles.actions}>
                {bare ? <span /> : (
                  <p className={styles.privacy}>
                    {/* От первого лица, как все тексты Риты на сайте. */}
                    This goes only to me. No mailing lists.
                  </p>
                )}

                {/* Кнопки собраны в группу справа — так примечание
                    получает всю левую половину и не ломается на строки */}
                <div className={styles.btns}>
                  {step > 0 && (
                    <Button variant="ghost" size="sm" onClick={back} disabled={sending}>Back</Button>
                  )}
                  {isLast ? (
                    <Button size="sm" onClick={send} disabled={sending}>
                      {sending ? 'Sending…' : 'Send it'}
                    </Button>
                  ) : (
                    <Button size="sm" onClick={forward}>Next</Button>
                  )}
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
