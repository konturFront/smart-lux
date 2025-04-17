import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { sendMessageSocket, state } from '../../../store/store';
import { useLocation } from 'preact-iso';
import styles from './stylesMobile.module.scss';
import { Modal } from '../../../components/Modal/Modal';
import { useCalculateItemsPerPage } from '../../../hooks/useCalculateItemsPerPage';
import { GroupPreview } from '../../../components/GroupPreview/GroupPreview';

export const RoomsPageMobile = () => {
  const refTest = useRef<HTMLDivElement>(null);
  const { route } = useLocation();
  const [page, setPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [countPages, setCountPages] = useState(1);
  const [countElementForPages, setCountElementForPages] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const groupsSelectRoom = state.value?.rooms?.[activeIndex]?.groups;
  const [isAddGroupModal, setIsAddGroupModal] = useState(false);
  const [isAddRoomModal, setIsAddRoomModal] = useState(false);
  const [isDeleteRoomModal, setIsDeleteRoomModal] = useState(false);
  const [isEditGroupModal, setIsEditGroupModal] = useState();
  const selectRoom = state.value?.rooms?.[activeIndex];
  const [renameValue, setRenameValue] = useState('');

  const { itemsPerPage } = useCalculateItemsPerPage(refTest);

  useEffect(() => {
    sendMessageSocket({ rooms: 'search', cmd: 'start' }, false);
  }, []);

  useEffect(() => {
    scrollToActive();
  }, [activeIndex]);

  useEffect(() => {
    // 1) Если нет драйверов вообще, сбрасываем всё
    if (!groupsSelectRoom) {
      setCurrentItems([]);
      setCountPages(1);
      return;
    }

    const allItems = [...groupsSelectRoom];
    setCountElementForPages(allItems?.length ?? 0);

    // 6) Пагинация
    if (allItems.length > 0) {
      const totalPages = Math.ceil(allItems.length / itemsPerPage);
      setCountPages(totalPages);

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setCurrentItems(allItems.slice(startIndex, endIndex));
    } else {
      setCurrentItems([]);
      setCountPages(1);
    }
  }, [groupsSelectRoom, page, itemsPerPage]);

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

  return (
    <div className={styles.devices}>
      <div className={styles.wrapperBtn}>
        <div
          className={styles.btn}
          id="device-btn-update"
          onClick={() => {
            setIsDeleteRoomModal(true);
          }}
        >
          {`Удалить`}
        </div>
        <div
          className={styles.btn}
          id="device-btn-update"
          onClick={() => {
            setIsAddRoomModal(true);
          }}
        >
          {`Создать`}
        </div>
      </div>
      <div className={styles.roomCarouselWrapper}>
        <div
          style={{
            fontSize: '38px',
            visibility: activeIndex === 0 - 1 ? 'hidden' : 'visible',
          }}
          className={styles.arrowPagination}
          onClick={handlePrev}
        >
          &laquo;
        </div>
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
        <div
          style={{
            fontSize: '38px',
            visibility: activeIndex === state.value.rooms.length - 1 ? 'hidden' : 'visible',
          }}
          className={styles.arrowPagination}
          onClick={handleNext}
        >
          &raquo;
        </div>
      </div>
      <div
        className={styles.wrapperBtn}
        style={{ justifyContent: 'flex-end', marginBottom: '20px' }}
      >
        <div
          className={styles.btn}
          id="device-btn-update"
          onClick={() => {
            setIsAddGroupModal(true);
          }}
        >
          {`Создать группу`}
        </div>
      </div>
      <div id="drivers-list" className={styles.driversList} ref={refTest}>
        {currentItems.map((item, index) => {
          return (
            <GroupPreview
              key={item.idGroup}
              onContextMenu={e => e.preventDefault()}
              name={item.groupName}
              address={index}
              onClickPencil={() => {
                setIsEditGroupModal(item);
                setRenameValue(item.groupName);
                // route(`/service/devices/${driver[0]}`);
              }}
              onClick={() => {
                // route(`/service/devices/${driver[0]}`);
              }}
            />
          );
        })}
      </div>
      {/*ПАГИНАЦИЯ*/}
      <div className={styles.paginationBar}>
        <div className={styles.navigation}>
          <div
            style={{
              marginRight: '5px',
              visibility: page === 1 ? 'hidden' : 'visible',
              fontSize: '38px',
            }}
            className={styles.arrowPagination}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
          >
            &laquo;
          </div>
          <div className={styles.totalCount}>{countElementForPages}</div>
          <div
            style={{
              marginLeft: '5px',
              visibility: page === countPages ? 'hidden' : 'visible',
              fontSize: '38px',
            }}
            className={styles.arrowPagination}
            onClick={() => setPage(p => Math.min(p + 1, countPages))}
          >
            &raquo;
          </div>
        </div>
        <div className={styles.dotsWrapper}>
          {countPages > 0 && (
            <div className={styles.dots}>
              {Array.from({ length: countPages }).map((_, index) => (
                <span
                  key={index}
                  className={`${styles.dot} ${page === index + 1 ? styles.active : ''}`}
                  onClick={() => setPage(index + 1)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal
        maxWidth="md"
        open={isAddGroupModal || isDeleteRoomModal || isAddRoomModal || !!isEditGroupModal}
        onClose={() => {
          setRenameValue(undefined);
          setIsDeleteRoomModal(false);
          setIsAddGroupModal(false);
          setIsAddRoomModal(false);
          setIsEditGroupModal(undefined);
          setRenameValue(undefined);
        }}
        buttonsType="dual"
        dualPrimaryButtonText={`${isDeleteRoomModal ? 'Удалить' : isAddGroupModal || isAddRoomModal ? 'Cоздать' : !!isEditGroupModal ? 'Переименовать' : 'Удалить'}`}
        dualPrimaryButtonAction={() => {}}
        dualSecondaryButtonText={`${isDeleteRoomModal || isAddRoomModal || isAddGroupModal ? 'Отмена' : !!isEditGroupModal ? 'Удалить' : 'Error'}`}
      >
        {isDeleteRoomModal && (
          <>
            <div className={styles.title}>{`Вы точно хотите удалить помещение`}</div>
            <label className={styles.field}>
              <div
                style={{ textAlign: 'center', fontSize: '20px' }}
              >{`${selectRoom.roomName}`}</div>
            </label>
          </>
        )}
        {!!isEditGroupModal && (
          <>
            <div className={styles.title}>{`Редактирование группы`}</div>
            <label className={styles.field}>
              <input
                autoComplete="off"
                type="text"
                className={styles.input}
                id="room-name"
                value={renameValue}
                onInput={e => setRenameValue((e.target as HTMLInputElement).value)}
              />
            </label>
          </>
        )}
        {!!isAddGroupModal && (
          <>
            <div className={styles.title}>{`Cоздать группу`}</div>
            <label className={styles.field}>
              <input
                placeholder={'Название группы'}
                autoComplete="off"
                type="text"
                className={styles.input}
                id="room-name"
                value={renameValue}
                onInput={e => setRenameValue((e.target as HTMLInputElement).value)}
              />
            </label>
          </>
        )}
        {!!isAddRoomModal && (
          <>
            <div className={styles.title}>{`Cоздать помещение`}</div>
            <label className={styles.field}>
              <input
                placeholder={'Название помещения'}
                autoComplete="off"
                type="text"
                className={styles.input}
                id="room-name"
                value={renameValue}
                onInput={e => setRenameValue((e.target as HTMLInputElement).value)}
              />
            </label>
          </>
        )}
      </Modal>
    </div>
  );
};
