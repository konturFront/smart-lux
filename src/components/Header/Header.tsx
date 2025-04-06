import { useLocation } from 'preact-iso';
import { Drawer } from '../Drawer/Drawer';
import styles from './styles.module.scss';
import { socketStatusEnum, state, stateUI } from '../../store/store';
import { Loader } from '../Loader/Loader';

export function Header() {
  const socketStatus = state.value.socketStatus;

  return (
    <>
      <div className={styles.header}>
        <div
          className={styles.burgerBtn}
          onClick={() => {
            stateUI.value = {
              ...stateUI.value,
              isActiveMenu: !stateUI.value.isActiveMenu,
            };
          }}
        >
          <div className={styles.burgerBtnItem} />
          <div className={styles.burgerBtnItem} />
          <div className={styles.burgerBtnItem} />
        </div>

        <div
          id="socket-indicator"
          className={`${styles.status} ${styles[socketStatus]}`}
          style={{ display: 'flex', height: '100%' }}
        >
          <span className={styles.icon} />
          <span className={`${styles.text} ${styles[`text--${socketStatus}`]}`} id="id-text-span">
            {socketStatus === socketStatusEnum.CONNECTED && 'Подключено'}
            {socketStatus === socketStatusEnum.PENDING && 'Подключение'}
            {socketStatus === socketStatusEnum.DISCONNECTED && 'Отключено'}
            <span className={`${styles.text} ${styles[`text--${socketStatus}`]}`}>
              &nbsp;{state.value.socketURL}
            </span>
          </span>
          {stateUI.value.isLoadingUI && <Loader />}
        </div>
      </div>
      <Drawer />
    </>
  );
}
