import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { DevicesPageMobile } from './MobileVersion/DevicesPageMobile';
import { DevicesPageDesktop } from './DesktopVersion/DevicesPageDesktop';

export const DevicesPage = () => {
  const { isMobile } = useDeviceDetect();

  if (isMobile) {
    return <DevicesPageMobile />;
  }
  return <DevicesPageDesktop />;
};
