import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { sendMessageSocket, state } from '../../../store/store';
import { useLocation } from 'preact-iso';
import { DriverPreview } from '../../../components/DriverPreview/DriverPreview';
import styles from './styles.module.scss';
import { Modal } from '../../../components/Modal/Modal';

export function RoomsPageDesktop() {
  const { route } = useLocation();
  const [activeIndex, setActiveIndex] = useState(0); // Начинаем с "Коридор"
  const containerRef = useRef<HTMLDivElement>(null);
  const driversSelectRoom = state.value?.rooms?.[activeIndex]?.drivers;
  const selectRoom = state.value?.rooms?.[activeIndex];
  const [isOpenModal, setOpenModal] = useState(false);
  const [isAddRoomModal, setIsAddRoomModal] = useState(false);

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

  useEffect(() => {
    sendMessageSocket({ rooms: 'search', cmd: 'start' }, false);
  }, []);

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

  const handleDeleteRoom = useCallback(() => {
    setOpenModal(true);
  }, []);

  return (
    <div className={styles.rooms}>
      <div className={styles.wrapperBtn}>
        <button className={styles.btn} id="device-btn-search" onClick={handleDeleteRoom}>
          Удалить
        </button>
        <button
          className={styles.btn}
          id="device-btn-update"
          onClick={() => {
            setIsAddRoomModal(true);
          }}
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
              {room?.roomName}
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
      <Modal open={isOpenModal} onClose={() => setOpenModal(false)} maxWidth="md">
        <div style={{ padding: '16px' }}>
          <button onClick={() => setOpenModal(false)}>Закрыть</button>
          <h2 style={{ color: 'white' }}>
            {`Вы точно хотите удалить помещение:`}
            <br />
            <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              {selectRoom?.roomName}
            </span>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div
              className={styles.buttonCancel}
              style={{ textAlign: 'center' }}
              onClick={() => setOpenModal(false)}
            >
              Отмена
            </div>
            <div className={styles.buttonConfirm} style={{ textAlign: 'center' }}>
              Да
            </div>
          </div>
        </div>
      </Modal>
      {/*///ДОБАВИТЬ помещение*/}
      <Modal open={isAddRoomModal} onClose={() => setIsAddRoomModal(false)} maxWidth="md">
        <div style={{ padding: '16px' }}>
          <button onClick={() => setIsAddRoomModal(false)}>Закрыть</button>
          <h2 style={{ color: 'white' }}>{`Добавить помещение:`}</h2>
          <label>
            Название помещения:
            <input
              autoComplete="off"
              type="text"
              id="wifi-password"
              // value={password}
              // onInput={e => setPassword((e.target as HTMLInputElement).value)}
            />
          </label>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>
            <div
              className={styles.buttonCancel}
              style={{ textAlign: 'center' }}
              onClick={() => setIsAddRoomModal(false)}
            >
              Отмена
            </div>
            <div className={styles.buttonConfirm} style={{ textAlign: 'center' }}>
              Да
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
