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
   ничего не выбрано — берутся первые три по полю «Порядок в галерее». */
const SHOWN = 3;

/* Описание раздела — четырьмя абзацами: вопрос, про сходство,
   про жутковатость (сказана прямо и первой — кукол видно рядом,
   и лучше объяснить это самим, чем оставить человека гадать) и
   про то, что лежит в коробке. */
const LEAD = [
  'Ever wished you could keep a tiny version of yourself forever?',
  'Every doll is completely unique and made to look just like you, down to the '
  + 'tiniest details. I create your little copy in my own style and add all the '
  + 'details that make your doll unmistakably yours.',
  'They might look creepy, but that’s part of the charm! These tiny little spies '
  + 'with souls are made to keep a version of you, or someone you love, forever.',
  'And of course, each doll comes with a few little surprises tucked into the '
  + 'packaging, so opening one feels like receiving a tiny gift made just for you.',
];

/* Характеристики — то, что в описании не скажешь, не превратив его
   в инструкцию: рост, материалы, как сделано лицо, тело, волосы.
   Порядок сверху вниз — как куклу собирают. */
const SPEC = [
  ['Height', '~35 cm (~14 in)'],
  ['Materials', 'polymer clay, yarn, fabric & metal'],
  ['Face', 'sculpted from scratch in my own style; makeup is sealed securely '
         + 'and won’t fade over time'],
  ['Body', 'soft body made from sturdy yarn wrapped around a metal skeleton, '
         + 'so the doll can bend unless its limbs are open and sculpted from '
         + 'polymer clay'],
  ['Hair', 'glued and styled knitting yarn'],
  ['Clothes', 'sewn entirely by hand, without a sewing machine; usually '
            + 'non-removable'],
  ['Shoes', 'hand-sculpted from polymer clay and weighted so the doll can '
          + 'stand on its own'],
];

export default function Dolls() {
  const { data, loading } = useAsync(() => getWorks('doll', SHOWN), []);

  return (
    <PageShell
      eyebrow="Collectible dolls"
      title="Dolls"
      lead={LEAD}
      aside={<OrderGate topic="dolls" kind="doll" label="Order a doll" />}
    >
      {/* Список стоит между описанием и работами: сначала «что это»,
          потом «из чего сделано», и только потом сами куклы. Сбоку его
          не поставить — там блок заказа, а половина строк здесь длиной
          в предложение и в узкой колонке рассыпается. */}
      <section>
        <h2 className={styles.gridTitle}>What she is made of</h2>
        <dl className={styles.spec}>
          {SPEC.map(([term, value]) => (
            <div key={term} className={styles.specRow}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className={styles.gridTitle}>Dolls that already found homes</h2>

        {loading ? <Loader label="Opening the drawers…" /> : (
          <>
            <ul className={styles.tiles}>
              {data.shown.map((d) => (
                <li key={d.id}>
                  <StitchCard seed={d.id} className={styles.tile}>
                    <Photo
                      src={d.shots[0].tile ?? d.shots[0].src}
                      srcSet={d.shots[0].tileSrcSet}
                      sizes={d.shots[0].tileSizes}
                      alt={d.shots[0].alt}
                    />
                    <p className={styles.tileName}>{d.title}</p>
                  </StitchCard>
                </li>
              ))}
            </ul>

            {/* Ссылку показываем, только если в архиве и правда осталось ещё. */}
            {data.total > SHOWN && (
              <div className={styles.more}>
                <Button to="/gallery?kind=doll" variant="stitched">See the rest →</Button>
              </div>
            )}
          </>
        )}
      </section>
    </PageShell>
  );
}
