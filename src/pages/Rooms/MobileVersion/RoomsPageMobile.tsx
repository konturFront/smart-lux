import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { sendMessageSocket, state } from '../../../store/store';
import { useLocation } from 'preact-iso';
import { DriverPreview } from '../../../components/DriverPreview/DriverPreview';
import stylesMobile from './stylesMobile.module.scss';
import { Modal } from '../../../components/Modal/Modal';

export function RoomsPageMobile() {
  const refTest = useRef<HTMLDivElement>(null);
  const { route } = useLocation();
  const [page, setPage] = useState(1);
  const [currentItems, setCurrentItems] = useState<string[]>([]);
  const [countPages, setCountPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [activeIndex, setActiveIndex] = useState(0); // Начинаем с "Коридор"
  const containerRef = useRef<HTMLDivElement>(null);
  const driversSelectRoom = state.value?.rooms?.[activeIndex]?.drivers;
  const [isOpenModal, setOpenModal] = useState(false);
  const [isAddRoomModal, setIsAddRoomModal] = useState(false);
  const selectRoom = state.value?.rooms?.[activeIndex];

  useEffect(() => {
    sendMessageSocket({ rooms: 'search', cmd: 'start' }, false);
  }, []);

  useEffect(() => {
    scrollToActive();
  }, [activeIndex]);

  useEffect(() => {
    if (refTest.current) {
      const totalHeight = refTest.current.getBoundingClientRect().height;
      const driverHeight = 60;
      const gap = 16;
      const paddingTop = 20;
      const visibleItems = Math.round((totalHeight - paddingTop + gap) / (driverHeight + gap));
      const calculated = Math.max(1, visibleItems);
      setItemsPerPage(calculated);
    }
  }, [refTest.current]);

  // Считаем страницы и текущий срез
  useEffect(() => {
    const arr = Object.keys(driversSelectRoom ?? {});
    if (arr.length > 0) {
      const _countPages = Math.ceil(arr.length / itemsPerPage);
      setCountPages(_countPages);

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const sliced = arr.slice(startIndex, endIndex);
      setCurrentItems(sliced);
    } else {
      setCurrentItems([]);
      setCountPages(1);
    }
  }, [driversSelectRoom, page, itemsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [activeIndex]);

  // Эта функция будет прокручивать контейнер так,
  // чтобы активная комната оказалась по центру
  const scrollToActive = () => {
    const container = containerRef.current;
    if (!container || !container.children.length) return;
    const activeItem = container.children[activeIndex] as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeItem.getBoundingClientRect();

    const scrollOffset =
      activeRect.left + activeRect.width / 2 - (containerRect.left + containerRect.width / 2);
    container.scrollBy({ left: scrollOffset, behavior: 'smooth' });
  };

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
    <div className={stylesMobile.devices}>
      <div className={stylesMobile.wrapperBtn}>
        <button className={stylesMobile.btn} id="device-btn-search" onClick={handleDeleteRoom}>
          Удалить
        </button>
        <button
          className={stylesMobile.btn}
          id="device-btn-update"
          onClick={() => {
            setIsAddRoomModal(true);
          }}
        >
          Добавить
        </button>
      </div>
      <div className={stylesMobile.roomCarouselWrapper}>
        <div
          style={{
            fontSize: '38px',
            visibility: activeIndex === 0 - 1 ? 'hidden' : 'visible',
          }}
          className={stylesMobile.arrowPagination}
          onClick={handlePrev}
        >
          &laquo;
        </div>
        <div className={stylesMobile.roomCarousel} ref={containerRef}>
          {state.value?.rooms?.map((room, index) => (
            <div
              key={room.idRoom + index}
              className={`${stylesMobile.roomItem} ${index === activeIndex ? stylesMobile.active : ''}`}
              onClick={() => {
                setActiveIndex(index);
              }}
            >
              {room.roomName}
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: '38px',
            visibility: activeIndex === state.value.rooms.length - 1 ? 'hidden' : 'visible',
          }}
          className={stylesMobile.arrowPagination}
          onClick={handleNext}
        >
          &raquo;
        </div>
      </div>
      <div id="drivers-list" className={stylesMobile.driversList} ref={refTest}>
        {currentItems.map(address => {
          const driver = driversSelectRoom?.[address];
          return driver ? (
            <DriverPreview
              key={driver[0]}
              name={'Контейнер Контейнер'}
              type={driver[1]}
              address={driver[0]}
              onClick={() => route(`/service/devices/${driver[0]}`)}
            />
          ) : null;
        })}
      </div>
      {/*ПАГИНАЦИЯ*/}
      <div className={stylesMobile.paginationBar}>
        <div className={stylesMobile.navigation}>
          <div
            style={{
              marginRight: '5px',
              visibility: page === 1 ? 'hidden' : 'visible',
              fontSize: '38px',
            }}
            className={stylesMobile.arrowPagination}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
          >
            &laquo;
          </div>
          <div className={stylesMobile.totalCount}>
            {driversSelectRoom && Object?.keys(driversSelectRoom)?.length}
          </div>
          <div
            style={{
              marginLeft: '5px',
              visibility: page === countPages ? 'hidden' : 'visible',
              fontSize: '38px',
            }}
            className={stylesMobile.arrowPagination}
            onClick={() => setPage(p => Math.min(p + 1, countPages))}
          >
            &raquo;
          </div>
        </div>
        <div className={stylesMobile.dotsWrapper}>
          {countPages > 0 && (
            <div className={stylesMobile.dots}>
              {Array.from({ length: countPages }).map((_, index) => (
                <span
                  key={index}
                  className={`${stylesMobile.dot} ${page === index + 1 ? stylesMobile.active : ''}`}
                  onClick={() => setPage(index + 1)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal open={isOpenModal} onClose={() => setOpenModal(false)} maxWidth="md">
        <div style={{ padding: '12px' }}>
          <button onClick={() => setOpenModal(false)}>Закрыть</button>
          <h2 style={{ color: 'white' }}>
            {`Вы точно хотите удалить помещение:`}
            <br />
            <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              {selectRoom?.roomName}
            </span>
          </h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div
              className={stylesMobile.buttonCancel}
              style={{ textAlign: 'center' }}
              onClick={() => setOpenModal(false)}
            >
              Отмена
            </div>
            <div className={stylesMobile.buttonConfirm} style={{ textAlign: 'center' }}>
              Да
            </div>
          </div>
        </div>
      </Modal>
      {/*///ДОБАВИТЬ помещение*/}
      <Modal open={isAddRoomModal} onClose={() => setIsAddRoomModal(false)} maxWidth="md">
        <div style={{ padding: '12px' }}>
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

          <div
            style={{
              display: 'flex',
              marginTop: '30px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div
              className={stylesMobile.buttonCancel}
              style={{ textAlign: 'center' }}
              onClick={() => setIsAddRoomModal(false)}
            >
              Отмена
            </div>
            <div className={stylesMobile.buttonConfirm} style={{ textAlign: 'center' }}>
              Да
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
