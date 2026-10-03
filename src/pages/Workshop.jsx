import PageShell from '../components/layout/PageShell.jsx';
import InfoSection from '../components/layout/InfoSection.jsx';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import { SOCIAL, EMAIL } from '../data/site.js';
import styles from './Section.module.css';

export default function Workshop() {
  return (
    <PageShell
      eyebrow="The artist"
      title="Who makes all this"
      lead="Hi, I’m Margarita! I’m a self-taught artist and the hands behind cutesmokey."
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
        {/* Первый абзац стоит наверху, рядом с заголовком, — остальное
            здесь, у фотографии: это рассказ, и читать его удобнее
            в узкой колонке рядом с лицом, а не во всю ширину. */}
        <p>
          I was born in a small town in Belarus and moved to Poland as a teenager
          in 2017 to build a life of my own. All of my little creations were born
          here, in Gdańsk, on the coast of the Baltic Sea.
        </p>
        <p>
          As long as I can remember, I’ve always been creating something, trying
          out new things and exploring different forms of art. I always dreamed of
          making creativity my life, and in 2023, I somehow turned that dream into
          reality and became a full-time artist.
        </p>
        <p>
          It all started with someone very important to me: my little sister.
          I made my very first doll as a graduation gift for her, so she could keep
          that slightly childish, special version of herself forever. Years later,
          I still hope to share a little bit of the magic that moment brought to my
          family with other people and their loved ones.
        </p>
        <p>
          Love and humanity are at the heart of everything I do. I hope you can
          feel that in my work, even in its little imperfections. I’m incredibly
          grateful to every person who lets my dream of creating continue to exist.
        </p>
        <p>
          Thank you for being here and for letting my little dream of creating
          exist. I hope I can make something special for you, inspire you in some
          little way, or simply brighten your day for a minute with something
          I’ve made.
        </p>
        <p className={`eyebrow ${styles.findMe}`}>Where you can find me</p>
        <p className={styles.small}>
          <a href={SOCIAL.instagram} target="_blank" rel="noreferrer noopener">Instagram</a>
          {' · '}
          <a href={SOCIAL.tiktok} target="_blank" rel="noreferrer noopener">TikTok</a>
          {' · '}
          {/* Подписью, а не адресом: рядом стоят Instagram и TikTok,
              и длинная почта посреди них читалась бы как сбой. Сам
              адрес виден в подвале и открывается по нажатию. */}
          <a href={`mailto:${EMAIL.main}`}>Email</a>
        </p>
      </InfoSection>
    </PageShell>
  );
}
