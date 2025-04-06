import { h } from 'preact';
import styles from './styles.module.scss';

export function LedIndicator() {
  return (
    <div className={styles.container}>
      <span className={styles.label}>LED</span>
      <div className={styles.triangle} />
    </div>
  );
}
