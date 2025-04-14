import { useRef } from 'preact/hooks';

export const LongPressButton = () => {
  const timerRef = useRef<number | null>(null);

  const handleLongPress = () => {
    alert('Долгое нажатие!');
  };

  const handleTouchStart = () => {
    timerRef.current = window.setTimeout(handleLongPress, 600); // 600 мс
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return (
    <button
      style={{
        padding: '12px 20px',
        fontSize: '16px',
        borderRadius: '8px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd} // отмена при свайпе
    >
      Держи палец
    </button>
  );
};
