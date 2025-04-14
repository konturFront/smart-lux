import { h, JSX } from 'preact';
import styles from './styles.module.scss';
import { LedIndicator } from '../LedIndicator/LedIndicator';
import { Rele } from '../Rele/Rele';
import { GroupIcon } from '../Group/GroupIcon';

type Props = {
  address: string;
  type: string;
  name: string;
  onClick?: () => void;
  isEdit?: boolean;
  isChecked?: boolean;
  isCheckedVisible?: boolean;
} & JSX.HTMLAttributes<HTMLDivElement>;

const lampColorsMap: Record<string, string[] | string> = {
  '2': ['warm', 'cold'],
  '4': 'triangle',
  '6': 'triangleWithLed',
  '7': 'rele',
  '96': ['red', 'green', 'blue'],
  '98': ['red', 'green', 'blue', 'white'],
  '128': ['red', 'green', 'blue', 'cold', 'warm'],
  group: 'group',
};

export function DriverPreview({
  address,
  type,
  name = 'Комната спальная 12345678901234567890',
  onClick,
  isEdit,
  isChecked,
  isCheckedVisible,
  ...rest
}: Props) {
  const colors = lampColorsMap[`${type}`];
  const isShaking = isEdit && type === 'group';

  return (
    <div
      className={`${styles.container} ${isShaking ? styles.blink : ''}`}
      onClick={onClick}
      {...rest}
    >
      {isCheckedVisible && <input type={'checkbox'} checked={isChecked}></input>}
      <span className={styles.channelNumber}>{address}</span>
      <div className={styles.indicators}>
        {Array.isArray(colors) &&
          colors.map((color, index) => (
            <span key={color + index} className={`${styles.dot} ${styles[color]}`} />
          ))}
        {colors === 'triangleWithLed' && <LedIndicator led={true} />}
        {colors === 'triangle' && <LedIndicator led={false} />}
        {colors === 'rele' && <Rele size={56} strokeWidth={5} />}
        {colors === 'group' && <GroupIcon />}
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
