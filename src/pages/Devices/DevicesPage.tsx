import styles from './styles.module.scss';
import { useCallback } from 'preact/hooks';
import { sendMessageSocket, state } from '../../store/store';
import { useLocation } from 'preact-iso';

export function DevicesPage() {
  const { route } = useLocation();
  const updateDrivers = useCallback(() => {
    sendMessageSocket({ driver: 'update', cmd: 'start' });
  }, []);

  return (
    <div className={styles.devices}>
      <div className={styles.wrapperBtn}>
        <button className={styles.btn} id="device-btn-search">
          Поиск устройств
        </button>
        <button className={styles.btn} id="device-btn-update" onClick={updateDrivers}>
          Обновить
        </button>
      </div>
      <div id="drivers-list" className={styles.driversList}>
        {Object.keys(state.value.updatedDevices).map(key => (
          <div
            key={state.value.updatedDevices?.[key][0]}
            className={styles.driverItem}
            onClick={() => {
              route(`/service/devices/${state.value.updatedDevices?.[key][0]}`);
            }}
          >
            <div>
              <strong>Адрес:</strong> {state.value.updatedDevices?.[key][0]}
            </div>
            <div>
              <strong>Тип:</strong> {state.value.updatedDevices?.[key][1]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
