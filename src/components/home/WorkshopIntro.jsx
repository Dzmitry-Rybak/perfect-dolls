import ButtonEye from '../ui/ButtonEye.jsx';
import styles from './WorkshopIntro.module.css';

const FACTS = [
  { n: '~40', label: 'часов на одну куклу' },
  { n: '1',   label: 'экземпляр каждой работы' },
  { n: '0',   label: 'машинных швов на лице' },
];

export default function WorkshopIntro() {
  return (
    <section className={`page ${styles.section}`}>
      <div className={styles.grid}>
        <div>
          <p className="eyebrow">Как это делается</p>
          <h2 className={styles.title}>Сначала пуговицы, потом всё остальное</h2>
          <div className={`prose ${styles.text}`}>
            <p>
              Кукла начинается не с эскиза, а с коробки пуговиц. Я перебираю их,
              пока какая-нибудь пара не начнёт смотреть в ответ — дальше уже
              понятно, кто это и что ей носить.
            </p>
            <p>
              Ткани почти всегда старые: обрезки, распоротые платья, занавески
              с барахолки. Новое полотно слишком ровное и не хочет
              рассказывать историю.
            </p>
          </div>
        </div>

        <ul className={styles.facts}>
          {FACTS.map((f) => (
            <li key={f.label} className={`${styles.fact} eye-host`}>
              <ButtonEye size={18} color="var(--moon)" />
              <span className={styles.num}>{f.n}</span>
              <span className={styles.label}>{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
