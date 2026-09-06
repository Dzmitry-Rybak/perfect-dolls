import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCommission } from '../../context/CommissionContext.jsx';
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
  const { open: openCommission } = useCommission();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Полоса статус-бара закрывается отдельным элементом с position:fixed,
          а не псевдоэлементом внутри шапки. Sticky-шапка на iOS отстаёт при
          сворачивании панелей Safari и на миг обнажает текст под собой —
          fixed-элемент прибит к физическому верху экрана и не зависит ни от
          прокрутки, ни от контекста наложения внутри шапки. */}
      <div className={styles.topShield} aria-hidden="true" />

      <header className={styles.header}>
        <a href="#main" className={styles.skip}>К содержимому</a>

      <div className={`page ${styles.bar}`}>
        <Link to="/" className={`${styles.logo} eye-host`} onClick={() => setMenuOpen(false)}>
          <ButtonEye size={26} />
          <span className={styles.logoText}>Rita&nbsp;Dolls</span>
        </Link>

        <button
          className={styles.burger}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="visually-hidden">Меню</span>
          <span className={`${styles.burgerBox} ${menuOpen ? styles.burgerOpen : ''}`} aria-hidden="true">
            <i /><i /><i />
          </span>
        </button>

        <nav id="main-nav" className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <ul className={styles.list}>
            {NAV.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                className={styles.order}
                onClick={() => { setMenuOpen(false); openCommission(); }}
              >
                Заказать куклу
              </button>
            </li>
          </ul>
        </nav>
      </div>
      </header>
    </>
  );
}
