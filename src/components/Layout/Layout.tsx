import { useEffect } from 'preact/hooks';
import { socketService } from '../../service/ws/socketService';
import { Header } from '../Header/Header';
import { Wrapper } from '../Wrapper/Wrapper';
import { state } from '../../store/store';
import styles from './styles.module.scss';
export const Layout = ({ children }: { children?: preact.ComponentChildren }) => {
  useEffect(() => {
    socketService.connect(state.value.socketURL);
    return () => {
      socketService.disconnect();
    };
  }, []);
  return (
    <div>
      <Header />
      <Wrapper>{children}</Wrapper>
    </div>
  );
};
