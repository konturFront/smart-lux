import './styles.css';
import { useLocation } from 'preact-iso';

export function ServicePage() {
  const location = useLocation();

  return (
    <div className="service">
      <div className="wrapper-btn">
        <button
          className="btn"
          id="service-btn-rooms"
          onClick={() => {
            // location.route('/service/devices')
          }}
        >
          Настройка помещений
        </button>
        <button
          className="btn"
          id="service-btn-devices"
          onClick={() => {
            location.route('/service/devices');
          }}
        >
          Настройка устройств
        </button>
      </div>
    </div>
  );
}
