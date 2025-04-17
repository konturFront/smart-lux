// mockSocketService.ts

interface MockSocketOptions {
  onLoadingEnd?: () => void; // Коллбэк для завершения загрузки
}

export class SocketService__Mock {
  private messageSubscribers: ((data: any) => void)[] = [];
  private statusSubscribers: ((status: any) => void)[] = [];

  private isConnected = false;

  private onLoadingEnd?: () => void;

  constructor(options: MockSocketOptions = {}) {
    this.onLoadingEnd = options.onLoadingEnd;
  }

  connect(_url: string) {
    setTimeout(() => {
      this.isConnected = true;
      this.notifyStatus('connected');
    }, 500);
  }

  disconnect() {
    this.isConnected = false;
    this.notifyStatus('disconnected');
  }

  reconnect() {
    this.disconnect();
    this.connect('');
  }

  send(data: Record<string | number, unknown>) {
    console.log('[MockSocket] Sending:', data);

    setTimeout(() => {
      // Обработка фейковых ответов
      if (data.driver === 'update') {
        const types = [2, 4, 6, 7, 96, 98, 128];
        const drivers = Object.fromEntries(
          Array.from({ length: 64 }, (_, i) => [
            `d${i}`,
            [i, types[Math.floor(Math.random() * types.length)]],
          ])
        );

        this.emitMessage({ driver: 'update', count: 64, drivers });
      }

      if (data.master === 'scan') {
        const networks = ['MyWiFi', 'OfficeNet', 'Guest123'];
        this.emitMessage({ master: 'scan', cmd: 'stop', ssid: networks });
      }

      if (data.master === 'net') {
        this.emitMessage({ master: 'net', cmd: 'ok' });
      }

      if (
        data.driver === 'settyngs' &&
        data.cmd === 'download' &&
        typeof data.addres === 'number'
      ) {
        this.emitMessage({
          driver: 'settyngs',
          cmd: 'download',
          dr_settyngs: [data.addres, 156, 156, 30, 50, 30, 50, 5, 2, 55],
        });
      }

      // запрос по комнатам
      if (data.rooms === 'search' && data.cmd === 'start') {
        this.emitMessage({
          rooms: 'search',
          cmd: 'download',
          roomsArr: [
            {
              idRoom: 'koridor1',
              roomName: 'Коридор',
              drivers: { d0: [0, 1], d1: [1, 4] },
            },
            { idRoom: 'koridor3', roomName: 'Спальня', drivers: { d0: [4, 7], d1: [5, 4] } },
            { idRoom: 'koridor5', roomName: 'Прихожая', drivers: { d0: [8, 98], d1: [9, 4] } },
            { idRoom: 'koridor9', roomName: 'Кладовая', drivers: { d0: [14, 7], d1: [15, 4] } },
            { idRoom: 'koridor10', roomName: 'Подьезд', drivers: { d0: [16, 7], d1: [17, 4] } },
            {
              idRoom: 'koridor11',
              roomName: 'Гостинная',
              drivers: {
                d6: [24, 4],
                d7: [25, 4],
                d8: [26, 6],
              },
              groups: [
                {
                  idGroup: 'gLivingMain',
                  groupName: 'Центральный свет',
                  driverAddresses: { d0: [18, 7], d1: [19, 4], d2: [20, 4] },
                },
                {
                  idGroup: 'gLivingWall1',
                  groupName: 'Уход',
                  driverAddresses: { d3: [21, 6], d4: [22, 4], d5: [23, 8] },
                },
                {
                  idGroup: 'gLivingWall2',
                  groupName: 'Встреча гостей',
                  driverAddresses: { d3: [21, 6], d4: [22, 4], d5: [23, 8] },
                },
                {
                  idGroup: 'gLivingWall3',
                  groupName: 'Романтика',
                  driverAddresses: { d3: [21, 6], d4: [22, 4], d5: [23, 8] },
                },
                {
                  idGroup: 'gLivingWall4',
                  groupName: 'Свет везде',
                  driverAddresses: { d3: [21, 6], d4: [22, 4], d5: [23, 8] },
                },
                {
                  idGroup: 'gLivingWall5',
                  groupName: 'Подсветка по периметру',
                  driverAddresses: { d3: [21, 6], d4: [22, 4], d5: [23, 8] },
                },
              ],
            },
          ],
        });
      }

      this.emitMessage({
        str: 'Ответ не обработан в тестовых данных, возвращаю строку для отработки лоадера',
      });
    }, 1000);
  }

  onMessage(cb: (data: any) => void) {
    this.messageSubscribers.push(cb);
  }

  onStatus(cb: (status: any) => void) {
    this.statusSubscribers.push(cb);
  }

  private notifyStatus(status: any) {
    this.statusSubscribers.forEach(cb => cb(status));
  }

  private emitMessage(data: any) {
    this.messageSubscribers.forEach(cb => cb(data));
  }
}
