import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { HomePageMobile } from './MobileVersion/HomePageMobile';

export const Home = () => {
  const { isMobile } = useDeviceDetect();

  return <HomePageMobile />;
};
