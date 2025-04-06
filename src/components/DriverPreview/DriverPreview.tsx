import { h } from 'preact';
import styles from './styles.module.scss';
import { LedIndicator } from '../LedIndicator/LedIndicator';

type Props = {
  channelNumber: string;
  type: string;
  name: string;
  onClick: () => void;
};

const lampColorsMap: Record<string, string[] | string> = {
  '1': ['red', 'green', 'blue'],
  '2': ['red', 'green'],
  '3': ['red', 'green', 'blue', 'white'],
  '4': ['white'],
  '5': ['warm', 'cold'],
  '6': 'led',
};

export function DriverPreview({
  channelNumber,
  type,
  name = 'Комната спальная 12345678901234567890',
  onClick,
}: Props) {
  const colors = lampColorsMap[`${type}`];
  return (
    <div className={styles.container} onClick={onClick}>
      <span className={styles.channelNumber}>{channelNumber}</span>
      <div className={styles.indicators}>
        {Array.isArray(colors) &&
          colors.map(color => <span key={color} className={`${styles.dot} ${styles[color]}`} />)}
        {colors === 'led' && <LedIndicator />}
      </div>
      <div className={styles.dashes}>
        <span className={styles.name}>{name}</span>
      </div>
      <button
        className={styles.button}
        onClick={event => {
          event.stopPropagation();
        }}
      >
        TEST
      </button>
    </div>
  );
}
