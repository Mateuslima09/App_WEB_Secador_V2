import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationContainer from './components/NotificationContainer';
import Layout from './components/Layout';
import AveragePage from './pages/AveragePage';
import InversionPage from './pages/InversionPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import UpdatePage from './pages/UpdatePage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <HistoryProvider>
            <BrowserRouter>
              <NotificationContainer />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<InversionPage />} />
                  <Route path="average" element={<AveragePage />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="update" element={<UpdatePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </HistoryProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
