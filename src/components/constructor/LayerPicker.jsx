import styles from './LayerPicker.module.css';
import { formatPrice } from '../../lib/format.js';

/** Один слой: подпись маркером + варианты-пуговицы, приколотые к бумаге. */
export default function LayerPicker({ layer, options, selected, onSelect }) {
  return (
    <fieldset className={styles.layer}>
      <legend className={styles.legend}>
        <span className={styles.label}>{layer.label}</span>
        <span className={styles.hint}>{layer.hint}</span>
      </legend>

      <div className={styles.options}>
        {options.map((opt) => {
          const on = selected === opt.id;
          const transparent = opt.color === 'transparent';
          return (
            <label key={opt.id} className={`${styles.option} ${on ? styles.on : ''}`}>
              <input
                type="radio"
                name={layer.id}
                value={opt.id}
                checked={on}
                onChange={() => onSelect(layer.id, opt.id)}
                className="visually-hidden"
              />
              <span
                className={`${styles.swatch} ${transparent ? styles.none : ''}`}
                style={{ '--swatch': opt.color }}
                aria-hidden="true"
              >
                {/* дырки пуговицы */}
                {!transparent && <><i /><i /><i /><i /></>}
              </span>
              <span className={styles.name}>{opt.name}</span>
              {opt.priceDelta > 0 && (
                <span className={styles.delta}>+{formatPrice(opt.priceDelta)}</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
