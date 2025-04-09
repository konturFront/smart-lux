import './style.css';
import { Modal } from '../../components/Modal/Modal';
import { useState } from 'preact/hooks';

export function Home() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Открыть модалку</button>

      <Modal open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <h2>Заголовок</h2>
        <p>Контент модального окна</p>
        <button onClick={() => setOpen(false)}>Закрыть</button>
      </Modal>
    </>
  );
}
