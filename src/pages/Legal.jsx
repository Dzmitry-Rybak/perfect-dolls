import PageShell from '../components/layout/PageShell.jsx';
import { LEGAL, TRADER, TRADER_MISSING, POLICY } from '../data/legal.js';
import styles from './Legal.module.css';

/**
 * Одна страница на три документа: приватность, условия заказа,
 * авторские права. Разметка у них одинаковая, разный только текст,
 * и держать три почти одинаковых компонента было бы приглашением
 * к тому, чтобы они разошлись.
 *
 * Текст — в data/legal.js. Здесь только то, как он выглядит,
 * плюс несколько вставок, которые собираются из реквизитов:
 * блок продавца, надзорный орган, НДС и применимое право.
 * Незаполненный реквизит не печатается пустой строкой — вставка
 * просто исчезает, а при локальной разработке наверху страницы
 * висит список того, что осталось заполнить.
 */

/** Оглавление: страницы длинные, а нужный пункт обычно один. */
function Contents({ sections }) {
  return (
    <nav className={styles.toc} aria-label="On this page">
      <ol>
        {sections.map((s) => (
          <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
        ))}
      </ol>
    </nav>
  );
}

/** Реквизиты продавца — их положено показывать, а не прятать в почте. */
function Trader() {
  const rows = [
    [TRADER.name, 'Trading as cutesmokey'],
    [TRADER.form, null],
    [TRADER.address, null],
    [TRADER.country, null],
    [TRADER.regNumber, 'Company registration'],
    [TRADER.vat, 'VAT'],
    [TRADER.email, 'Email'],
  ].filter(([value]) => value);

  /* Ни одного заполненного реквизита — пустой рамки быть не должно. */
  if (!rows.length) return null;

  return (
    <dl className={styles.trader}>
      {rows.map(([value, label]) => (
        <div key={value} className={styles.traderRow}>
          {label && <dt>{label}</dt>}
          <dd>{label === 'Email' ? <a href={`mailto:${value}`}>{value}</a> : value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Абзац, кусок списка или одна из собираемых вставок. */
function Block({ item }) {
  if (typeof item === 'string') return <p className={`prose ${styles.p}`}>{item}</p>;

  if (item.list) {
    return (
      <ul className={styles.list}>
        {item.list.map((line) => <li key={line}>{line}</li>)}
      </ul>
    );
  }

  if (item.trader) return <Trader />;

  if (item.dpa) {
    return TRADER.dpa ? (
      <p className={`prose ${styles.p}`}>
        The authority for {TRADER.country ?? 'her country'} is {TRADER.dpa}.
      </p>
    ) : null;
  }

  if (item.vat) {
    return TRADER.vat ? (
      <p className={`prose ${styles.p}`}>
        Prices include VAT where it is due; the VAT number is above.
      </p>
    ) : null;
  }

  if (item.law) {
    return TRADER.country ? (
      <p className={`prose ${styles.p}`}>
        These terms are governed by the law of {TRADER.country}.
      </p>
    ) : null;
  }

  return null;
}

export default function Legal({ doc }) {
  const page = LEGAL[doc];

  return (
    <PageShell eyebrow={page.eyebrow} title={page.title} lead={page.lead}>
      {/* Видно только на localhost: на боевом сайте вместо предупреждения
          просто не печатаются строки, которых нет. */}
      {import.meta.env.DEV && TRADER_MISSING.length > 0 && (
        <p className={styles.todo}>
          Перед запуском заполнить в <code>src/data/legal.js</code> →{' '}
          <code>TRADER</code>: {TRADER_MISSING.join(', ')}.
          Это предупреждение видно только при локальной разработке.
        </p>
      )}

      <Contents sections={page.sections} />

      {page.sections.map((s) => (
        <section key={s.id} id={s.id} className={styles.section}>
          <h2 className={styles.title}>{s.title}</h2>
          {s.body.map((item, i) => <Block key={i} item={item} />)}
        </section>
      ))}

      <p className={styles.updated}>Last updated {POLICY.updated}</p>
    </PageShell>
  );
}
