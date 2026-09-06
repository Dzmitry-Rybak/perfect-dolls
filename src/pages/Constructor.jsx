import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageShell from '../components/layout/PageShell.jsx';
import DollCanvas from '../components/constructor/DollCanvas.jsx';
import LayerPicker from '../components/constructor/LayerPicker.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';
import { getConstructorParts, submitBuild } from '../lib/api.js';
import { defaultBuild } from '../data/constructorParts.js';
import useAsync from '../lib/useAsync.js';
import { formatPrice } from '../lib/format.js';
import styles from './Constructor.module.css';

export default function Constructor() {
  const { data, loading } = useAsync(() => getConstructorParts(), []);
  // Сборка живёт в URL: ссылку можно скинуть, перезагрузка не теряет выбор
  const [params, setParams] = useSearchParams();
  const [sent, setSent] = useState(null);
  const [sending, setSending] = useState(false);

  const build = useMemo(() => {
    const b = { ...defaultBuild };
    for (const key of Object.keys(defaultBuild)) {
      const v = params.get(key);
      if (v) b[key] = v;
    }
    return b;
  }, [params]);

  // Плоский словарь id → деталь, чтобы канвас не искал линейно по каждому слою
  const partsById = useMemo(() => {
    if (!data) return {};
    return Object.values(data.parts).flat()
      .reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
  }, [data]);

  const total = useMemo(() => {
    if (!data) return 0;
    return Object.values(build)
      .reduce((sum, id) => sum + (partsById[id]?.priceDelta ?? 0), data.basePrice);
  }, [build, partsById, data]);

  const select = (layerId, partId) => {
    const next = { ...build, [layerId]: partId };
    setParams(next, { replace: true });
    setSent(null);
  };

  const reset = () => { setParams({}, { replace: true }); setSent(null); };

  const send = async () => {
    setSending(true);
    const result = await submitBuild(build);
    setSending(false);
    setSent(result);
  };

  if (loading) return <div className="page"><Loader label="Раскладываю коробку с пуговицами…" /></div>;

  const summary = Object.keys(defaultBuild)
    .map((layer) => partsById[build[layer]]?.name)
    .filter(Boolean);

  return (
    <PageShell
      eyebrow="Конструктор"
      title="Соберите свою куклу"
      lead="Выберите то, из чего она будет сшита. Цена пересчитывается сразу, а ссылка на сборку хранит ваш выбор — её можно отправить мне или показать кому-нибудь."
    >
      <div className={styles.desk}>
        {/* --- лист в клеточку с куклой --- */}
        <div className={styles.sheetWrap}>
          <div className={styles.sheet}>
            <span className={styles.tapeL} aria-hidden="true" />
            <span className={styles.tapeR} aria-hidden="true" />
            <span className={styles.margin} aria-hidden="true" />

            <p className={styles.sheetTitle}>эскиз №{Object.values(build).join('').length}</p>
            <DollCanvas build={build} partsById={partsById} />
            <p className={styles.sheetNote}>
              {summary.slice(0, 3).join(' · ')}
            </p>
          </div>
        </div>

        {/* --- выбор слоёв --- */}
        <div className={styles.panel}>
          {data.layers.map((layer) => (
            <LayerPicker
              key={layer.id}
              layer={layer}
              options={data.parts[layer.id]}
              selected={build[layer.id]}
              onSelect={select}
            />
          ))}

          {/* --- бирка с итогом --- */}
          <div className={styles.total}>
            <div className={styles.totalTag}>
              <span className={styles.totalLabel}>Примерная цена</span>
              <strong className={styles.totalValue}>{formatPrice(total)}</strong>
            </div>

            <div className={styles.totalActions}>
              <Button onClick={send} disabled={sending}>
                {sending ? 'Отправляю…' : 'Оставить заявку'}
              </Button>
              <button className={styles.reset} onClick={reset}>Начать заново</button>
            </div>
          </div>

          {sent && (
            <p className={styles.sent} role="status">
              Заявка <code>{sent.id}</code> записана. Это макет — настоящая
              отправка появится вместе с бэкендом.
            </p>
          )}

          <p className={styles.disclaimer}>
            Цена ориентировочная: окончательную назову, когда обсудим ткани.
            Некоторые сочетания требуют больше времени, чем кажется.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
