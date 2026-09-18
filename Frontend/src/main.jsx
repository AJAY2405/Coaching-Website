import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import "react-toastify/dist/ReactToastify.css";
import App from './App.jsx';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from './components/theme-provider.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
  <App />
</ThemeProvider>
        </PersistGate>
      </Provider>
  </StrictMode>
);