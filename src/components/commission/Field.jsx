import { useId } from 'react';
import styles from './Field.module.css';

/** Одно поле анкеты. Тип берётся из описания в data/commissionForm.js. */
export default function Field({ field, value, error, onChange, className = '' }) {
  const id = useId();
  const errId = `${id}-err`;
  const hintId = `${id}-hint`;
  const describedBy = [field.hint && hintId, error && errId].filter(Boolean).join(' ') || undefined;

  const common = {
    id,
    name: field.name,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    /* У части полей анкеты на куклу подписи нет — только подсказка
       внутри; без aria-label скринридер прочёл бы пустое поле. */
    'aria-label': field.label ? undefined : field.placeholder,
    className: `${styles.control} ${error ? styles.bad : ''}`,
    onChange: (e) => onChange(field.name, e.target.value),
  };

  /* Подзаголовок группы полей («Shipping address»): значения у него
     нет, это просто строка над группой. */
  if (field.type === 'heading') {
    return <h3 className={`${styles.group} ${className}`}>{field.label}</h3>;
  }

  /* Напоминание под полями («Please note: …») — просто абзац. */
  if (field.type === 'note') {
    return <p className={`${styles.note} ${className}`}>{field.label}</p>;
  }

  /* Выбор одного варианта — карточками, а не выпадающим списком: на
     развилке у варианта есть пояснение, в список его не уместить. */
  if (field.type === 'choice') {
    const labelId = `${id}-label`;
    return (
      <div className={`${styles.field} ${className}`}>
        {field.label && (
          <span id={labelId} className={styles.label}>
            {field.label}
            {field.required && <span className={styles.req} aria-hidden="true"> *</span>}
          </span>
        )}
        <div
          role="radiogroup"
          aria-labelledby={field.label ? labelId : undefined}
          aria-describedby={describedBy}
          className={field.inline ? styles.choiceRow : styles.choices}
        >
          {field.options.map((o) => {
            const on = value === o.value;
            return (
              <label key={o.value} className={`${styles.option} ${on ? styles.optionOn : ''} ${error ? styles.optionBad : ''}`}>
                <input
                  type="radio"
                  name={id}
                  checked={on}
                  onChange={() => onChange(field.name, o.value)}
                />
                <span className={styles.optionText}>
                  {o.label}
                  {o.hint && <span className={styles.optionHint}>{o.hint}</span>}
                </span>
              </label>
            );
          })}
        </div>
        {error && <p id={errId} className={styles.error} role="alert">{error}</p>}
      </div>
    );
  }

  /* Галочка устроена наоборот: подпись справа от квадратика и она же
     кликабельная, поэтому общий заголовок поля сверху ей не нужен —
     он повторял бы ту же фразу дважды. */
  if (field.type === 'checkbox') {
    return (
      <div className={`${styles.field} ${className}`}>
        <label className={`${styles.check} ${error ? styles.checkBad : ''}`}>
          <input
            type="checkbox"
            id={id}
            name={field.name}
            checked={!!value}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            onChange={(e) => onChange(field.name, e.target.checked)}
          />
          <span className={styles.checkText}>
            {/* Подпись — строка или куски, где { href, label } — ссылка.
                Ссылки открываются в новой вкладке намеренно: уход со
                страницы посреди заполненной анкеты стоил бы ответов. */}
            {[].concat(field.label).map((part, i) => (typeof part === 'string' ? part : (
              <a key={i} href={part.href} target="_blank" rel="noreferrer noopener">{part.label}</a>
            )))}
            {field.required && <span className={styles.req} aria-hidden="true"> *</span>}
            {field.required && <span className="visually-hidden"> — required</span>}
          </span>
        </label>

        {field.hint && <p id={hintId} className={styles.checkHint}>{field.hint}</p>}
        {error && <p id={errId} className={styles.error} role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`${styles.field} ${className}`}>
      {field.label && (
        <label className={styles.label} htmlFor={field.type === 'chips' ? undefined : id}>
          {field.label}
          {field.required && <span className={styles.req} aria-hidden="true"> *</span>}
          {field.required && <span className="visually-hidden"> — required</span>}
        </label>
      )}

      {field.hint && <p id={hintId} className={styles.hint}>{field.hint}</p>}

      {field.type === 'textarea' && (
        <textarea {...common} value={value} rows={field.rows ?? 4} placeholder={field.placeholder} />
      )}

      {/* enterKeyHint — на клавиатуре телефона вместо «Ввод» кнопка
          «Далее»: по ней анкета переводит в следующее поле. */}
      {(field.type === 'text' || field.type === 'email' || field.type === 'tel') && (
        <input {...common} type={field.type} value={value} placeholder={field.placeholder}
               enterKeyHint="next"
               autoComplete={field.auto
                 ?? (field.type === 'email' ? 'email' : field.name === 'name' ? 'name' : 'off')} />
      )}

      {field.type === 'select' && (
        <select {...common} value={value}>
          <option value="">Not chosen</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}

      {field.type === 'chips' && (
        <div className={styles.chips} role="group" aria-label={field.label} aria-describedby={describedBy}>
          {field.options.map((o) => {
            const on = value.includes(o.value);
            return (
              <label key={o.value} className={`${styles.chip} ${on ? styles.chipOn : ''}`}>
                <input
                  type="checkbox"
                  className="visually-hidden"
                  checked={on}
                  onChange={() => onChange(
                    field.name,
                    on ? value.filter((v) => v !== o.value) : [...value, o.value]
                  )}
                />
                {o.label}
              </label>
            );
          })}
        </div>
      )}

      {error && <p id={errId} className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
