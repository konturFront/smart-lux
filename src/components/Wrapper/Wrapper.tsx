import type { ComponentChildren } from 'preact';
import styles from './styles.module.scss';

export const Wrapper = ({ children }: { children?: ComponentChildren }) => {
  return <div className={styles.wrapper}>{children}</div>;
};
