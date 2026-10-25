import { useEffect, useMemo, useRef, useState } from 'react';
import PageShell from '../components/layout/PageShell.jsx';
import SquidCanvas from '../components/squid/SquidCanvas.jsx';
import ColorPopover from '../components/squid/ColorPopover.jsx';
import GalleryLightbox from '../components/gallery/GalleryLightbox.jsx';
import SheetDoodles from '../components/squid/SheetDoodles.jsx';
import Button from '../components/ui/Button.jsx';
import {
  BASE_PRICE, SIZES, FUR_COLORS, BUTTON_COLORS,
  BUTTON_PATTERNS, BUTTON_SHAPES, SHAPE_PRICE,
  ADDONS, RIBBON_COLORS, RIBBON_KINDS, PATTERN_PRICE, PATTERN_PRESETS,
  GLITTER_PRICE,
  defaultBuild, ADDON_COLORS, CHARMS, CHARM_SLOTS, describeBuild,
} from '../data/squidBuilder.js';
import { BEAD_MAX } from '../data/squidParts.js';
import { EMAIL } from '../data/site.js';
import { useCommission } from '../context/CommissionContext.jsx';
import styles from './Builder.module.css';

const usd = (n) => `$${n}`;

export default function Builder() {
  const [build, setBuild] = useState(defaultBuild);
  const [pop, setPop] = useState(null);   // { partId, group, x, y }
  /* Открыт ли лист с подвесками — снимок всех двадцати пяти. */
  const [charms, setCharms] = useState(false);
  const { open: openOrder } = useCommission();
  const sheetRef = useRef(null);

  /* МИНИ-ПРЕВЬЮ. На телефоне схема над панелью, и стоит прокрутить к
     кнопкам — сквид уезжает за верх экрана, а с ним и ответ на вопрос
     «как он сейчас выглядит». Пока его не видно, в углу держим
     маленькую копию; нажатие на неё возвращает к большой схеме.
     Раньше выбор в панели сам прокручивал к схеме — с копией это не
     нужно: результат виден в углу, а человек остаётся у кнопок.
     Появляется заранее — когда от схемы на экране осталась пятая
     часть, а не когда она скрылась совсем: иначе был момент, когда
     сквида не видно нигде. И только когда схема уходит ВВЕРХ: в начале
     страницы, пока до неё ещё не долистали, копия была бы лишней.
     Пока человек печатает (имя для бусин, заметки), копия прячется:
     над клавиатурой она закрывала бы само поле. */
  const [sketchGone, setSketchGone] = useState(false);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const el = sheetRef.current;
    if (!el || typeof IntersectionObserver !== 'function') return undefined;
    const narrow = window.matchMedia('(max-width: 940px)');
    /* Отсчёт — от низа шапки: то, что под ней, не видно. */
    const headerH = () => document.querySelector('#root > header')?.offsetHeight ?? 69;
    const io = new IntersectionObserver(([e]) => {
      const leaving = e.boundingClientRect.top < e.rootBounds.top;   // уходит вверх
      setSketchGone(narrow.matches && leaving && e.intersectionRatio <= 0.2);
    }, {
      rootMargin: `-${headerH()}px 0px 0px 0px`,
      threshold: [0, 0.1, 0.2, 0.25, 0.3, 0.5, 1],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const isField = (n) => n && (n.tagName === 'TEXTAREA'
      || (n.tagName === 'INPUT' && !['checkbox', 'radio', 'color', 'button'].includes(n.type)));
    const onIn = (e) => setTyping(isField(e.target));
    const onOut = () => setTyping(false);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);
  const miniShown = sketchGone && !typing;
  const backToSketch = () => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sheetRef.current?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  };

  /* Цвет детали: в обычном режиме — общий для группы,
     в режиме «микс» — свой, если его задали. */
  /** Цвет добавки лежит в своём поле, а не в build.fur. */
  const addonColor = (group) => ADDON_COLORS.find((a) => a.addon === group);

  const colorOf = (partId, group) => {
    if (group === 'button') return build.button;
    if (group === 'thread') return build.thread;
    const ac = addonColor(group);
    if (ac) return build[ac.key];
    if (build.mix && build.pieces[partId]) return build.pieces[partId];
    return build.fur[group];
  };

  const openPalette = (partId, group, e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPop({
      partId, group,
      x: e.clientX || r.left + r.width / 2,
      y: e.clientY || r.top + r.height / 2,
    });
  };

  const choose = (hex) => {
    const { partId, group } = pop;
    setBuild((b) => {
      if (group === 'button') return { ...b, button: hex };
      if (group === 'thread') return { ...b, thread: hex };
      const ac = addonColor(group);
      if (ac) return { ...b, [ac.key]: hex };
      // В режиме «микс» красим только нажатый кусок, иначе всю группу
      if (b.mix) return { ...b, pieces: { ...b.pieces, [partId]: hex } };
      return { ...b, fur: { ...b.fur, [group]: hex }, pieces: {} };
    });
    setPop(null);
  };

  const toggleAddon = (addon) => setBuild((b) => {
    const on = b.addons.includes(addon.id);
    let next = on ? b.addons.filter((a) => a !== addon.id) : [...b.addons, addon.id];
    // Взаимоисключающая группа: три вида пирсинга одновременно не бывает
    if (!on && addon.group) {
      const siblings = ADDONS.filter((a) => a.group === addon.group && a.id !== addon.id).map((a) => a.id);
      next = next.filter((a) => !siblings.includes(a));
    }
    return { ...b, addons: next };
  });

  const total = useMemo(() => {
    let sum = BASE_PRICE;
    sum += SIZES.find((s) => s.id === build.size)?.priceDelta ?? 0;
    for (const id of build.addons) sum += ADDONS.find((a) => a.id === id)?.price ?? 0;
    sum += SHAPE_PRICE[build.buttonShape] ?? 0;
    if (build.glitter) sum += GLITTER_PRICE;
    if (build.pattern) sum += PATTERN_PRICE.simple;
    if (build.complexNote.trim()) sum += PATTERN_PRICE.complex;
    return sum;
  }, [build]);

  /* Пуговицу и нитку Рита красит вручную — цвет не ограничен. */
  const handPainted = pop && (pop.group === 'button' || pop.group === 'thread');
  const popAddon = pop && addonColor(pop.group);
  const palette = !pop ? []
    : popAddon ? (popAddon.palette === 'fur' ? FUR_COLORS : RIBBON_COLORS)
    : handPainted ? BUTTON_COLORS : FUR_COLORS;
  const paletteTitle = pop && (popAddon ? popAddon.label : {
    ear: 'Ear colour', earInner: 'Inner ear', head: 'Head colour',
    tentacle: 'Tentacle colour', tentacleInner: 'Tentacle underside',
    button: 'Button colour', thread: 'Thread colour',
  }[pop.group]);


  return (
    <PageShell
      eyebrow="Build your own"
      title="Make your plush squid"
      /* Описание во всю ширину — так попросили: в узкой колонке
         оно стояло столбиком, а справа от него пустовало полэкрана. */
      wideLead
      lead={[
        'Click on any part of the squid to choose a color. Add any details you love most, and don’t forget that I’m not limited to what you see in the builder! Keep in mind that this is just a rough sketch of your future plush companion, so the final result will look a little different in real life.',
        /* Готовый дизайн из галереи заказывают письмом, а не через
           конструктор, — поэтому ссылка сразу на почту для сквидов.
           Пробелы в ссылке неразрывные: «let me» на одной строке и
           «know» на другой читались как две разные ссылки. */
        <>
          If you like any of the designs in the gallery and want one just like
          it, <a href={`mailto:${EMAIL.main}`}>let&nbsp;me&nbsp;know</a> right away!
        </>,
      ]}
    >
      <div className={styles.desk}>
        {/* ---------- Схема на тетрадном листе ---------- */}
        <div className={styles.sheetWrap} ref={sheetRef}>
          <div className={styles.sheet}>
            {/* Скотч по всем четырём углам — лист прижат к столу. */}
            <span className={`${styles.tape} ${styles.tapeTL}`} aria-hidden="true" />
            <span className={`${styles.tape} ${styles.tapeTR}`} aria-hidden="true" />
            <span className={`${styles.tape} ${styles.tapeBL}`} aria-hidden="true" />
            <span className={`${styles.tape} ${styles.tapeBR}`} aria-hidden="true" />

            {/* Рисунок на полях — по скетчу Риты, у каждого поля свой.
                На узком экране его нет: там лист по ширине сквида. */}
            <SheetDoodles side="left" className={styles.marginL} />
            <SheetDoodles side="right" className={styles.marginR} />

            {/* Подсказка — бумажка на скрепке, приколотая к листу.
                Раньше это была просто строчка от руки: на широком
                листе она терялась в пустоте. */}
            <div className={styles.note}>
              <svg className={styles.clip} viewBox="0 0 28 62" aria-hidden="true" focusable="false">
                {/* Скрепка: одной линией, как её и гнут из проволоки —
                    внутренняя петля, вверх, большая внешняя вокруг неё.
                    Серая, как металл: на скетче у Риты она не нарисована,
                    а настоящая, приколотая сверху. */}
                <path
                  d="M19.5 39V15a6.5 6.5 0 0 0-13 0v32a10.5 10.5 0 0 0 21 0V19"
                  fill="none" stroke="#6F6E7A" strokeWidth="3.4"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              {/* Строки разбиты руками: так на скетче у Риты, и на
                  телефоне записка иначе вытянулась бы в одну. */}
              <p className={styles.noteText}>tap a part<br />to colour it</p>
            </div>

            <SquidCanvas
              build={build}
              colorOf={colorOf}
              onPick={openPalette}
              activePart={pop?.partId}
            />
          </div>
        </div>

        {/* ---------- Панель ---------- */}
        <div className={styles.panel}>
          {/* размер */}
          <section className={styles.block}>
            <h2 className={styles.legend}>Size</h2>
            <div className={styles.row}>
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  className={`${styles.chip} ${build.size === s.id ? styles.chipOn : ''}`}
                  onClick={() => setBuild((b) => ({ ...b, size: s.id }))}
                >
                  {s.label}
                  <span className={styles.chipNote}>{s.note}</span>
                  {s.priceDelta > 0 && <span className={styles.delta}>+{usd(s.priceDelta)}</span>}
                </button>
              ))}
            </div>
          </section>

          {/* микс */}
          <section className={styles.block}>
            <h2 className={styles.legend}>Colours</h2>
            <p className={styles.help}>
              Turn on mix mode to colour each piece separately.
            </p>
            <label className={`${styles.toggle} ${build.mix ? styles.toggleOn : ''}`}>
              <input
                type="checkbox"
                className="visually-hidden"
                checked={build.mix}
                onChange={(e) => setBuild((b) => ({ ...b, mix: e.target.checked }))}
              />
              <span className={styles.knob} aria-hidden="true" />
              Mix colours — colour each piece on its own
            </label>
          </section>

          {/* пуговица */}
          <section className={styles.block}>
            <h2 className={styles.legend}>Button</h2>
            <p className={styles.help}>
              Buttons are hand-painted, so the colour is not limited to samples —
              tap the button or its thread on the sketch and pick any shade.
            </p>

            {/* Форма. Идёт первой в блоке: от неё зависит, как будут
                выглядеть узор и цвет, которые выбирают ниже. */}
            <div className={styles.row}>
              {BUTTON_SHAPES.map((sh) => (
                <button
                  key={sh.id}
                  className={`${styles.chip} ${build.buttonShape === sh.id ? styles.chipOn : ''}`}
                  aria-pressed={build.buttonShape === sh.id}
                  onClick={() => setBuild((b) => ({ ...b, buttonShape: sh.id }))}
                >
                  {sh.label}
                  {SHAPE_PRICE[sh.id] > 0 && (
                    <span className={styles.delta}>+{usd(SHAPE_PRICE[sh.id])}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Блёстки на схеме не показываем: на превью 1–3 см их
                всё равно не видно, а в заявку они уходят. */}
            <div className={styles.row}>
              <button
                className={`${styles.chip} ${build.glitter ? styles.chipOn : ''}`}
                aria-pressed={build.glitter}
                onClick={() => setBuild((b) => ({ ...b, glitter: !b.glitter }))}
              >
                Glitter on top
                <span className={styles.delta}>+{usd(GLITTER_PRICE)}</span>
              </button>
            </div>

            <div className={styles.row}>
              <button
                className={`${styles.chip} ${!build.pattern ? styles.chipOn : ''}`}
                onClick={() => setBuild((b) => ({ ...b, pattern: null }))}
              >Plain</button>
              {BUTTON_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  className={`${styles.chip} ${build.pattern === p.id ? styles.chipOn : ''}`}
                  onClick={() => setBuild((b) => ({ ...b, pattern: p.id }))}
                >
                  {p.label}
                  {!build.pattern && <span className={styles.delta}>+{usd(PATTERN_PRICE.simple)}</span>}
                </button>
              ))}
            </div>

            {build.pattern && (
              <div className={styles.patternColor}>
                <span className={styles.help}>Pattern colour</span>
                <div className={styles.swatches}>
                  {PATTERN_PRESETS.map((c) => (
                    <button
                      key={c.id}
                      className={`${styles.swatch} ${build.patternColor === c.hex ? styles.swatchOn : ''}`}
                      style={{ '--c': c.hex }}
                      title={c.label}
                      onClick={() => setBuild((b) => ({ ...b, patternColor: c.hex }))}
                    ><span className="visually-hidden">{c.label}</span></button>
                  ))}
                  <label className={styles.swatchFree} title="Any colour">
                    <input
                      type="color"
                      value={build.patternColor}
                      onChange={(e) => setBuild((b) => ({ ...b, patternColor: e.target.value.toUpperCase() }))}
                    />
                    <span className="visually-hidden">Any colour</span>
                  </label>
                </div>
              </div>
            )}

            <label className={styles.field}>
              <span className={styles.fieldLabel}>
                Something more complex? <span className={styles.delta}>+{usd(PATTERN_PRICE.complex)}</span>
              </span>
              <span className={styles.help}>
                Flowers, landscapes, characters, fruit slices, lettering — describe
                it and I'll paint it. This one can't be previewed here.
              </span>
              <textarea
                rows={3}
                value={build.complexNote}
                placeholder="e.g. a kiwi slice, or a tiny moon with stars"
                onChange={(e) => setBuild((b) => ({ ...b, complexNote: e.target.value }))}
              />
            </label>
          </section>

          {/* добавки */}
          <section className={styles.block}>
            <h2 className={styles.legend}>Add-ons</h2>
            <div className={styles.row}>
              {ADDONS.map((a) => (
                <button
                  key={a.id}
                  className={`${styles.chip} ${build.addons.includes(a.id) ? styles.chipOn : ''}`}
                  onClick={() => toggleAddon(a)}
                >
                  {a.label}
                  <span className={styles.delta}>+{usd(a.price)}</span>
                </button>
              ))}
            </div>

            {/* Слово для бусин. Поле появляется только у включённой
                добавки: пустая строка ввода без неё — вопрос без повода.
                Буквы приводим к верхнему регистру и выкидываем всё, что
                на бусине не напечатано: пробелы, точки, кириллицу. */}
            {build.addons.includes('nameBeads') && (
              <div className={styles.sub}>
                <span className={styles.help}>
                  Up to <b>{BEAD_MAX}</b> letters — they run along the left ear, and
                  sit over the piercings if you have both. Longer names come out
                  on smaller beads.
                </span>
                <input
                  type="text"
                  value={build.beadWord}
                  maxLength={BEAD_MAX}
                  placeholder="NAME"
                  aria-label="Word for the letter beads"
                  onChange={(e) => setBuild((b) => ({
                    ...b,
                    beadWord: e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, '')
                      .slice(0, BEAD_MAX),
                  }))}
                />
              </div>
            )}

            {/* По черепу кликнуть нельзя, и без строчки это выглядело бы
                поломкой: сердце и звезда красятся, а он нет. */}
            {build.addons.includes('furSkull') && (
              <p className={styles.help}>
                The fur skull is always <b>white</b>. The heart and the star take
                any fur colour — tap them on the squid.
              </p>
            )}

            {build.addons.includes('corset') && (
              <div className={styles.sub}>
                <span className={styles.help}>Ribbon</span>
                <div className={styles.row}>
                  {RIBBON_KINDS.map((r) => (
                    <button
                      key={r.id}
                      className={`${styles.chip} ${build.ribbonKind === r.id ? styles.chipOn : ''}`}
                      onClick={() => setBuild((b) => ({ ...b, ribbonKind: r.id }))}
                    >{r.label}</button>
                  ))}
                </div>
              </div>
            )}

            {/* ПОДВЕСКИ.
                Выбор показывается только у включённых добавок: пока
                бант или булавка не выбраны, спрашивать про подвеску
                не о чем. Мест три и они независимы — на банте своя,
                в ушах своя, на булавке своя.

                Список, а не плитки: подвесок двадцать пять, плитками
                они заняли бы пол-экрана. И номер в подписи не для
                красоты — Рита заказывает их по номерам, в заявке
                должен стоять он, а не только название. */}
            {CHARM_SLOTS.filter((s) => build.addons.includes(s.addon)).map((slot) => (
              <label key={slot.key} className={styles.field}>
                <span className={styles.fieldLabel}>{slot.label}</span>
                <select
                  value={build[slot.key] ?? ''}
                  onChange={(e) => setBuild((b) => ({
                    ...b, [slot.key]: e.target.value ? Number(e.target.value) : null,
                  }))}
                >
                  <option value="">Pick one — or leave it to me</option>
                  {CHARMS.map((c) => (
                    <option key={c.n} value={c.n}>{c.n}. {c.label}</option>
                  ))}
                </select>
              </label>
            ))}

            {CHARM_SLOTS.some((s) => build.addons.includes(s.addon)) && (
              <>
                {/* Снимок листа с подвесками. По названию в списке не
                    понять, чем «Winged heart key» отличается от
                    «Winged heart lock», — а на фотографии видно сразу.
                    Кнопка стоит под списками, а не над: сначала человек
                    видит, что выбор вообще есть, и только потом идёт
                    разглядывать. */}
                <Button
                  variant="stitched"
                  onClick={() => setCharms(true)}
                  className={styles.charmsLink}
                >
                  See all {CHARMS.length} charms →
                </Button>
                <p className={styles.help}>
                  Charms are small — 1 to 3 cm. The list changes as stock comes
                  and goes, so if yours is gone I'll write and we'll pick another.
                </p>
              </>
            )}

            {/* Цвет добавок выбирается кликом по самой детали на схеме —
                дублировать свотчи здесь незачем. */}

          </section>

          {/* свободное поле */}
          <section className={styles.block}>
            <h2 className={styles.legend}>Anything else</h2>
            <p className={styles.help}>
              The builder only covers the basics. I also sculpt clay pieces, sew on
              unusual ribbons, tiny hats, beads, fur inserts in odd shapes — the
              parts I enjoy most. Describe what you're imagining and I'll quote it.
            </p>
            <textarea
              rows={3}
              value={build.notes}
              placeholder="Tell me your idea"
              onChange={(e) => setBuild((b) => ({ ...b, notes: e.target.value }))}
            />
          </section>

          {/* итог */}
          <div className={styles.total}>
            <div className={styles.totalTag}>
              <span className={styles.totalLabel}>Estimated price</span>
              <strong className={styles.totalValue}>{usd(total)}</strong>
            </div>
            <div className={styles.totalActions}>
              {/* Та же анкета, что у готового сквида: кто, куда и кому
                  счёт. Сквид уходит с ней — словами и сырой сборкой. */}
              <Button onClick={() => openOrder({
                kind: 'build',
                heading: `Your squid · ${usd(total)}`,
                values: {
                  price: total,
                  build: describeBuild(build, total),
                  buildJson: JSON.stringify(build),
                },
              })}>
                Send this to Margarita
              </Button>
              {/* Начать заново — и на телефоне вернуться к схеме: сквид
                  снова пустой, и смотреть дальше надо на него, а не на
                  кнопки внизу. На широком экране схема и так рядом. */}
              <button
                className={styles.reset}
                onClick={() => {
                  setBuild(defaultBuild);
                  if (window.matchMedia('(max-width: 940px)').matches) backToSketch();
                }}
              >
                start over
              </button>
            </div>
          </div>

          <p className={styles.disclaimer}>
            The sketch is a guide, not an exact likeness — everything is sewn by
            hand, so your squid will have its own character. Final price is
            confirmed once we've talked it through.
          </p>
        </div>
      </div>

      {/* Мини-превью в углу. Копия схемы только для глаз: inert — ни
          фокуса, ни нажатий по деталям, нажимается вся карточка. */}
      <button
        type="button"
        className={`${styles.mini} ${miniShown ? styles.miniOn : ''}`}
        onClick={backToSketch}
        aria-hidden={!miniShown}
        tabIndex={miniShown ? 0 : -1}
        aria-label="Back to your squid"
      >
        <span className={styles.miniSheet} inert="">
          <SquidCanvas build={build} colorOf={colorOf} onPick={() => {}} />
        </span>
      </button>

      {/* Лист с подвесками — в том же окне, что и работы в архиве:
          Escape закрывает, фокус не уходит за него, фон не ползёт.
          Размеры снимка переданы, поэтому окно встаёт в свой размер
          сразу и не прыгает, когда фотография догрузится. */}
      {charms && (
        <GalleryLightbox
          item={{
            title: 'Available charms',
            note: 'About 1–3 cm each · numbers are what I order by',
            shots: [{
              src: '/art/charms.jpg',
              full: '/art/charms.jpg',
              alt: 'A sheet with all twenty-five charms, numbered: crosses, a coffin, a dagger, skulls, keys, stars, a chainsaw, a razor, winged hearts, an octopus, buttons, a pentagram, a spiral and a dragonfly',
              w: 974,
              h: 1280,
              /* Настоящая ширина снимка: выше неё окно не растёт,
                 иначе на высоком экране лист растянуло бы до мыла. */
              maxW: 974,
            }],
          }}
          onClose={() => setCharms(false)}
        />
      )}

      {pop && (
        <ColorPopover
          at={{ x: pop.x, y: pop.y }}
          title={paletteTitle}
          hint={
            pop.group === 'button' || pop.group === 'thread'
              ? 'Hand-painted — any colour'
              : popAddon ? 'Colours this add-on'
              : build.mix ? 'Mix mode: colours this piece only' : 'Colours all of them at once'
          }
          colors={palette}
          free={handPainted}
          value={colorOf(pop.partId, pop.group)}
          onChoose={choose}
          onRemove={popAddon ? () => {
            setBuild((b) => ({ ...b, addons: b.addons.filter((a) => a !== popAddon.addon) }));
            setPop(null);
          } : undefined}
          onClose={() => setPop(null)}
        />
      )}
    </PageShell>
  );
}
