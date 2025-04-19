import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { RoomsPageMobile } from './MobileVersion/RoomsPageMobile';

export const RoomsPage = () => {
  const { isMobile } = useDeviceDetect();

  return <RoomsPageMobile />;
};
