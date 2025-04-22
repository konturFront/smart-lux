import { useEffect, useState } from 'preact/hooks';
import { Ref } from 'preact';

export const useCalculateItemsPerPage = (
  containerRef: Ref<HTMLElement>,
  itemHeight: number = 60,
  gap: number = 16,
  paddingTop: number = 20
) => {
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const calculateItems = () => {
      if (containerRef?.current) {
        const totalHeight = containerRef?.current.getBoundingClientRect().height;
        const visibleItems = Math.floor((totalHeight - paddingTop + gap) / (itemHeight + gap));
        setItemsPerPage(Math.max(1, visibleItems));
      }
    };

    // Первоначальный расчет
    calculateItems();

    // Подписка на ресайз окна
    window.addEventListener('resize', calculateItems);

    return () => {
      window.removeEventListener('resize', calculateItems);
    };
  }, [containerRef, itemHeight, gap, paddingTop]);

  return { itemsPerPage };
};
