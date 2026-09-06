import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

/**
 * Анкета на заказ куклы открывается из шапки, из карточки, с главной
 * и из каталога — поэтому её состояние живёт здесь, а не в компоненте.
 *
 * prefill — необязательный контекст: если человек нажал «Хочу такую же»
 * на конкретной кукле, её название подставляется как референс.
 */

const CommissionContext = createContext(null);

export function CommissionProvider({ children }) {
  const [state, setState] = useState({ open: false, prefill: null });
  // Куда вернуть фокус после закрытия — иначе клавиатурный пользователь
  // после Escape оказывается в начале страницы
  const returnTo = useRef(null);

  const open = useCallback((prefill = null) => {
    returnTo.current = document.activeElement;
    setState({ open: true, prefill });
  }, []);

  const close = useCallback(() => {
    setState({ open: false, prefill: null });
    returnTo.current?.focus?.();
    returnTo.current = null;
  }, []);

  const value = useMemo(
    () => ({ isOpen: state.open, prefill: state.prefill, open, close }),
    [state, open, close]
  );

  return <CommissionContext.Provider value={value}>{children}</CommissionContext.Provider>;
}

export function useCommission() {
  const ctx = useContext(CommissionContext);
  if (!ctx) throw new Error('useCommission должен вызываться внутри <CommissionProvider>');
  return ctx;
}
