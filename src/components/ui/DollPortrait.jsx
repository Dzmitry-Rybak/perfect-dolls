import styles from './DollPortrait.module.css';

/**
 * Процедурный портрет куклы — заглушка вместо фотографий.
 * Форма и черты детерминированы по slug, так что каждая кукла
 * всегда выглядит одинаково, но отличается от соседей.
 * Заменяется на настоящее фото простой подменой на <img>.
 */

function hash(str) {
  let h = 0;
  for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function DollPortrait({ seed = 'doll', accent = '#FF96C9', alt = '', className = '' }) {
  const h = hash(seed);
  const id = `dp-${h.toString(36)}`;

  const hairStyle = h % 3;              // 0 каре · 1 длинные · 2 пучки
  const eyeHoles  = h % 2 === 0 ? 4 : 2;
  const mouth     = (h >> 2) % 3;       // 0 стежок · 1 крестики · 2 полуулыбка
  const hasBow    = (h >> 4) % 2 === 0;
  const skin      = ['#D8C9B4', '#C9B9A6', '#DCC6C6', '#B9AFA4'][h % 4];
  const hairCol   = ['#2A2230', '#4A2F3D', '#1B1620', '#3E2440'][(h >> 3) % 4];

  return (
    <svg
      className={`${styles.portrait} ${className}`}
      viewBox="0 0 200 260"
      role="img" aria-label={alt || 'Портрет куклы'}
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="38%" r="62%">
          <stop offset="0%"   stopColor={accent} stopOpacity="0.30" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={accent} stopOpacity="0.85" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.42" />
        </linearGradient>
      </defs>

      {/* Акварельное свечение позади */}
      <ellipse cx="100" cy="104" rx="86" ry="96" fill={`url(#${id}-glow)`} />

      {/* Тело / платье */}
      <path
        d="M100 132 C74 132 58 152 52 186 C47 214 50 236 54 246 L146 246 C150 236 153 214 148 186 C142 152 126 132 100 132 Z"
        fill={`url(#${id}-cloth)`}
      />
      {/* Шов по центру платья */}
      <path d="M100 138 V244" stroke="var(--ink)" strokeWidth="1.4"
            strokeDasharray="3 4" opacity="0.4" />

      {/* Руки */}
      <path d="M58 168 C40 178 32 200 34 222" stroke={skin} strokeWidth="11"
            strokeLinecap="round" fill="none" />
      <path d="M142 168 C160 178 168 200 166 222" stroke={skin} strokeWidth="11"
            strokeLinecap="round" fill="none" />

      {/* Шея */}
      <rect x="92" y="112" width="16" height="26" rx="7" fill={skin} />

      {/* Голова */}
      <ellipse cx="100" cy="82" rx="42" ry="46" fill={skin} />
      {/* Шов по лбу — тряпичная кукла */}
      <path d="M100 38 V126" stroke="var(--ink)" strokeWidth="1.2"
            strokeDasharray="2.5 3.5" opacity="0.3" />

      {/* Волосы */}
      {hairStyle === 0 && (
        <path d="M58 78 C58 46 76 32 100 32 C124 32 142 46 142 78 C142 66 132 58 122 58 L78 58 C68 58 58 66 58 78 Z"
              fill={hairCol} />
      )}
      {hairStyle === 1 && (
        <>
          <path d="M58 80 C58 46 76 32 100 32 C124 32 142 46 142 80 C142 66 132 58 122 58 L78 58 C68 58 58 66 58 80 Z"
                fill={hairCol} />
          <path d="M60 74 C50 110 52 146 58 168" stroke={hairCol} strokeWidth="15"
                strokeLinecap="round" fill="none" />
          <path d="M140 74 C150 110 148 146 142 168" stroke={hairCol} strokeWidth="15"
                strokeLinecap="round" fill="none" />
        </>
      )}
      {hairStyle === 2 && (
        <>
          <path d="M58 78 C58 46 76 32 100 32 C124 32 142 46 142 78 C142 66 132 58 122 58 L78 58 C68 58 58 66 58 78 Z"
                fill={hairCol} />
          <circle cx="52" cy="66" r="17" fill={hairCol} />
          <circle cx="148" cy="66" r="17" fill={hairCol} />
        </>
      )}

      {/* Глаза-пуговицы — главный мотив */}
      {[80, 120].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="82" r="12" fill={accent} />
          <circle cx={cx} cy="82" r="12" fill="none" stroke="var(--ink)"
                  strokeWidth="1" strokeDasharray="1.8 2.2" opacity="0.5" />
          <circle cx={cx - 4} cy="78.5" r="1.9" fill="var(--ink)" />
          <circle cx={cx + 4} cy="78.5" r="1.9" fill="var(--ink)" />
          {eyeHoles === 4 && (
            <>
              <circle cx={cx - 4} cy="85.5" r="1.9" fill="var(--ink)" />
              <circle cx={cx + 4} cy="85.5" r="1.9" fill="var(--ink)" />
              <path d={`M${cx - 4} 78.5 ${cx + 4} 85.5M${cx + 4} 78.5 ${cx - 4} 85.5`}
                    stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
          {eyeHoles === 2 && (
            <path d={`M${cx - 4} 78.5 H${cx + 4}`} stroke="var(--ink)"
                  strokeWidth="1.5" strokeLinecap="round" />
          )}
        </g>
      ))}

      {/* Румянец */}
      <ellipse cx="66" cy="98" rx="9" ry="5.5" fill={accent} opacity="0.28" />
      <ellipse cx="134" cy="98" rx="9" ry="5.5" fill={accent} opacity="0.28" />

      {/* Рот — вышит */}
      {mouth === 0 && (
        <path d="M88 106 H112" stroke="#8E3F5C" strokeWidth="2.4"
              strokeLinecap="round" strokeDasharray="4 3" />
      )}
      {mouth === 1 && (
        <g stroke="#C13F63" strokeWidth="2" strokeLinecap="round">
          <path d="M88 103 L94 109M94 103 L88 109" />
          <path d="M97 103 L103 109M103 103 L97 109" />
          <path d="M106 103 L112 109M112 103 L106 109" />
        </g>
      )}
      {mouth === 2 && (
        <path d="M88 104 Q100 113 112 104" stroke="#8E3F5C" strokeWidth="2.4"
              strokeLinecap="round" fill="none" strokeDasharray="4 3" />
      )}

      {/* Бантик */}
      {hasBow && (
        <g fill={accent} opacity="0.9">
          <path d="M100 40 L86 32 L86 48 Z" />
          <path d="M100 40 L114 32 L114 48 Z" />
          <circle cx="100" cy="40" r="4" />
        </g>
      )}
    </svg>
  );
}
