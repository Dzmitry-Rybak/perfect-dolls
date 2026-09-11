import PageShell from '../components/layout/PageShell.jsx';
import InfoSection from '../components/layout/InfoSection.jsx';
import ButtonEye from '../components/ui/ButtonEye.jsx';
import Spiral from '../components/ui/Spiral.jsx';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import { SOCIAL, EMAIL } from '../data/site.js';
import styles from './Section.module.css';

const STEPS = [
  ['01', 'Buttons',  'A piece starts in a tin of buttons, not on paper. I sort through them until a pair looks back, and from then on I know who it is.'],
  ['02', 'Fabric',   'Almost always old — offcuts, unpicked dresses, curtains from flea markets. New cloth is too even and has nothing to say.'],
  ['03', 'Frame',    'There is wire inside, so it holds a pose. Stuffing is hollowfibre, sometimes with dried lavender or a scrap of candle wick.'],
  ['04', 'Face',     'The only part with no machine stitching. Mouths and brows are embroidered freehand, so every face comes out its own.'],
];

const FACTS = [
  'Working since 2018',
  'Ships worldwide',
  'I repair my own work for free',
  'Not toys for small children',
];

export default function Workshop() {
  return (
    <PageShell
      eyebrow="The workshop"
      title="Who makes all this"
      lead="I'm Margarita. I've been sewing for eight years — it started as something to do in the evening, and then people began travelling from other countries to collect the results."
    >
      <InfoSection
        aside={
          <figure className={styles.photo}>
            <span className={styles.photoTape} aria-hidden="true" />
            {/* TODO: заменить на фото Риты */}
            <DollPortrait seed="rita" accent="#FF96C9" alt="" />
          </figure>
        }
      >
        <p>
          There are no runs and no repeats here. Even if you ask for "the same
          one", it comes out different — the fabric ran out, the button was the
          only one, my hand shook differently that day.
        </p>
        <p>
          I like it when something in a piece isn't quite comfortable — a crooked
          stitch, a stare that's a little too direct, a dress that doesn't fit.
          A perfectly even doll looks factory-made, and nobody wakes at 3am
          wondering whether a factory doll is still where they left it.
        </p>
        <p>
          I work on one thing at a time. Until it's finished I don't start the
          next, or they begin borrowing each other's features.
        </p>
        <ul className={styles.facts2}>
          {FACTS.map((f) => (
            <li key={f} className="eye-host">
              <ButtonEye size={14} holes={2} color="var(--moon)" />{f}
            </li>
          ))}
        </ul>
        <p className={styles.small}>
          <a href={SOCIAL.instagram} target="_blank" rel="noreferrer noopener">Instagram</a>
          {' · '}
          <a href={SOCIAL.tiktok} target="_blank" rel="noreferrer noopener">TikTok</a>
          {' · '}
          <a href={`mailto:${EMAIL.main}`}>{EMAIL.main}</a>
        </p>
      </InfoSection>

      <Spiral size={44} className={styles.divider} />

      <section>
        <h2 className={styles.gridTitle}>How a piece comes together</h2>
        <ol className={styles.steps}>
          {STEPS.map(([n, t, d]) => (
            <li key={n} className={styles.step}>
              <span className={styles.stepNum}>{n}</span>
              <h3 className={styles.stepTitle}>{t}</h3>
              <p className={styles.stepText}>{d}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
