import styles from './styles.module.scss';
import { useCallback } from 'preact/hooks';
import { sendMessageSocket, state } from '../../store/store';
import { useLocation } from 'preact-iso';
import { DriverPreview } from '../../components/DriverPreview/DriverPreview';

export function DevicesPage() {
  const { route } = useLocation();
  const updateDrivers = useCallback(() => {
    sendMessageSocket({ driver: 'update', cmd: 'start' });
  }, []);
  console.log('state.value.updatedDevices', state.value.updatedDevices);
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
          <DriverPreview
            key={state.value.updatedDevices[key][0]}
            name={'Тестовое имя драйвера'}
            type={state.value.updatedDevices[key][1]}
            channelNumber={state.value.updatedDevices[key][0]}
            onClick={() => route(`/service/devices/${state.value.updatedDevices[key][0]}`)}
          />
        ))}
      </div>
    </div>
  );
}
