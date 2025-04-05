import styles from './styles.module.scss';
import { useCallback, useState } from 'preact/hooks';
import { reconnectWS, sendMessageSocket, state } from '../../store/store';

export const SettingsPage = () => {
  const [mode, setMode] = useState<'host' | 'ap'>('host');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [reUrl, setReUrl] = useState('');

  const resetMaster = useCallback(() => {
    sendMessageSocket({ master: 'reset', cmd: 'start' });
  }, []);

  const reConnectWS = useCallback(() => {
    if (reUrl.length > 0) {
      reconnectWS(reUrl);
      state.value = { ...state.value, socketURL: reUrl };
    }
  }, [reUrl]);

  const saveSettingsWifi = useCallback(() => {
    if (ssid.trim() && password.trim()) {
      sendMessageSocket({
        master: 'net',
        cmd: 'save',
        mode,
        ssid,
        password,
      });
    } else {
      alert('Пожалуйста, введите SSID и пароль');
    }
  }, [ssid, password, mode]);

  const scanWifiNet = useCallback(() => {
    sendMessageSocket({ master: 'scan', cmd: 'start' });
  }, []);

  return (
    <div className={styles.settings}>
      <div className={styles.settingsPanel}>
        <button className={styles.btn} onClick={resetMaster}>
          Перезагрузка Мастера
        </button>
        <h2>Настройки Wi-Fi</h2>
        <div className={styles.panel}>
          <label>
            Режим подключения:
            <select
              value={mode}
              onChange={e => {
                setMode((e.target as HTMLSelectElement).value as 'host' | 'ap');
              }}
            >
              <option value="host">host</option>
              <option value="ap">ap</option>
            </select>
          </label>
          <label>
            SSID:
            <input
              autoComplete="off"
              type="text"
              id="wifi-ssid"
              placeholder="Введите SSID"
              value={ssid}
              onInput={e => setSsid((e.target as HTMLInputElement).value)}
            />
          </label>
          <label>
            Пароль:
            <input
              autoComplete="off"
              type="text"
              id="wifi-password"
              placeholder="Введите пароль"
              value={password}
              onInput={e => setPassword((e.target as HTMLInputElement).value)}
            />
          </label>
          <button className={styles.btn} onClick={saveSettingsWifi}>
            Сохранить настройки Wi-Fi
          </button>
          <label style={{ marginTop: '20px' }}>
            URL WebSocket-сервера:
            <div className={styles.wsUrlWrapper}>
              <input
                type="text"
                value={reUrl}
                onInput={e => {
                  setReUrl((e.target as HTMLInputElement).value);
                }}
              />
              <button className={styles.btn} onClick={reConnectWS}>
                Переподключить сокет
              </button>
            </div>
          </label>
        </div>

        <h2>Сканирование сетей Wi-Fi</h2>
        <button className={styles.btn} onClick={scanWifiNet}>
          Сканировать сети
        </button>

        <div className={styles.wifiNetworks}>
          {state.value.wifiNetworks.map(item => (
            <div className={styles.wifiTag} onClick={() => setSsid(item)}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
