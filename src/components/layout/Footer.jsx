import { Link } from 'react-router-dom';
import ButtonEye from '../ui/ButtonEye.jsx';
import { SOCIAL, EMAIL } from '../../data/site.js';
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
            <span>cutesmokey</span>
          </Link>
          <p className={styles.note}>
            Handmade plush squids, collectible dolls and drawn portraits.
            Everything is made to order and exists only once.
          </p>
        </div>

        <nav className={styles.cols} aria-label="Footer">
          <div>
            <h4 className={styles.colTitle}>Make</h4>
            <ul>
              <li><Link to="/builder">Build a squid</Link></li>
              <li><Link to="/squids">Squids</Link></li>
              <li><Link to="/dolls">Dolls</Link></li>
              <li><Link to="/portraits">Portraits</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.colTitle}>Look</h4>
            <ul>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/workshop">Workshop</Link></li>
              <li><Link to="/faq">Q&amp;A</Link></li>
              <li><Link to="/other">Other creations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.colTitle}>Find me</h4>
            <ul>
              <li><a href={SOCIAL.instagram} target="_blank" rel="noreferrer noopener">Instagram</a></li>
              <li><a href={SOCIAL.tiktok} target="_blank" rel="noreferrer noopener">TikTok</a></li>
              <li><a href={`mailto:${EMAIL.main}`}>{EMAIL.main}</a></li>
              <li><Link to="/pr">PR &amp; brands</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={`page ${styles.base}`}>
        <span>© {new Date().getFullYear()} cutesmokey</span>
        <span className={styles.stitchNote}>Sewn by hand · stitch by stitch</span>
      </div>
    </footer>
  );
}
