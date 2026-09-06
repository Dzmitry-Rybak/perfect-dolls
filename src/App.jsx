import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { CartProvider } from './context/CartContext.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ButtonTrail from './components/ui/ButtonTrail.jsx';

import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Constructor from './pages/Constructor.jsx';
import Cart from './pages/Cart.jsx';
import Gallery from './pages/Gallery.jsx';
import About from './pages/About.jsx';
import Faq from './pages/Faq.jsx';
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
    <CartProvider>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/catalog"       element={<Catalog />} />
          <Route path="/doll/:slug"    element={<Product />} />
          <Route path="/constructor"   element={<Constructor />} />
          <Route path="/cart"          element={<Cart />} />
          <Route path="/gallery"       element={<Gallery />} />
          <Route path="/about"         element={<About />} />
          <Route path="/faq"           element={<Faq />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ButtonTrail />
    </CartProvider>
  );
}
