import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import axios from 'axios';
import SWRDevtools from '@jjordy/swr-devtools';

import App from '@layouts/App';
// import App from './App';
// import { worker } from './mocks/browser';
import './index.css';

// if (process.env.NODE_ENV === 'development') {
//   const { worker } = await import('./mocks/browser');
//   worker.start();
// }

(async () => {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser');
    worker.start();
  }
})();

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:5173';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {process.env.NODE_ENV === 'production' ? (
        <App />
      ) : (
        <SWRDevtools>
          <App />
        </SWRDevtools>
      )}
    </BrowserRouter>
  </React.StrictMode>,
);
