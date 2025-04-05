import styles from './styles.module.scss';
import { stateUI } from '../../store/store';
import { useLocation } from 'preact-iso';
import { useCallback, useEffect, useRef } from 'preact/hooks';

export const Drawer = () => {
  const { url, route } = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  const handlerChangeRoute = useCallback((str: string) => {
    stateUI.value = { ...stateUI.value, isActiveMenu: false };
    route(str);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        stateUI.value = { ...stateUI.value, isActiveMenu: false };
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={drawerRef}
      className={`${styles.drawer} ${stateUI.value.isActiveMenu ? styles.active : ''}`}
    >
      <div className={styles.menu}>
        <div
          className={url === '/' ? styles.activeLink : ''}
          onClick={() => handlerChangeRoute('/')}
        >
          {'Главная'}
        </div>
        <div
          className={url === '/service' ? styles.activeLink : ''}
          onClick={() => handlerChangeRoute('/service')}
        >
          {'Сервис'}
        </div>
        <div
          className={url === '/settings' ? styles.activeLink : ''}
          onClick={() => handlerChangeRoute('/settings')}
        >
          {'Настройки'}
        </div>
      </div>
    </div>
  );
};
