import PageShell from '../components/layout/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import { EMAIL, SOCIAL } from '../data/site.js';
import styles from './Section.module.css';

export default function Pr() {
  return (
    <PageShell
      eyebrow="For brands"
      title="PR & Collaborations"
      lead="Yes, collaborations are welcome, and yes, I’d genuinely love to hear from you ♡"
    >
      {/* Текст Риты, слово в слово. */}
      <div className={`prose ${styles.prBody}`}>
        <p>
          I share my work on{' '}
          <a href={SOCIAL.instagram} target="_blank" rel="noreferrer noopener">Instagram</a>
          {' '}and{' '}
          <a href={SOCIAL.tiktok} target="_blank" rel="noreferrer noopener">TikTok</a>,
          where my audience is full of artists, handmade lovers, and people who
          appreciate authenticity, creativity, and things made with care.
        </p>
        <p>
          I’d love to find ways to bring your product into my creative world,
          whether it’s through the making process, a custom order, or a new idea
          inspired by it. I’m always excited by collaborations that give me
          something genuinely fun to create.
        </p>
        <p>
          For rates, formats, and all commercial inquiries, please write to the
          email below.
        </p>
      </div>

      <div className={styles.prMail}>
        <p className={styles.prMailLabel}>Commercial enquiries</p>
        <a className={styles.prMailAddr} href={`mailto:${EMAIL.pr}`}>{EMAIL.pr}</a>
        <Button href={`mailto:${EMAIL.pr}`} size="lg">Write to me</Button>
      </div>
    </PageShell>
  );
}
