import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import ButtonEye from '../ui/ButtonEye.jsx';
import styles from './Header.module.css';

const NAV = [
  { to: '/catalog',     label: 'Куклы' },
  { to: '/constructor', label: 'Конструктор' },
  { to: '/gallery',     label: 'Галерея' },
  { to: '/about',       label: 'Мастерская' },
  { to: '/faq',         label: 'Вопросы' },
];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <a href="#main" className={styles.skip}>К содержимому</a>

      <div className={`page ${styles.bar}`}>
        <Link to="/" className={`${styles.logo} eye-host`} onClick={() => setOpen(false)}>
          <ButtonEye size={26} />
          <span className={styles.logoText}>Rita&nbsp;Dolls</span>
        </Link>

        <button
          className={styles.burger}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">Меню</span>
          <span className={`${styles.burgerBox} ${open ? styles.burgerOpen : ''}`} aria-hidden="true">
            <i /><i /><i />
          </span>
        </button>

        <nav id="main-nav" className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          <ul className={styles.list}>
            {NAV.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/cart"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${styles.link} ${styles.cart} ${isActive ? styles.active : ''}`}
              >
                Корзина
                {count > 0 && <span className={styles.badge}>{count}</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
