import { createContext, useContext } from 'react';
import { getSettings } from '../lib/api.js';
import useAsync from '../lib/useAsync.js';
import { ORDERS } from '../data/shopState.js';

/**
 * Открыты ли заказы — по разделам.
 *
 * Значения приходят из админки (документ «Настройки» в Sanity).
 * Раньше здесь был переключатель в шапке, писавший в localStorage:
 * он менял картину только у того, кто его нажал, и был виден всем
 * посетителям. Теперь это настоящее управление, и ручка ровно одна —
 * в админке.
 *
 * Пока настройки едут, показываем то, что вшито в сборку: иначе на
 * долю секунды мелькал бы неверный ответ на вопрос «принимаете ли
 * заказы», а это худшее, чем можно ошибиться на этой странице.
 */
const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const { data } = useAsync(() => getSettings(), []);
  return (
    <OrdersContext.Provider value={data ?? ORDERS}>
      {children}
    </OrdersContext.Provider>
  );
}

/** Настройки раздела: { open, window, note }. */
export function useOrders(topic) {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders вне OrdersProvider');
  return topic ? ctx[topic] : ctx;
}
