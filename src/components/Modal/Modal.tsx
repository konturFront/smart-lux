import { JSX } from 'preact';
import styles from './styles.module.scss';
import { useEffect } from 'preact/hooks';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element | JSX.Element[];
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
}

const widthMap = {
  xs: '360px',
  sm: '480px',
  md: '600px',
  lg: '800px',
  xl: '1000px',
};

export function Modal({
  open,
  onClose,
  children,
  maxWidth = 'sm',
  fullWidth = false,
  fullScreen = false,
}: ModalProps) {
  // Закрытие по Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${fullScreen ? styles.fullScreen : ''}`}
        style={{
          maxWidth: fullScreen ? '100%' : fullWidth ? '100%' : widthMap[maxWidth],
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
