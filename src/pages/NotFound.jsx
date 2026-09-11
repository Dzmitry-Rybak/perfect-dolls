import Button from '../components/ui/Button.jsx';
import DollPortrait from '../components/ui/DollPortrait.jsx';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={`page ${styles.wrap}`}>
      <div className={styles.figure}>
        <DollPortrait seed="lost-one" accent="#8E8496" alt="" />
      </div>
      <div className={styles.copy}>
        <p className="eyebrow">Page 404</p>
        <h1 className={styles.title}>Nobody here</h1>
        <p className={`prose ${styles.text}`}>
          Either the page was taken down, or something wandered off on its own.
          They do that occasionally — we try not to dwell on it.
        </p>
        <div className={styles.actions}>
          <Button to="/">Back home</Button>
          <Button to="/builder" variant="stitched">Build a squid</Button>
        </div>
      </div>
    </div>
  );
}
