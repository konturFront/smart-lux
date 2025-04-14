import { useCallback } from 'preact/hooks';
import { sendMessageSocket, state } from '../../../store/store';
import { useLocation } from 'preact-iso';
import { DriverPreview } from '../../../components/DriverPreview/DriverPreview';
import styles from './styles.module.scss';

export function SensorsPageDesktop() {
  const { route } = useLocation();

  const handleUpdateDrivers = useCallback(() => {
    sendMessageSocket({ driver: 'update', cmd: 'start' });
  }, []);

  return (
    <div className={styles.devices}>
      <div className={styles.wrapperBtn}>
        <button className={styles.btn} id="device-btn-search">
          Поиск устройств
        </button>
        <button className={styles.btn} id="device-btn-update" onClick={handleUpdateDrivers}>
          Обновить
        </button>
      </div>

      <div id="drivers-list" className={styles.driversList}>
        {Object.keys(state.value.updatedDevices).map(key => (
          <DriverPreview
            key={state.value.updatedDevices[key][0]}
            name={'Контейнер Контейнер'}
            type={state.value.updatedDevices[key][1]}
            address={state.value.updatedDevices[key][0]}
            onClick={() => route(`/service/devices/${state.value.updatedDevices[key][0]}`)}
          />
        ))}
      </div>
    </div>
  );
}
