import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { sendMessageSocket, state } from '../../../store/store';
import { useLocation } from 'preact-iso';
import { DriverPreview } from '../../../components/DriverPreview/DriverPreview';
import styles from './styles.module.scss';

export function RoomsPageDesktop() {
  const { route } = useLocation();
  useEffect(() => {
    sendMessageSocket({ rooms: 'search', cmd: 'start' }, false);
  }, []);

  const [activeIndex, setActiveIndex] = useState(0); // Начинаем с "Коридор"
  const containerRef = useRef<HTMLDivElement>(null);
  const driversSelectRoom = state.value?.rooms?.[activeIndex]?.drivers;

  // Эта функция будет прокручивать контейнер так,
  // чтобы активная комната оказалась по центру
  const scrollToActive = () => {
    const container = containerRef.current;
    if (!container || !container.children.length) return;
    const activeItem = container.children[activeIndex] as HTMLElement;
    const containerWidth = container.offsetWidth;
    const itemOffset = activeItem.offsetLeft + activeItem.offsetWidth / 2;
    const scrollPosition = itemOffset - containerWidth / 2;
    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  };

  // Каждый раз, когда индекс активной комнаты меняется —
  // прокручиваем до неё
  useEffect(() => {
    scrollToActive();
  }, [activeIndex]);

  // Обработчик нажатия на стрелку "назад"
  const handlePrev = useCallback(() => {
    setActiveIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex(prev => Math.min(prev + 1, state.value.rooms.length - 1));
  }, [state.value.rooms]);

  return (
    <div className={styles.rooms}>
      <div className={styles.wrapperBtn}>
        <button className={styles.btn} id="device-btn-search">
          Удалить
        </button>
        <button
          className={styles.btn}
          id="device-btn-update"
          // onClick={handleUpdateDrivers}
        >
          Добавить
        </button>
      </div>
      <div className={styles.roomCarouselWrapper}>
        <button className={styles.arrow} onClick={handlePrev} disabled={activeIndex === 0}>
          «
        </button>
        <div className={styles.roomCarousel} ref={containerRef}>
          {state.value?.rooms?.map((room, index) => (
            <div
              key={room.idRoom + index}
              className={`${styles.roomItem} ${index === activeIndex ? styles.active : ''}`}
              onClick={() => {
                setActiveIndex(index);
              }}
            >
              {room.roomName}
            </div>
          ))}
        </div>
        <button
          className="arrow"
          onClick={handleNext}
          disabled={activeIndex === state.value.rooms.length - 1}
        >
          »
        </button>
      </div>
      <div id="drivers-list" className={styles.driversList}>
        {driversSelectRoom &&
          Object?.keys(driversSelectRoom)?.map(key => (
            <DriverPreview
              key={driversSelectRoom?.[`${key}`][0]}
              name={'Контейнер Контейнер'}
              type={driversSelectRoom?.[`${key}`][1]}
              address={driversSelectRoom?.[`${key}`][0]}
              onClick={() => route(`/service/devices/${driversSelectRoom?.[`${key}`][0]}`)}
            />
          ))}
      </div>
    </div>
  );
}
