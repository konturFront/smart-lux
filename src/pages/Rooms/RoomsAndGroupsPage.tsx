import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { RoomsAndGroupsPageMobile } from './MobileVersion/RoomsAndGroupsPageMobile';
import { RoomsPageDesktop } from './DesktopVersion/RoomsPageDesktop';

export const RoomsAndGroupsPage = () => {
  const { isMobile } = useDeviceDetect();

  if (isMobile) {
    return <RoomsAndGroupsPageMobile />;
  }
  return <RoomsPageDesktop />;
};
