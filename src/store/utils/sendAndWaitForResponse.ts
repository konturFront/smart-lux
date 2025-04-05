// utils/socketUtils.ts

import { socketService } from '../../service/ws/socketService';
import { sendMessageSocket } from '../store';

export const sendAndWaitForResponse = <T = any>(
  request: Record<string, any>,
  filter: (data: any) => boolean,
  timeout = 30000
): Promise<T> => {
  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = socketService.onMessage(data => {
      if (filter(data)) {
        unsubscribe(); // Отписываемся
        clearTimeout(timer);
        resolve(data);
      }
    });
    socketService.send(request);

    timer = setTimeout(() => {
      unsubscribe();
      reject(new Error('Timeout waiting for WebSocket response'));
    }, timeout);
  });
};
