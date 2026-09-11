import PageShell from '../components/layout/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import { EMAIL, SOCIAL } from '../data/site.js';
import styles from './Section.module.css';

export default function Pr() {
  return (
    <PageShell
      eyebrow="For brands"
      title="PR & collaborations"
      lead="Yes, advertising is available — and yes, I would genuinely like you to buy some."
    >
      <div className={`prose ${styles.prBody}`}>
        <p>
          I post about the work on{' '}
          <a href={SOCIAL.instagram} target="_blank" rel="noreferrer noopener">Instagram</a>
          {' '}and{' '}
          <a href={SOCIAL.tiktok} target="_blank" rel="noreferrer noopener">TikTok</a>,
          where the audience is mostly people who like handmade things, soft
          horror, sewing and the darker end of cute.
        </p>
        <p>
          For rates, formats and anything commercial, write to the address below.
          It's a separate inbox on purpose — commercial mail gets buried
          instantly if it lands with the order requests.
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
