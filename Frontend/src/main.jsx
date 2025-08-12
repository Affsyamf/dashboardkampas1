import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './components/theme-provider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"               // <--- WAJIB ditambahkan agar dark mode pakai class
      defaultTheme="dark"            // bisa juga "system" kalau mau ikut OS
      storageKey="vite-ui-theme"
    >
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
