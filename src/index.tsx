import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import { Home } from './pages/Home';
import './style.css';
import { ServicePage } from './pages/Service/ServicePage';
import { Layout } from './components/Layout/Layout';
import { _404 } from './pages/_404';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { DevicesPage } from './pages/Devices/DevicesPage';
import { DeviceCardPage } from './pages/DeviceCard/DeviceCardPage';

export function App() {
  return (
    <LocationProvider>
      <Layout>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/service" component={ServicePage} />
          <Route path="/service/devices" component={DevicesPage} />
          <Route path="/service/devices/:id" component={DeviceCardPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route default component={_404} />
        </Router>
      </Layout>
    </LocationProvider>
  );
}

render(<App />, document.getElementById('app'));
