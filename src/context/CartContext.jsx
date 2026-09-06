import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CartContext = createContext(null);
const KEY = 'rita-dolls:cart';

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      // Куклы штучные: повторное добавление не увеличивает количество
      if (state.some((i) => i.id === action.item.id)) return state;
      return [...state, action.item];
    }
    case 'remove':
      return state.filter((i) => i.id !== action.id);
    case 'clear':
      return [];
    default:
      return state;
  }
}

function readStorage() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return []; // приватный режим / заблокированное хранилище
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, readStorage);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* нестрашно */ }
  }, [items]);

  const value = useMemo(() => ({
    items,
    count: items.length,
    total: items.reduce((sum, i) => sum + i.price, 0),
    has:    (id) => items.some((i) => i.id === id),
    add:    (item) => dispatch({ type: 'add', item }),
    remove: (id) => dispatch({ type: 'remove', id }),
    clear:  () => dispatch({ type: 'clear' }),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart должен вызываться внутри <CartProvider>');
  return ctx;
}
