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

export const Button = ({
  text = 'Кнопка',
  className = '',
  id,
  disabled = false,
  onClick,
  size = 'medium',
  fullWidth = false,
}: ButtonProps) => {
  // Формируем классы вручную
  // let buttonClasses = styles.btn;
  // buttonClasses += ` ${styles[`btn--${size}`]}`;
  //
  // if (fullWidth) buttonClasses += ` ${styles['btn--full-width']}`;
  // if (disabled) buttonClasses += ` ${styles['btn--disabled']}`;
  // if (className) buttonClasses += ` ${className}`;

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
