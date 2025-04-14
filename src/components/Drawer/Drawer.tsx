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
          className={url === '/service/devices' ? styles.activeLink : ''}
          onClick={() => handlerChangeRoute('/service/devices')}
        >
          {'Настройка драйверов'}
        </div>
        <div
          className={url === '/service/sensors' ? styles.activeLink : ''}
          onClick={() => handlerChangeRoute('/service/sensors')}
        >
          {'Настройка сенсоров'}
        </div>
        <div
          className={url === '/service/rooms' ? styles.activeLink : ''}
          onClick={() => handlerChangeRoute('/service/rooms')}
        >
          {'Настройка помещений'}
        </div>
        <div
          className={url === '/settings' ? styles.activeLink : ''}
          onClick={() => handlerChangeRoute('/settings')}
        >
          {'Настройка Wi-Fi'}
        </div>
        <div
          className={url === '/test' ? styles.activeLink : ''}
          onClick={() => handlerChangeRoute('/test')}
        >
          {'TEST'}
        </div>
      </div>
    </div>
  );
};
