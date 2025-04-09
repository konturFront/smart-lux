import React, { useEffect, useState } from 'react';

interface WifiIconProps {
  size?: number | string;
}

export const WifiIcon: React.FC<WifiIconProps> = ({ size = 24 }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [directionUp, setDirectionUp] = useState(true); // направление: вверх или вниз

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLevel(prev => {
        if (directionUp) {
          if (prev >= 4) {
            setDirectionUp(false);
            return prev - 1;
          }
          return prev + 1;
        } else {
          if (prev <= 0) {
            setDirectionUp(true);
            return prev + 1;
          }
          return prev - 1;
        }
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [directionUp]);

  const showLevel = (n: number) => n === 1 || currentLevel >= n;

  const getColorByLevel = (level: number): string => {
    switch (level) {
      case 1:
        return '#f44336'; // красный
      case 2:
        return '#ffeb3b'; // жёлтый
      case 3:
        return '#cddc39'; // лаймово-зелёный
      case 4:
        return '#00e676'; // ярко-зелёный
      default:
        return 'currentColor';
    }
  };

  const color = getColorByLevel(currentLevel);

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
    >
      <g>
        {showLevel(1) && (
          <path d="M15.49,16.11a6.11,6.11,0,0,0-7,0l1.15,1.63a4.08,4.08,0,0,1,4.67,0Z" />
        )}
        {showLevel(2) && (
          <path d="M17.82,12.87a10,10,0,0,0-11.63,0l1.17,1.62a8.11,8.11,0,0,1,9.29,0Z" />
        )}
        {showLevel(3) && (
          <path d="M20.13,9.62a13.94,13.94,0,0,0-16.27,0L5,11.24a11.94,11.94,0,0,1,13.93,0Z" />
        )}
        {showLevel(4) && (
          <path d="M1.54,6.36,2.7,8A16,16,0,0,1,21.3,8l1.17-1.62a18,18,0,0,0-20.93,0Z" />
        )}
        {showLevel(1) && <rect height="2" width="2" x="11" y="19" />}
      </g>
    </svg>
  );
};
