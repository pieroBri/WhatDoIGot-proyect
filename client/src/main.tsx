import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Asegúrate de que el archivo existe
import { SocketProvider } from './context/SocketContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <SocketProvider>
        <App />
      </SocketProvider>
    </StrictMode>,
  );
} else {
  console.error('No root element found');
}
