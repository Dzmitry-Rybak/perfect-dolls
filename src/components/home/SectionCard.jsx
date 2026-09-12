import { useState } from 'react';
import { Link } from 'react-router-dom';
import StitchCard from '../ui/StitchCard.jsx';
import DollPortrait from '../ui/DollPortrait.jsx';
import Photo from '../ui/Photo.jsx';
import styles from './SectionCard.module.css';

/**
 * Умеет ли устройство наводить курсор.
 *
 * От этого зависит, класть ли в разметку второй снимок. Спрятать его
 * одним CSS не выйдет: даже с display: none браузер его скачает, и на
 * телефоне это лишние полмегабайта ради эффекта, которого там не будет.
 * Читаем один раз при монтировании — мышь посреди сессии не отрастает.
 */
const useHoverCapable = () =>
  useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches
  )[0];

/**
 * Блок продукта на главной. Где есть настоящий снимок — он; где нет
 * (пока только «Other creations») — процедурная заглушка.
 *
 * При наведении карточка перетекает на вторую работу того же раздела.
 */
export default function SectionCard({ section }) {
  const hoverable = useHoverCapable();

  return (
    <StitchCard as="article" seed={section.id} interactive className={styles.card}>
      <div className={styles.media}>
        {section.photo ? (
          <>
            <Photo src={section.photo} alt={section.photoAlt ?? ''} />
            {hoverable && section.photoHover && (
              <Photo
                className={styles.swap}
                src={section.photoHover}
                alt=""
                aria-hidden="true"
              />
            )}
          </>
        ) : (
          <DollPortrait seed={section.id} accent={section.accent} alt="" />
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link to={section.to} className={styles.stretch}>{section.label}</Link>
        </h3>
        <p className={styles.blurb}>{section.blurb}</p>
        <span className={styles.go} aria-hidden="true">look →</span>
      </div>
    </StitchCard>
  );
}
