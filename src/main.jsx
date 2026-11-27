import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Bundled locally on purpose: an MV3 extension page must not depend on a CDN
// for its stylesheet (offline use + no third-party request on popup open).
import 'katex/dist/katex.min.css';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('ENT Lab: #root container is missing from the host document.');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
