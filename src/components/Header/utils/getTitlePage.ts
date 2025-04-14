export const getTitle = (pathname: string) => {
  // если это главная
  if (pathname === '/') return 'Главная';

  // Страница со всеми устройствами
  if (pathname === '/service/devices') return 'Настройка драйверов';
  if (pathname === '/service/sensors') return 'Настройка сенсоров';

  // Страница конкретного устройства (startsWith = '/service/devices/')
  if (pathname.startsWith('/service/devices/')) return 'Драйвер';
  if (pathname.startsWith('/service/sensors/')) return 'Сенсор';

  // Страница «Помещения»
  if (pathname === '/service/rooms') return 'Настройка помещений';
  if (pathname === '/settings') return 'Настройка Wi-Fi';

  // Если ничего не подошло
  return 'Страница';
};
