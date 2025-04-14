// import { useEffect, useState } from 'preact/hooks';
// import { sendMessageSocket } from '../../../store/store';
// import { useLocation } from 'preact-iso';
// import stylesMobile from './stylesMobile.module.scss';
// import { Modal } from '../../../components/Modal/Modal';
// import styles from '../DesktopVersion/styles.module.scss';
//
// // MOCK DATA
// const mockRooms = [
//   { idRoom: 'room-1', roomName: 'Гостиная' },
//   { idRoom: 'room-2', roomName: 'Спальня' },
//   { idRoom: 'room-3', roomName: 'Прихожая' },
//   { idRoom: 'room-4', roomName: 'Комната-1' },
//   { idRoom: 'room-5', roomName: 'Комната-2' },
//   { idRoom: 'room-6', roomName: 'WC-1' },
//   { idRoom: 'room-7', roomName: 'WC-2' },
//   { idRoom: 'room-8', roomName: 'WC-3' },
// ];
//
// const mockGroups = [
//   { idGroup: 'group-1', groupName: 'Коридор - Кухня' },
//   { idGroup: 'group-2', groupName: 'Спортзал' },
//   { idGroup: 'group-3', groupName: 'Уличное освещение' },
// ];
//
// export function RoomsAndGroupsPageMobile() {
//   const [editMode, setEditMode] = useState<'rooms' | 'groups'>('rooms');
//   const { route } = useLocation();
//   const [selectedItem, setSelectedItem] = useState<any>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   // Поле ввода нового имени
//   const [renameValue, setRenameValue] = useState('');
//
//   useEffect(() => {
//     sendMessageSocket({ rooms: 'search', cmd: 'start' }, false);
//   }, []);
//
//   return (
//     <div className={stylesMobile.devices}>
//       <div className={stylesMobile.switchWrapper}>
//         <div className={stylesMobile.switchContainer}>
//           <div
//             className={`${stylesMobile.switchOption} ${editMode === 'groups' ? stylesMobile.inactive : stylesMobile.active}`}
//             onClick={() => setEditMode('rooms')}
//           >
//             Помещения
//           </div>
//           <div
//             className={`${stylesMobile.switchOption} ${editMode === 'groups' ? stylesMobile.active : stylesMobile.inactive}`}
//             onClick={() => setEditMode('groups')}
//           >
//             Группы
//           </div>
//         </div>
//       </div>
//       <div className={stylesMobile.wrapperBtn}>
//         <button
//           className={stylesMobile.btn}
//           id="device-btn-update"
//           onClick={() => {
//             setIsAddRoomModal(true);
//           }}
//         >
//           {`Создать ${editMode === 'groups' ? 'группу' : 'помещение'}`}
//         </button>
//       </div>
//       <div className={stylesMobile.tilesWrapper}>
//         {editMode === 'rooms' &&
//           mockRooms.map(room => (
//             <div key={room.idRoom} className={stylesMobile.tile}>
//               {room.roomName}
//             </div>
//           ))}
//
//         {editMode === 'groups' &&
//           mockGroups.map(group => (
//             <div key={group.idGroup} className={stylesMobile.tile}>
//               {group.groupName}
//             </div>
//           ))}
//       </div>
//       <Modal open={isAddRoomModal} onClose={() => setIsAddRoomModal(false)} maxWidth="md">
//         <div className={styles.modalContainer}>
//           {/* Кнопка-крестик для закрытия */}
//           <button className={styles.closeBtn} onClick={() => setIsAddRoomModal(false)}>
//             &times;
//           </button>
//
//           <h2 className={styles.title}>
//             {`Создать ${editMode === 'groups' ? 'группу' : 'помещение'}`}
//           </h2>
//
//           <label className={styles.field}>
//             <span className={styles.fieldLabel}>
//               {' '}
//               {`Название ${editMode === 'groups' ? 'группы' : 'помещения'}`}
//             </span>
//             <input
//               autoComplete="off"
//               type="text"
//               className={styles.input}
//               id="room-name"
//               // value={roomName}
//               // onInput={e => setRoomName(e.target.value)}
//             />
//           </label>
//
//           <div className={styles.actions}>
//             <button className={styles.buttonCancel} onClick={() => setIsAddRoomModal(false)}>
//               Отмена
//             </button>
//             <button className={styles.buttonConfirm}>Cоздать</button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

import { useEffect, useState } from 'preact/hooks';
import { sendMessageSocket } from '../../../store/store';
import { useLocation } from 'preact-iso';
import stylesMobile from './stylesMobile.module.scss';
import { Modal } from '../../../components/Modal/Modal';
import styles from '../DesktopVersion/styles.module.scss';

// MOCK DATA
const mockRooms = [
  { idRoom: 'room-1', roomName: 'Гостиная' },
  { idRoom: 'room-2', roomName: 'Спальня' },
  { idRoom: 'room-3', roomName: 'Прихожая' },
  { idRoom: 'room-4', roomName: 'Комната-1' },
  { idRoom: 'room-5', roomName: 'Комната-2' },
  { idRoom: 'room-6', roomName: 'WC-1' },
  { idRoom: 'room-7', roomName: 'WC-2' },
  { idRoom: 'room-8', roomName: 'WC-3' },
];

const mockGroups = [
  { idGroup: 'group-1', groupName: 'Коридор - Кухня' },
  { idGroup: 'group-2', groupName: 'Спортзал' },
  { idGroup: 'group-3', groupName: 'Уличное освещение' },
];

export function RoomsAndGroupsPageMobile() {
  const [editMode, setEditMode] = useState<'rooms' | 'groups'>('rooms');
  const { route } = useLocation();

  // Модалка для создания
  const [isAddRoomModal, setIsAddRoomModal] = useState(false);

  // Модалка для редактирования/удаления
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    sendMessageSocket({ rooms: 'search', cmd: 'start' }, false);
  }, []);

  return (
    <div className={stylesMobile.devices}>
      <div className={stylesMobile.switchWrapper}>
        <div className={stylesMobile.switchContainer}>
          <div
            className={`${stylesMobile.switchOption} ${editMode === 'groups' ? stylesMobile.inactive : stylesMobile.active}`}
            onClick={() => setEditMode('rooms')}
          >
            Помещения
          </div>
          <div
            className={`${stylesMobile.switchOption} ${editMode === 'groups' ? stylesMobile.active : stylesMobile.inactive}`}
            onClick={() => setEditMode('groups')}
          >
            Группы
          </div>
        </div>
      </div>

      <div className={stylesMobile.wrapperBtn}>
        <button
          className={stylesMobile.btn}
          id="device-btn-update"
          onClick={() => {
            setIsAddRoomModal(true);
          }}
        >
          {`Создать ${editMode === 'groups' ? 'группу' : 'помещение'}`}
        </button>
      </div>

      <div className={stylesMobile.tilesWrapper}>
        {/* Помещения */}
        {editMode === 'rooms' &&
          mockRooms.map(room => (
            <div
              key={room.idRoom}
              className={stylesMobile.tile}
              onClick={() => {
                setSelectedItem(room);
                setRenameValue(room.roomName);
                setIsEditModalOpen(true);
              }}
            >
              {room.roomName}
            </div>
          ))}

        {/* Группы */}
        {editMode === 'groups' &&
          mockGroups.map(group => (
            <div
              key={group.idGroup}
              className={stylesMobile.tile}
              onClick={() => {
                setSelectedItem(group);
                setRenameValue(group.groupName);
                setIsEditModalOpen(true);
              }}
            >
              {group.groupName}
            </div>
          ))}
      </div>

      {/* Модалка СОЗДАНИЯ */}
      <Modal open={isAddRoomModal} onClose={() => setIsAddRoomModal(false)} maxWidth="md">
        <div className={styles.modalContainer}>
          <button className={styles.closeBtn} onClick={() => setIsAddRoomModal(false)}>
            &times;
          </button>

          <h2 className={styles.title}>
            {`Создать ${editMode === 'groups' ? 'группу' : 'помещение'}`}
          </h2>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              {`Название ${editMode === 'groups' ? 'группы' : 'помещения'}`}
            </span>
            <input autoComplete="off" type="text" className={styles.input} id="room-name" />
          </label>

          <div className={styles.actions}>
            <button className={styles.buttonCancel} onClick={() => setIsAddRoomModal(false)}>
              Отмена
            </button>
            <button className={styles.buttonConfirm}>Cоздать</button>
          </div>
        </div>
      </Modal>

      {/* Модалка РЕДАКТИРОВАНИЯ */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md">
        <div className={styles.modalContainer}>
          <button className={styles.closeBtn} onClick={() => setIsEditModalOpen(false)}>
            &times;
          </button>

          <h2 className={styles.title}>
            Переименовать {editMode === 'groups' ? 'группу' : 'помещение'}
          </h2>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              {editMode === 'groups' ? 'Имя группы' : 'Имя помещения'}
            </span>
            <input
              autoComplete="off"
              type="text"
              className={styles.input}
              id="rename-field"
              value={renameValue}
              onInput={e => setRenameValue((e.target as HTMLInputElement).value)}
            />
          </label>

          <div className={styles.actions}>
            <button
              style={{ backgroundColor: 'red', color: '#fff' }}
              onClick={() => {
                // Логика удаления
                setIsEditModalOpen(false);
              }}
            >
              Удалить
            </button>
            <button
              className={styles.buttonConfirm}
              onClick={() => {
                // Логика переименования
                setIsEditModalOpen(false);
              }}
            >
              Переименовать
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
