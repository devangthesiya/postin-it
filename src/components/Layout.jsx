import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
