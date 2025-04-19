import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { SensorsPageMobile } from './MobileVersion/SensorsPageMobile';

export const SensorsPage = () => {
  const { isMobile } = useDeviceDetect();

  return <SensorsPageMobile />;
};
