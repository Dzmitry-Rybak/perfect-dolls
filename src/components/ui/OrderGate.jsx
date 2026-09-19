import Button from './Button.jsx';
import ButtonEye from './ButtonEye.jsx';
import Spiral from './Spiral.jsx';
import { useCommission } from '../../context/CommissionContext.jsx';
import { useOrders } from '../../context/OrdersContext.jsx';
import styles from './OrderGate.module.css';

/**
 * Кнопка заказа, которая знает, открыты ли заказы.
 *
 * Открыты  → открывает анкету.
 * Закрыты  → показывает примерный срок, а не мёртвую кнопку.
 *
 * Открыты или нет, срок и приписка приходят из админки. Значения
 * в data/shopState.js остались запасным вариантом на случай, если
 * сервис недоступен.
 */
/** Приглашение под заголовком: у кукол шьют, у портретов рисуют. */
const OPEN_LEAD = {
  doll: "Taking commissions right now — tell me who you want and I'll sew her.",
  portrait: 'Taking commissions right now — send a photo and I will draw it.',
};

export default function OrderGate({ topic, label, kind }) {
  /* Всё про раздел — из админки: открыты ли заказы, срок и приписка. */
  const state = useOrders(topic);
  const { open } = useCommission();
  const isOpen = !!state?.open;

  if (isOpen) {
    return (
      <div className={styles.openNow}>
        <Spiral size={64} color="var(--rose)" className={styles.openMark} />
        <p className={styles.openScribble}>the door is open</p>
        <p className={`${styles.openHead} eye-host`}>
          <ButtonEye size={16} holes={2} color="var(--rose)" />
          Orders are open
        </p>
        <p className={styles.openLead}>{OPEN_LEAD[kind] ?? OPEN_LEAD.doll}</p>
        <Button size="lg" onClick={() => open({ kind })}>{label}</Button>
      </div>
    );
  }

  return (
    <div className={styles.closed}>
      <p className={`${styles.head} eye-host`}>
        <ButtonEye size={16} holes={2} color="var(--moon)" />
        Orders are closed right now
      </p>
      <p className={styles.when}>
        Next opening: <b>{state?.window ?? 'to be announced'}</b>
      </p>
      {state?.note && <p className={styles.note}>{state.note}</p>}
    </div>
  );
}
