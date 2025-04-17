import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { RoomsPageMobile } from './MobileVersion/RoomsPageMobile';
import { RoomsPageDesktop } from './DesktopVersion/RoomsPageDesktop';

export const RoomsPage = () => {
  const { isMobile } = useDeviceDetect();

  if (isMobile) {
    return <RoomsPageMobile />;
  }
  return <RoomsPageDesktop />;
};
