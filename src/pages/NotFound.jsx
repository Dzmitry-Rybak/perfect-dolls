import Button from '../components/ui/Button.jsx';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={`page ${styles.wrap}`}>
      <div className={styles.figure}>
        <DollPortrait seed="lost-doll" accent="#8E8496" alt="Потерявшаяся кукла" />
      </div>
      <div className={styles.copy}>
        <p className="eyebrow">Страница 404</p>
        <h1 className={styles.title}>Здесь никого нет</h1>
        <p className={`prose ${styles.text}`}>
          Либо страницу убрали, либо кукла ушла сама. Она это иногда делает —
          мы стараемся не думать об этом слишком часто.
        </p>
        <div className={styles.actions}>
          <Button to="/">На главную</Button>
          <Button to="/catalog" variant="stitched">В каталог</Button>
        </div>
      </div>
    </div>
  );
}
