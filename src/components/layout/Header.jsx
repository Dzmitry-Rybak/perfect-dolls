import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV } from '../../data/nav.js';
import ButtonEye from '../ui/ButtonEye.jsx';
import { useOrders } from '../../context/OrdersContext.jsx';
import styles from './Header.module.css';



export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const orders = useOrders();

  return (
    <>
      {/* Полоса статус-бара закрывается отдельным элементом с position:fixed,
          а не псевдоэлементом внутри шапки. Sticky-шапка на iOS отстаёт при
          сворачивании панелей Safari и на миг обнажает текст под собой —
          fixed-элемент прибит к физическому верху экрана и не зависит ни от
          прокрутки, ни от контекста наложения внутри шапки. */}
      <div className={styles.topShield} aria-hidden="true" />

      <header className={styles.header}>
        <a href="#main" className={styles.skip}>Skip to content</a>

      <div className={`page ${styles.bar}`}>
        <Link to="/" className={`${styles.logo} eye-host`} onClick={() => setMenuOpen(false)}>
          <ButtonEye size={26} />
          <span className={styles.logoText}>cutesmokey</span>
        </Link>

        <button
          className={styles.burger}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="visually-hidden">Menu</span>
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
              <NavLink
                to="/builder"
                onClick={() => setMenuOpen(false)}
                className={styles.order}
              >
                Build a squid
              </NavLink>
            </li>
            {/* Ручка мастерской: открывает и закрывает приём заказов.
                Выбор запоминается в браузере до появления админки. */}
            <li>
              <button
                type="button"
                className={`${styles.gate} ${orders.open ? styles.gateOn : ''}`}
                role="switch"
                aria-checked={orders.open}
                onClick={orders.toggle}
              >
                <span className={styles.gateKnob} aria-hidden="true" />
                <span className={styles.gateText}>
                  Orders {orders.open ? 'open' : 'closed'}
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      </header>
    </>
  );
}
