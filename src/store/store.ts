import { signal } from '@preact/signals';
import { socketService } from '../service/ws/socketService';
import { GLOBAL_WS_URL } from '../global/value';

export enum socketStatusEnum {
  PENDING = 'pending',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

// Тип для состояния устройства
export interface AppState {
  socketURL: string;
  socketStatus: socketStatusEnum;
  wifiNetworks: string[];
  groups: boolean[];
  updatedDevices: Record<string, string[]>;
  settingsDriver: number[];
}

export interface IStateUI {
  isActiveMenu: boolean;
  isLoadingUI: boolean;
}

// Начальное состояние
export const state = signal<AppState>({
  socketURL: GLOBAL_WS_URL,
  socketStatus: socketStatusEnum.DISCONNECTED,
  wifiNetworks: [],
  settingsDriver: [],
  // updatedDevices: { d1: [1, 2], d2: [4, 5] },
  updatedDevices: {},
  groups: Array(16).fill(false),
});
export const stateUI = signal<IStateUI>({ isActiveMenu: false, isLoadingUI: false });

// Методы обновления состояния

// Реконнетк для изменения урла для сокета
export const reconnectWS = (url: string) => {
  socketService.reconnect(url);
};
// Метод для появляется лоадинг в шапке
export const showLoadingStateUI = () => {
  stateUI.value = { ...stateUI.value, isLoadingUI: true };
};
// Метод для скрытия лоадинг в шапке
export const hiddenLoadingStateUI = () => {
  stateUI.value = { ...stateUI.value, isLoadingUI: false };
};

export const setGroups = (groups: boolean[]) => {
  state.value = { ...state.value, groups };
};

// export const setDeviceSettings = (settings: number[]) => {
//   state.value = { ...state.value, deviceSettings: settings };
// };

export const setWifiNetworks = (networks: string[]) => {
  state.value = { ...state.value, wifiNetworks: networks };
};

export const setConnectionStatus = (status: socketStatusEnum) => {
  state.value = { ...state.value, socketStatus: status };
};

// Пример инициализации сокета с подпиской
socketService.onStatus(status => {
  setConnectionStatus(status as socketStatusEnum);
});
// Отправка данных сокет с возмоностью выключить лоадинг
export const sendMessageSocket = (data: Record<string | number, unknown>, withLoading = true) => {
  withLoading && showLoadingStateUI();
  socketService.send(data);
};

//ЛОВИМ ответы от сервера для стора, для локального состояния используй sendAndWaiFor Response
socketService.onMessage(data => {
  hiddenLoadingStateUI();
  if (data.driver === 'settyngs' && data.cmd === 'download' && Array.isArray(data.dr_settyngs)) {
    state.value = { ...state.value, settingsDriver: data.dr_settyngs };
    hiddenLoadingStateUI();
  }

  // Ответное сообщение о перезагрузке «Мастера» (server->client):
  if (data.master === 'reset' && data.cmd === 'ok') {
    hiddenLoadingStateUI();
  }

  //Пакет данных, передаваемый по окончании процедуры «обновления» драйверов (server->client):
  if (data.driver === 'update' && data.count !== undefined) {
    state.value = { ...state.value, updatedDevices: data.drivers };
    hiddenLoadingStateUI();
  }

  // Ответное сообщение о сохранении настроек Wi-Fi (server->client):
  if (data.master === 'net' && data.cmd === 'ok') {
    hiddenLoadingStateUI();
  }
  // Ответное сообщение после сканирования сетей Wi-Fi (server->client):
  if (data.master === 'scan' && data.cmd === 'stop' && Array.isArray(data.ssid)) {
    setWifiNetworks(data.ssid);
    hiddenLoadingStateUI();
  }
});
