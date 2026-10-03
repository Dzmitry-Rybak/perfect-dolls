import PageShell from '../components/layout/PageShell.jsx';
import OrderGate from '../components/ui/OrderGate.jsx';
import Button from '../components/ui/Button.jsx';
import Photo from '../components/ui/Photo.jsx';
import StitchCard from '../components/ui/StitchCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getWorks } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import styles from './Section.module.css';

/* Три работы из архива. Здесь витрина, а не листалка: показываем
   один кадр, за остальными — в галерею.
   Какие именно три, выбирается в админке («Страницы разделов»);
   ничего не выбрано — берутся первые три по полю «Порядок в галерее».

   БЕЗ ПОДПИСЕЙ, в отличие от сквидов и кукол: Маргарита попросила
   оставить здесь одни снимки. Описание при этом не пропало — оно
   осталось в alt, так что и поиску, и экранному диктору кадр
   по-прежнему понятен. Заголовки работ никуда не делись из админки
   и по-прежнему видны в галерее. */
const SHOWN = 3;

/* Описание раздела — четырьмя абзацами: вопрос, как рисуется человек
   и его зверь, что ещё приходит в наборе и сухие цифры про формат.
   Цифры нарочно последними: сначала про то, что получится. */
const LEAD = [
  'Wanna see what you’d look like as a little doll?',
  'I draw you as a “mini me” doll, turning your favourite details into a tiny '
  + 'illustrated version of you. Your hairstyle, clothes, and favourite accessories '
  + 'all help me capture your personality. And when it comes to your animal, I keep '
  + 'things more realistic, because they’re already magical creatures on their own.',
  'I finish each portrait with a background full of fun little details floating '
  + 'around, and every set comes with a few little extras, too.',
  'The portraits are a little larger than A5 and drawn in black and white using '
  + 'markers and black fineliners.',
];

export default function Portraits() {
  const { data, loading } = useAsync(() => getWorks('portrait', SHOWN), []);

  return (
    <PageShell
      eyebrow="Drawn portraits"
      title="Portraits"
      lead={LEAD}
      aside={<OrderGate topic="portraits" kind="portrait" label="Order a portrait" />}
    >
      <section>
        <h2 className={styles.gridTitle}>Past portraits</h2>

        {loading ? <Loader label="Leafing through the folder…" /> : (
          <>
            <ul className={styles.tiles}>
              {data.shown.map((e) => (
                <li key={e.id}>
                  <StitchCard seed={e.id} className={styles.tile}>
                    <Photo
                      src={e.shots[0].tile ?? e.shots[0].src}
                      srcSet={e.shots[0].tileSrcSet}
                      sizes={e.shots[0].tileSizes}
                      alt={e.shots[0].alt}
                    />
                  </StitchCard>
                </li>
              ))}
            </ul>

            {data.total > SHOWN && (
              <div className={styles.more}>
                <Button to="/gallery?kind=portrait" variant="stitched">See the rest →</Button>
              </div>
            )}
          </>
        )}
      </section>
    </PageShell>
  );
}
