import { Link } from 'react-router-dom';
import ButtonEye from '../ui/ButtonEye.jsx';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Строчка-разделитель поверх футера */}
      <div className={styles.seam} aria-hidden="true" />

      <div className={`page ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={`${styles.logo} eye-host`}>
            <ButtonEye size={22} />
            <span>Rita Dolls</span>
          </Link>
          <p className={styles.note}>
            Мастерская авторских кукол. Каждая работа существует
            в одном экземпляре и шьётся вручную.
          </p>
        </div>

        <nav className={styles.cols} aria-label="Футер">
          <div>
            <h4 className={styles.colTitle}>Смотреть</h4>
            <ul>
              <li><Link to="/catalog">Куклы</Link></li>
              <li><Link to="/gallery">Галерея</Link></li>
              <li><Link to="/constructor">Собрать свою</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.colTitle}>Узнать</h4>
            <ul>
              <li><Link to="/about">О мастерской</Link></li>
              <li><Link to="/faq">Вопросы</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.colTitle}>Написать</h4>
            <ul>
              <li><a href="mailto:hello@ritadolls.example">hello@ritadolls</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer noopener">Instagram</a></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={`page ${styles.base}`}>
        <span>© {new Date().getFullYear()} Rita Dolls</span>
        <span className={styles.stitchNote}>Сшито вручную · нитка за ниткой</span>
      </div>
    </footer>
  );
}
