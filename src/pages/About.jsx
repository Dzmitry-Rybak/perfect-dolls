import PageShell from '../components/layout/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import ButtonEye from '../components/ui/ButtonEye.jsx';
import Spiral from '../components/ui/Spiral.jsx';
import styles from './About.module.css';

const STEPS = [
  { n: '01', t: 'Пуговицы',  d: 'Перебираю коробку, пока какая-нибудь пара не начнёт смотреть в ответ. С этого момента кукла уже существует, остаётся её сшить.' },
  { n: '02', t: 'Ткань',     d: 'Почти всегда старая: обрезки, распоротые платья, занавески с барахолки. Новое полотно слишком ровное и молчит.' },
  { n: '03', t: 'Каркас',    d: 'Внутри проволока, поэтому кукла держит позу. Набивка — холлофайбер, иногда с сухой лавандой или кусочком фитиля.' },
  { n: '04', t: 'Лицо',      d: 'Единственная часть без машинных швов. Рот и брови вышиваются от руки, без разметки: каждое лицо получается своим.' },
];

export default function About() {
  return (
    <PageShell
      eyebrow="Мастерская"
      title="Кто всё это шьёт"
      lead="Меня зовут Рита. Я шью тряпичных кукол восьмой год — сначала это было занятие на вечер, потом оказалось, что за ними приезжают из другой страны."
    >
      <div className={styles.grid}>
        <div className={`prose ${styles.text}`}>
          <p>
            В мастерской нет серий и повторов. Даже если очень попросить сшить
            «такую же», получится другая: ткань закончилась, пуговица была
            единственной, а рука в тот день дрожала иначе.
          </p>
          <p>
            Мне нравится, когда в кукле есть что-то не совсем уютное — кривой
            стежок, слишком пристальный взгляд, платье не по размеру. Идеально
            ровная кукла выглядит фабричной, а от фабричной никто не просыпается
            среди ночи с мыслью «а она точно там, где я её оставила».
          </p>
          <p>
            Работаю по одной за раз. Пока не закончу текущую, следующую не начинаю —
            иначе они начинают перенимать друг у друга черты.
          </p>
        </div>

        <aside className={styles.card}>
          <h2 className={styles.cardTitle}>Коротко</h2>
          <ul className={styles.facts}>
            {[
              'Работаю с 2018 года',
              'Отправляю по всему миру',
              'Чиню свои работы бесплатно',
              'Куклы не для детей',
            ].map((f) => (
              <li key={f} className="eye-host">
                <ButtonEye size={14} color="var(--moon)" holes={2} />
                {f}
              </li>
            ))}
          </ul>
          <Button to="/constructor" variant="stitched" className={styles.cardBtn}>
            Собрать куклу
          </Button>
        </aside>
      </div>

      <Spiral size={48} className={styles.divider} />

      <section>
        <h2 className={styles.stepsTitle}>Как рождается кукла</h2>
        <ol className={styles.steps}>
          {STEPS.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={styles.stepNum}>{s.n}</span>
              <h3 className={styles.stepTitle}>{s.t}</h3>
              <p className={styles.stepText}>{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
