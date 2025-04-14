import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { SensorsPageMobile } from './MobileVersion/SensorsPageMobile';
import { SensorsPageDesktop } from './DesktopVersion/SensorsPageDesktop';

export const SensorsPage = () => {
  const { isMobile } = useDeviceDetect();

  if (isMobile) {
    return <SensorsPageMobile />;
  }
  return <SensorsPageDesktop />;
};
