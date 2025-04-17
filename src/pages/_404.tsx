import { useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';

export const _404 = () => {
  const route = useLocation();
  useEffect(() => {
    setTimeout(() => {
      route.route('/');
    }, 3000);
  }, [route]);
  return null;
};
