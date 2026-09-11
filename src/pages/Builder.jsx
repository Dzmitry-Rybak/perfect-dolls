import { useMemo, useState } from 'react';
import PageShell from '../components/layout/PageShell.jsx';
import SquidCanvas from '../components/squid/SquidCanvas.jsx';
import ColorPopover from '../components/squid/ColorPopover.jsx';
import Button from '../components/ui/Button.jsx';
import {
  BASE_PRICE, SIZES, FUR_COLORS, BUTTON_COLORS,
  BUTTON_PATTERNS, ADDONS, RIBBON_COLORS, RIBBON_KINDS, PATTERN_PRICE, PATTERN_PRESETS,
  GLITTER_PRICE,
  defaultBuild, ADDON_COLORS,
} from '../data/squidBuilder.js';
import styles from './Builder.module.css';

const usd = (n) => `$${n}`;

export default function Builder() {
  const [build, setBuild] = useState(defaultBuild);
  const [pop, setPop] = useState(null);   // { partId, group, x, y }

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
      lead="Tap any part of the squid to change its colour. Everything you pick updates the price as you go — this is a sketch, not an exact preview, and every plushie is sewn by hand."
    >
      <div className={styles.desk}>
        {/* ---------- Схема на тетрадном листе ---------- */}
        <div className={styles.sheetWrap}>
          <div className={styles.sheet}>
            <span className={styles.tapeL} aria-hidden="true" />
            <span className={styles.tapeR} aria-hidden="true" />
            <p className={styles.sheetTitle}>tap a part to colour it</p>

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
              <Button>Send this to Margarita</Button>
              <button className={styles.reset} onClick={() => setBuild(defaultBuild)}>
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
