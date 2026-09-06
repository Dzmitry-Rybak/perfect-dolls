import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { steps, emptyValues } from '../../data/commissionForm.js';
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
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);
  const [failed, setFailed] = useState(null);

  const panelRef = useRef(null);
  const headingRef = useRef(null);

  // Свежая анкета на каждое открытие: чужие ответы в форме сбивают с толку
  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setErrors({});
    setSent(null);
    setFailed(null);
    setValues({
      ...emptyValues(),
      idea: prefill ? `Хочу похожую на «${prefill.name}».\n\n` : '',
    });
  }, [isOpen, prefill]);

  // Фон не должен прокручиваться под открытой анкетой
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
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
  useEffect(() => {
    if (isOpen) headingRef.current?.focus();
  }, [isOpen, step, sent]);

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  const validate = () => {
    const next = {};
    for (const f of current.fields) {
      const v = values[f.name];
      if (f.required && (Array.isArray(v) ? !v.length : !String(v).trim())) {
        next[f.name] = 'Без этого не обойтись';
      } else if (f.type === 'email' && String(v).trim() && !isEmail(v)) {
        next[f.name] = 'Проверьте адрес — письмо должно дойти';
      }
    }
    setErrors(next);
    return !Object.keys(next).length;
  };

  const back = () => { setErrors({}); setStep((s) => Math.max(0, s - 1)); };
  const forward = () => { if (validate()) setStep((s) => s + 1); };

  const send = async () => {
    if (!validate()) return;
    setSending(true);
    setFailed(null);
    try {
      const result = await submitCommission(values);
      setSent(result);
    } catch (err) {
      setFailed(err?.message || 'Не удалось отправить. Попробуйте ещё раз.');
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
          <span className="visually-hidden">Закрыть анкету</span>
          <span aria-hidden="true">✕</span>
        </button>

        {sent ? (
          <div className={styles.done}>
            <Spiral size={56} color="var(--rose)" />
            <h2 id="commission-title" ref={headingRef} tabIndex={-1} className={styles.doneTitle}>
              Заявка ушла
            </h2>
            <p className={`prose ${styles.doneText}`}>
              Номер <code>{sent.id}</code>. Рита отвечает обычно в тот же день —
              письмо придёт на {values.email}.
            </p>
            <Button onClick={close}>Закрыть</Button>
          </div>
        ) : (
          <>
            <header className={styles.head}>
              <div className={styles.headMain}>
                <p className="eyebrow">Заказ куклы · шаг {step + 1} из {steps.length}</p>
                <h2 id="commission-title" ref={headingRef} tabIndex={-1} className={styles.title}>
                  {current.title}
                </h2>
                {current.hint && <p className={styles.hint}>{current.hint}</p>}
              </div>

              {/* Справа пустовало — ставим весь путь целиком: видно,
                  сколько осталось и что будет дальше. На узком экране
                  сворачивается в ряд пуговиц без подписей. */}
              <ol className={styles.rail} aria-label={`Шаг ${step + 1} из ${steps.length}`}>
                {steps.map((s, i) => (
                  <li
                    key={s.id}
                    className={`${styles.railItem} ${i === step ? styles.railNow : ''} ${i < step ? styles.railDone : ''}`}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    <ButtonEye
                      size={i === step ? 15 : 11}
                      holes={2}
                      color={i <= step ? 'var(--rose)' : 'var(--fog)'}
                    />
                    <span className={styles.railName}>{s.title}</span>
                  </li>
                ))}
              </ol>
            </header>

            <div className={styles.body}>
              {current.fields.map((f) =>
                f.type === 'files' ? (
                  <div key={f.name} className={styles.fileBlock}>
                    <span className={styles.fileLabel}>{f.label}</span>
                    <FileField files={values.files} onChange={(v) => set('files', v)} />
                  </div>
                ) : (
                  <Field
                    key={f.name}
                    field={f}
                    value={values[f.name]}
                    error={errors[f.name]}
                    onChange={set}
                  />
                )
              )}
            </div>

            <footer className={styles.foot}>
              {failed && <p className={styles.failed} role="alert">{failed}</p>}

              {/* Одна строка: «Назад» — примечание — основная кнопка.
                  Раньше примечание висело отдельной строкой под кнопкой
                  и оставляло пустую полосу во всю ширину. */}
              <div className={styles.actions}>
                <p className={styles.privacy}>
                  Уходит только Рите, без рассылок.
                </p>

                {/* Кнопки собраны в группу справа — так примечание
                    получает всю левую половину и не ломается на строки */}
                <div className={styles.btns}>
                  {step > 0 && (
                    <Button variant="ghost" onClick={back} disabled={sending}>Назад</Button>
                  )}
                  {isLast ? (
                    <Button onClick={send} disabled={sending}>
                      {sending ? 'Отправляю…' : 'Оформить куклу'}
                    </Button>
                  ) : (
                    <Button onClick={forward}>Дальше</Button>
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
