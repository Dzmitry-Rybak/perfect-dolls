import { useState } from 'react';
import { Link } from 'react-router-dom';
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
 * Блок продукта на главной — полароид Риты с подписью раздела от руки.
 *
 * Снимок лежит ПОД рамкой и виден в её прозрачное окно; положение окна
 * в каждой рамке своё (section.frame.win, см. data/nav.js). Где снимка
 * нет (пока «Other creations») — процедурная заглушка.
 *
 * Название раздела уже написано на рамке, поэтому заголовок скрыт
 * от глаз и остаётся для скринридера и ссылки на всю карточку.
 *
 * При наведении карточка перетекает на вторую работу того же раздела.
 */
export default function SectionCard({ section }) {
  const hoverable = useHoverCapable();
  const { frame } = section;
  const [l, t, w, h] = frame.win;

  return (
    <article className={styles.card} style={{ '--tilt': `${section.tilt ?? 0}deg` }}>
      <div className={styles.polaroid} style={{ aspectRatio: `${frame.w} / ${frame.h}` }}>
        <div
          className={styles.media}
          style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%` }}
        >
          {section.photo ? (
            <>
              <Photo
                src={section.photo}
                srcSet={section.photoSrcSet}
                sizes={section.photoSizes}
                alt={section.photoAlt ?? ''}
              />
              {hoverable && section.photoHover && (
                <Photo
                  className={styles.swap}
                  src={section.photoHover}
                  srcSet={section.photoHoverSrcSet}
                  sizes={section.photoSizes}
                  alt=""
                  aria-hidden="true"
                />
              )}
            </>
          ) : (
            <DollPortrait seed={section.id} accent={section.accent} alt="" />
          )}
        </div>
        <img
          className={styles.frame}
          src={frame.src}
          alt=""
          aria-hidden="true"
          width={frame.w}
          height={frame.h}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
      <div className={styles.body}>
        <h3 className="visually-hidden">
          <Link to={section.to} className={styles.stretch}>{section.label}</Link>
        </h3>
        <p className={styles.blurb}>{section.blurb}</p>
        <span className={styles.go} aria-hidden="true">look →</span>
      </div>
    </article>
  );
}
