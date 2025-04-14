import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { sendMessageSocket, state } from '../../../store/store';
import { useLocation } from 'preact-iso';
import { DriverPreview } from '../../../components/DriverPreview/DriverPreview';
import stylesMobile from './stylesMobile.module.scss';
import { Modal } from '../../../components/Modal/Modal';
import { useCalculateItemsPerPage } from '../hooks/useCalculateItemsPerPage';
import { useLongPress } from './hook';

export function HomePageMobile() {
  const refTest = useRef<HTMLDivElement>(null);
  const { route } = useLocation();
  const [page, setPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [countPages, setCountPages] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const driversSelectRoom = state.value?.rooms?.[activeIndex]?.drivers;
  const [isOpenModal, setOpenModal] = useState(false);
  const [isAddRoomModal, setIsAddRoomModal] = useState(false);
  const selectRoom = state.value?.rooms?.[activeIndex];
  const groupsSelectRoom = selectRoom?.groups;
  const [localSelected, setLocalSelected] = useState<number[]>([]);

  const [editGroup, setEditGroup] = useState<{
    idGroup: string;
    isEdit: boolean;
    dataAddressList: Record<string, number[]>;
  }>();

  const { itemsPerPage } = useCalculateItemsPerPage(refTest);

  useEffect(() => {
    sendMessageSocket({ rooms: 'search', cmd: 'start' }, false);
  }, []);

  useEffect(() => {
    scrollToActive();
  }, [activeIndex]);

  useEffect(() => {
    // 1) Если нет драйверов вообще, сбрасываем всё
    if (!driversSelectRoom) {
      setCurrentItems([]);
      setCountPages(1);
      return;
    }

    // 2) Собираем список групп (если есть)
    const groupList =
      groupsSelectRoom?.map(group => ({
        id: group.idGroup,
        type: 'group' as const,
        driverAddresses: group.driverAddresses,
        groupName: group.groupName,
      })) || [];

    // 3) Берём "свободные" драйверы — вся логика проверки не нужна,
    //    т. к. тут уже лежат только свободные (не входящие в группы).
    const driverKeys = Object.keys(driversSelectRoom);
    const freeDrivers = driverKeys.map(key => ({
      id: key,
      type: 'drivers' as const,
      data: driversSelectRoom[key], // например [18,7]
    }));

    // 4) Если редактируем группу, добавляем ЕЁ драйверы к "freeDrivers".
    let finalDrivers = freeDrivers;
    if (editGroup?.isEdit) {
      // Здесь `editGroup.dataAddressList` — это массив адресов или массив [адрес, тип]?
      // Предположим, там просто список адресов:
      const groupDriversKeys = Object.keys(editGroup.dataAddressList);
      const groupDrivers = groupDriversKeys.map(key => ({
        id: key,
        type: 'drivers' as const,
        data: editGroup.dataAddressList[key], // например [18,7]
      }));

      finalDrivers = [...freeDrivers, ...groupDrivers];
    }

    // 5) Общий массив: сначала группы, потом драйверы
    const allItems = [...groupList, ...finalDrivers];

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
  }, [driversSelectRoom, groupsSelectRoom, editGroup, page, itemsPerPage]);

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
    if (editGroup?.isEdit) {
      return null;
    } else {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    }
  }, [editGroup]);

  const handleNext = useCallback(() => {
    if (editGroup?.isEdit) {
      return null;
    } else {
      setActiveIndex(prev => Math.min(prev + 1, state.value.rooms.length - 1));
    }
  }, [state.value.rooms, editGroup]);

  const handleDeleteRoom = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleChangeGroup = (id: string) => {
    setEditGroup(prev => {
      // 1. Если клик по текущей редактируемой группе - сбрасываем редактирование
      if (prev?.isEdit && prev?.idGroup === id) {
        console.log('localSelect ушли', localSelected);
        setLocalSelected([]);
        return { isEdit: false, idGroup: null, dataAddressList: {} };
      }

      // 2. Если клик по другой группе во время редактирования - игнорируем
      if (prev?.isEdit && prev?.idGroup !== id) {
        return prev;
      }
      const driverAddresses = groupsSelectRoom.find(item => item.idGroup === id)?.driverAddresses;
      const addresses = Object.values(driverAddresses).map(([addr]) => addr);
      setLocalSelected(addresses);

      // 3. Первый клик по любой группе (когда нет активного редактирования)
      return {
        isEdit: true,
        idGroup: id,
        dataAddressList: groupsSelectRoom.find(item => item.idGroup === id)?.driverAddresses,
      };
    });
  };

  function toggleDriverInGroup(driver: number[]) {
    // Проверяем, есть ли driverAddr в localSelected
    setLocalSelected(prev => {
      if (prev.includes(driver[0])) {
        // Уже есть → убираем
        return prev.filter(a => a !== driver[0]);
      } else {
        // Нет → добавляем
        return [...prev, driver[0]];
      }
    });
  }

  function isDriverInGroup(driver: number[]) {
    if (!editGroup?.isEdit) return false;

    const [addr] = driver; // например [18,7] -> addr=18
    return localSelected.includes(addr);
  }
  return (
    <div className={stylesMobile.devices}>
      <div className={stylesMobile.wrapperBtn}>
        {/*<button className={stylesMobile.btn} id="device-btn-search" onClick={handleDeleteRoom}>*/}
        {/*  Редактировать*/}
        {/*</button>*/}
        <button
          className={stylesMobile.btn}
          id="device-btn-update"
          onClick={() => {
            setIsAddRoomModal(true);
          }}
        >
          Создать
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
                !editGroup?.isEdit && setActiveIndex(index);
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
        {currentItems.map(item => {
          if (item?.type === 'group') {
            const { startPress, endPress } = useLongPress(
              () => handleChangeGroup(item.id), // колбэк, вызываемый по истечении 700ms
              700 // время долгого нажатия
            );

            return (
              <DriverPreview
                key={item.id}
                name={`${item.groupName}`}
                type={'group'}
                isEdit={editGroup?.isEdit && editGroup?.idGroup === item.id}
                address={''}
                // onClick={() => {
                //   handleChangeGroup(item.id);
                // }}
                onContextMenu={e => e.preventDefault()}
                onMouseDown={startPress}
                onTouchStart={startPress}
                onMouseUp={endPress}
                onMouseLeave={endPress}
                onTouchEnd={endPress}
              />
            );
          }

          if (item?.type === 'drivers') {
            const driver = item.data;
            return driver ? (
              <DriverPreview
                isCheckedVisible={editGroup?.isEdit}
                isChecked={isDriverInGroup(driver)}
                key={driver[0]}
                name={'Контейнер Контейнер'}
                type={driver[1]}
                address={driver[0]}
                onClick={() => {
                  if (!editGroup?.isEdit) {
                    route(`/service/devices/${driver[0]}`);
                  } else {
                    toggleDriverInGroup(driver);
                  }
                }}
              />
            ) : null;
          }
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
            {editGroup?.isEdit
              ? driversSelectRoom &&
                Object?.keys(driversSelectRoom)?.length +
                  Object?.keys(editGroup.dataAddressList)?.length
              : driversSelectRoom && Object?.keys(driversSelectRoom)?.length}
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
      <Modal open={isAddRoomModal} onClose={() => setIsAddRoomModal(false)} maxWidth="md">
        <div className={stylesMobile.modalContainer}>
          <button className={stylesMobile.closeBtn} onClick={() => setIsAddRoomModal(false)}>
            &times;
          </button>

          <h2 className={stylesMobile.title}>Добавить группу:</h2>

          <label className={stylesMobile.field}>
            <span className={stylesMobile.fieldLabel}>Создать группу</span>
            <input
              autoComplete="off"
              type="text"
              id="wifi-password"
              className={stylesMobile.input}
            />
          </label>

          <div className={stylesMobile.actions}>
            <button className={stylesMobile.buttonCancel} onClick={() => setIsAddRoomModal(false)}>
              Отмена
            </button>
            <button className={stylesMobile.buttonConfirm}>Да</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
