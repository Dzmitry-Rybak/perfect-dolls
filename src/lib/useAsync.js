import { useEffect, useState } from 'react';

/**
 * Единый хук загрузки для всех страниц. Отменяет применение
 * результата, если компонент размонтировался или зависимости
 * сменились — иначе быстрый клик по фильтрам покажет старые данные.
 */
export default function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    fn()
      .then((data) => { if (alive) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (alive) setState({ data: null, loading: false, error }); });

    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
