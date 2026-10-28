import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import PresentationPage from './pages/PresentationPage';

type Route = 'home' | 'presentation' | 'map';

function routeFromHash(): Route {
  const route = window.location.hash.replace('#/', '');
  if (route === 'presentation' || route === 'map') return route;
  return 'home';
}

export default function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);

  useEffect(() => {
    const handleHashChange = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === 'presentation') return <PresentationPage />;
  if (route === 'map') return <MapPage />;
  return <HomePage />;
}
