import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppWithRouter } from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store'; // Archivo de configuración de Redux
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWithRouter />
      <ToastContainer autoClose={3000} position="top-right" />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
