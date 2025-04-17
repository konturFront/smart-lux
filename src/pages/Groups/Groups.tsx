import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { useLocation, useRoute } from 'preact-iso';
import styles from './styles.module.scss';
import { EditIcon } from '../../components/EditIcon/EditIcon';
import { Modal } from '../../components/Modal/Modal';
import { useState } from 'preact/hooks';
import { sendMessageSocket } from '../../store/store';

const mockGroups = [
  { idGroup: 'group-1', groupName: 'Коридор - Кухня' },
  { idGroup: 'group-2', groupName: 'Спортзал' },
  { idGroup: 'group-3', groupName: 'Уличное освещение' },
];

export const GroupsPage = () => {
  const { isMobile } = useDeviceDetect();
  const { route } = useLocation();
  const { params } = useRoute();

  const [isAddGroupModal, setIsAddGroupModal] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [renameValue, setRenameValue] = useState('');
  return (
    <div className={styles.devices}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          padding: '0 20px',
        }}
      >
        {/* Назад */}
        <div
          className={styles.backButton}
          aria-label="Назад"
          onClick={() => {
            route('/service/rooms');
          }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Кухня */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '22px',
            textAlign: 'center',
            pointerEvents: 'none', // чтобы клик не мешал кнопке
          }}
        >
          Кухня
        </div>
      </div>

      <div className={styles.wrapperBtn}>
        <button
          className={styles.btn}
          id="device-btn-update"
          onClick={() => {
            setIsAddGroupModal(true);
          }}
        >
          {`Создать группу`}
        </button>
      </div>

      <div className={styles.tilesWrapper}>
        {mockGroups.map(group => (
          <div key={group.idGroup} className={styles.tile} onClick={() => {}}>
            <div className={styles.groupName}>
              <span> {group.groupName}</span>
            </div>
            <div
              className={styles.editWrapper}
              onClick={event => {
                setSelectedItem(group);
                setRenameValue(group.groupName);
                setIsEditModalOpen(true);
                event.stopPropagation();
              }}
            >
              <EditIcon />
            </div>
          </div>
        ))}
      </div>
      <Modal
        maxWidth="md"
        open={isAddGroupModal}
        onClose={() => setIsAddGroupModal(false)}
        buttonsType="dual"
        dualPrimaryButtonText="Cоздать"
        dualPrimaryButtonAction={() => {}}
        dualSecondaryButtonText="Отмена"
      >
        <div className={styles.title}>{`Создать группу`}</div>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>{`Название группы`}</span>
          <input autoComplete="off" type="text" className={styles.input} id="room-name" />
        </label>
      </Modal>
      <Modal
        maxWidth="md"
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        buttonsType="dual"
        dualPrimaryButtonText="Переименновать"
        dualPrimaryButtonAction={() => {}}
        dualSecondaryButtonText="Удалить"
      >
        <div className={styles.title}>{`Редактирование группы`}</div>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>{`Название группы`}</span>
          <input
            autoComplete="off"
            type="text"
            className={styles.input}
            id="room-name"
            value={renameValue}
            onInput={e => setRenameValue((e.target as HTMLInputElement).value)}
          />
        </label>
      </Modal>
    </div>
  );
};
