import { createContext, useContext, useEffect, useState } from 'react';
import { ORDERS } from '../data/shopState.js';

/**
 * Открыты ли заказы прямо сейчас.
 *
 * Значения по умолчанию лежат в data/shopState.js, а переключатель в
 * шапке их перебивает. Выбор хранится в браузере, поэтому переживает
 * перезагрузку, но остаётся у того, кто переключил: это ещё не админка,
 * а ручка для самой мастерской. Настоящее управление приедет с бэкендом.
 */
const KEY = 'cs-orders-open';
const OrdersContext = createContext(null);

/** Из файла: открыты ли заказы хотя бы на что-то, кроме сквидов. */
const defaultOpen = ORDERS.dolls.open || ORDERS.portraits.open;

export function OrdersProvider({ children }) {
  const [open, setOpen] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      return saved === null ? defaultOpen : saved === '1';
    } catch {
      return defaultOpen;   // приватный режим — просто берём значение из файла
    }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, open ? '1' : '0'); } catch { /* не критично */ }
  }, [open]);

  return (
    <OrdersContext.Provider value={{ open, setOpen, toggle: () => setOpen((v) => !v) }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders вне OrdersProvider');
  return ctx;
}
