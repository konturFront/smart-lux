import { h } from 'preact';
import styles from './styles.module.scss';

type ButtonProps = {
  text?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
};

export const Button = ({ text = 'Кнопка', onClick }: ButtonProps) => {
  return (
    <div
      className={styles.btn}
      id="device-btn-update"
      onClick={event => {
        onClick?.(event);
      }}
    >
      {`${text}`}
    </div>
  );
};
