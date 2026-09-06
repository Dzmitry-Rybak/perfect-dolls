import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export default function Button({
  variant = 'primary', size = 'md', to, href,
  className = '', children, ...rest
}) {
  const cls = [styles.btn, styles[variant], styles[size], className]
    .filter(Boolean).join(' ');

  if (to)   return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button className={cls} {...rest}>{children}</button>;
}
