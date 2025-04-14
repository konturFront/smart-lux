import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { HomePageMobile } from './MobileVersion/HomePageMobile';
import { RoomsPageDesktop } from './DesktopVersion/RoomsPageDesktop';

export const Home = () => {
  const { isMobile } = useDeviceDetect();

  if (isMobile) {
    return <HomePageMobile />;
  }
  return <RoomsPageDesktop />;
};
