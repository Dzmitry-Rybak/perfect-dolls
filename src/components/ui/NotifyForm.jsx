import { useId, useState } from 'react';
import Button from './Button.jsx';
import { subscribe } from '../../lib/api.js';
import styles from './NotifyForm.module.css';

/**
 * Подписка на открытие приёма.
 *
 * Живёт внутри закрытого блока заказа: когда окно закрыто, кроме даты
 * человеку предложить нечего, и он уходит — а открывается приём на
 * несколько дней, и узнать о нём случайно почти невозможно.
 *
 * Раздел свой у каждой формы: куклы и портреты открывают в разное
 * время, и подписка на одно не должна тащить письма про другое.
 */

/* Проверяем на глаз, а не по RFC: строгая проверка адреса отсекает
   живые ящики чаще, чем ловит опечатки. Настоящая проверка — письмо,
   которое или дойдёт, или нет. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const WHAT = { doll: 'doll orders', portrait: 'portrait slots' };

export default function NotifyForm({ topic, kind }) {
  const id = useId();
  const [email, setEmail] = useState('');
  /** idle · sending · done · failed */
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  const what = WHAT[kind] ?? WHAT.doll;

  async function onSubmit(e) {
    e.preventDefault();
    const value = email.trim();

    if (!value) return setError('Leave an address and I will write to it.');
    if (!LOOKS_LIKE_EMAIL.test(value)) return setError("That doesn't look like an email.");

    setError('');
    setState('sending');
    try {
      await subscribe(value, topic);
      setState('done');
    } catch {
      setState('failed');
      setError('It did not go through. Try again in a minute.');
    }
  }

  /* Ответ вместо формы, а не под ней: подписавшись, человек уже сделал
     здесь всё, что мог, и пустое поле рядом звало бы сделать это снова. */
  if (state === 'done') {
    return (
      <p className={styles.done} role="status">
        <span className={styles.doneMark} aria-hidden="true">✓</span>
        You are on the list. One letter, the day {what} open — nothing else.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <p className={styles.scribble}>don't miss the window</p>
      <p className={styles.lead}>
        Leave your email and I will write once, when {what} open.
      </p>

      <div className={styles.row}>
        <label className="visually-hidden" htmlFor={id}>Email</label>
        <input
          id={id}
          type="email"
          name="email"
          value={email}
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`${styles.control} ${error ? styles.bad : ''}`}
          onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
          disabled={state === 'sending'}
        />
        <Button type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Adding…' : 'Notify me'}
        </Button>
      </div>

      {error && <p id={`${id}-err`} className={styles.error} role="alert">{error}</p>}
    </form>
  );
}
