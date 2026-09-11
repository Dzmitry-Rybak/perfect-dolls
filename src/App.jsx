import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { CommissionProvider } from './context/CommissionContext.jsx';
import { OrdersProvider } from './context/OrdersContext.jsx';
import CommissionModal from './components/commission/CommissionModal.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ButtonTrail from './components/ui/ButtonTrail.jsx';
import Backdrop from './components/ui/Backdrop.jsx';

import Home from './pages/Home.jsx';
import Squids from './pages/Squids.jsx';
import Builder from './pages/Builder.jsx';
import Dolls from './pages/Dolls.jsx';
import Portraits from './pages/Portraits.jsx';
import Other from './pages/Other.jsx';
import Gallery from './pages/Gallery.jsx';
import Workshop from './pages/Workshop.jsx';
import Faq from './pages/Faq.jsx';
import Pr from './pages/Pr.jsx';
import NotFound from './pages/NotFound.jsx';

/** Прокрутка наверх при смене маршрута — иначе новая страница
 *  открывается в середине, как была прокручена предыдущая. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <OrdersProvider>
      <CommissionProvider>
      <ScrollToTop />
      <Backdrop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/squids"     element={<Squids />} />
          <Route path="/builder"    element={<Builder />} />
          <Route path="/dolls"      element={<Dolls />} />
          <Route path="/portraits"  element={<Portraits />} />
          <Route path="/other"      element={<Other />} />
          <Route path="/gallery"    element={<Gallery />} />
          <Route path="/workshop"   element={<Workshop />} />
          <Route path="/faq"        element={<Faq />} />
          <Route path="/pr"         element={<Pr />} />
          <Route path="*"           element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ButtonTrail />
      <CommissionModal />
    </CommissionProvider>
    </OrdersProvider>
  );
}
