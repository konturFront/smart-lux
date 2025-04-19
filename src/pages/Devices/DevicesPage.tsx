import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { DevicesPageMobile } from './MobileVersion/DevicesPageMobile';

export const DevicesPage = () => {
  const { isMobile } = useDeviceDetect();

  return <DevicesPageMobile />;
};
