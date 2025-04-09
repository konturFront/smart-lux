import styles from './styles.module.scss';
import { useLocation } from 'preact-iso';

export function ServicePage() {
  const location = useLocation();

  return (
    <div className={styles.service}>
      <div className={styles.wrapperBtn}>
        <button
          className={styles.btn}
          id="service-btn-rooms"
          onClick={() => {
            location.route('/service/rooms');
          }}
        >
          Настройка помещений
        </button>
        <button
          className={styles.btn}
          id="service-btn-devices"
          onClick={() => {
            location.route('/service/devices');
          }}
        >
          Настройка устройств
        </button>
      </div>
    </div>
  );
}
