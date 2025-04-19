import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import styles from './styles.module.scss';

interface RoomCarouselProps {
  rooms: Array<{ idRoom: string; roomName: string }>;
  activeIndex: number;
  onItemClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const RoomCarousel = ({
  rooms,
  activeIndex,
  onItemClick,
  onPrev,
  onNext,
}: RoomCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    scrollToActive();
  }, [activeIndex]);

  return (
    <div className={styles.roomCarouselWrapper}>
      <div
        style={{
          fontSize: '38px',
          visibility: activeIndex === 0 - 1 ? 'hidden' : 'visible',
        }}
        className={styles.arrowPagination}
        onClick={onPrev}
      >
        &laquo;
      </div>
      <div className={styles.roomCarousel} ref={containerRef}>
        {rooms?.map((room, index) => (
          <div
            key={room.idRoom + index}
            className={`${styles.roomItem} ${index === activeIndex ? styles.active : ''}`}
            onClick={() => onItemClick(index)}
          >
            {room.roomName}
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: '38px',
          visibility: activeIndex === rooms.length - 1 ? 'hidden' : 'visible',
        }}
        className={styles.arrowPagination}
        onClick={onNext}
      >
        &raquo;
      </div>
    </div>
  );
};
