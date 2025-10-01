import React from 'react';
import { HashRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
// Vendor CSS
import './assets/vendor/bootstrap/css/bootstrap.min.css';
import './assets/vendor/bootstrap-icons/bootstrap-icons.css';
import './assets/vendor/fontawesome-free/css/all.min.css';
import './assets/vendor/aos/aos.css';
import './assets/vendor/glightbox/css/glightbox.min.css';
import './assets/vendor/swiper/swiper-bundle.min.css';

// Your main styles
import './assets/css/main.css';
import './assets/css/custom.css'

const App = () => {
  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  );
};

export default App;
