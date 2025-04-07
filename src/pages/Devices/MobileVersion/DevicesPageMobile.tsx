import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { sendMessageSocket, state } from '../../../store/store';
import { useLocation } from 'preact-iso';
import { DriverPreview } from '../../../components/DriverPreview/DriverPreview';
import stylesMobile from './stylesMobile.module.scss';

export function DevicesPageMobile() {
  const refTest = useRef<HTMLDivElement>(null);
  const { route } = useLocation();

  const [page, setPage] = useState(1);
  const [currentItems, setCurrentItems] = useState<string[]>([]);
  const [countPages, setCountPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const handleUpdateDrivers = useCallback(() => {
    sendMessageSocket({ driver: 'update', cmd: 'start' });
  }, []);

  // Вычисляем, сколько драйверов влезает по высоте
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
    const arr = Object.keys(state.value.updatedDevices);

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
  }, [state.value.updatedDevices, page, itemsPerPage]);

  const totalDrivers = Object.keys(state.value.updatedDevices).length;

  return (
    <div className={stylesMobile.devices}>
      <div className={stylesMobile.wrapperBtn}>
        <button className={stylesMobile.btn} id="device-btn-search">
          Поиск устройств
        </button>
        <button className={stylesMobile.btn} id="device-btn-update" onClick={handleUpdateDrivers}>
          Обновить
        </button>
      </div>

      <div id="drivers-list" className={stylesMobile.driversList} ref={refTest}>
        {currentItems.map(key => (
          <DriverPreview
            key={state.value.updatedDevices[key][0]}
            name={'Контейнер Контейнер'}
            type={state.value.updatedDevices[key][1]}
            address={state.value.updatedDevices[key][0]}
            onClick={() => route(`/service/devices/${state.value.updatedDevices[key][0]}`)}
          />
        ))}
      </div>
      {/*ПАГИНАЦИЯ*/}
      <div className={stylesMobile.paginationBar}>
        <div className={stylesMobile.navigation}>
          <div
            style={{ marginRight: '5px', visibility: page === 1 ? 'hidden' : 'visible' }}
            className={stylesMobile.arrow}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
          >
            &laquo;
          </div>
          <div className={stylesMobile.totalCount}>{totalDrivers}</div>
          <div
            style={{ marginLeft: '5px', visibility: page === countPages ? 'hidden' : 'visible' }}
            className={stylesMobile.arrow}
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
    </div>
  );
}
