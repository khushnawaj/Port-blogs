import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/main.scss';
import { AuthProvider } from './contexts/AuthContext';
import { PortfolioProvider } from './contexts/portfolioContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
<AuthProvider>
  <PortfolioProvider>
    <App />
  </PortfolioProvider>
</AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);