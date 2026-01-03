import React, { useState } from 'react';
import { Moon, Sun, Globe, Trash2, DatabaseZap, Save } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useHistory } from '../contexts/HistoryContext';
import { useNotification } from '../contexts/NotificationContext';
import ConfirmModal from '../components/ConfirmModal';

const SettingsPage = () => {
    const { t, language, setLanguage } = useLanguage();
    const { isDarkMode, toggleTheme } = useTheme();
    const { clearHistory, autoSave, toggleAutoSave } = useHistory();
    const { showNotification } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClearClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmClear = () => {
        clearHistory();
        setIsModalOpen(false);
        showNotification('success', t('settings.history_cleared'));
    };



    const handleClearData = async () => {
        if (window.confirm(t('common.are_you_sure'))) {
            // Clear localStorage
            localStorage.clear();

            // Clear Cache API
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(key => caches.delete(key)));
            }

            // Unregister Service Workers
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                }
            }

            alert(t('settings.data_cleared'));
            window.location.reload();
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold mb-2 gradient-text">{t('settings.title')}</h2>

            <div className="glass-panel p-0 overflow-hidden">
                {/* Theme Settings */}
                <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <span className="font-medium">{t('settings.dark_mode')}</span>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* Language Settings */}
                <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                            <Globe size={20} />
                        </div>
                        <span className="font-medium">{t('settings.language')}</span>
                    </div>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="input-field w-auto py-1"
                    >
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>

                {/* History Settings */}
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                            <Trash2 size={20} />
                        </div>
                        <span className="font-medium">{t('settings.clear_history')}</span>
                    </div>
                    <button onClick={handleClearClick} className="btn-secondary text-sm py-1 px-3 text-red-500 border-red-200">
                        {t('common.clear')}
                    </button>
                </div>

                {/* Auto Save Settings */}
                <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-lg">
                            <Save size={20} />
                        </div>
                        <span className="font-medium">{t('settings.auto_save')}</span>
                    </div>
                    <button
                        onClick={toggleAutoSave}
                        className={`w-12 h-6 rounded-full transition-colors relative ${autoSave ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${autoSave ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* System Settings */}
                <div className="p-4 border-t border-[var(--color-border)]">
                    <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
                        {t('settings.system')}
                    </h3>
                    <div className="flex flex-col gap-3">


                        <button
                            onClick={handleClearData}
                            className="bg-[var(--color-surface-solid)] w-full p-3 rounded-lg border border-[var(--color-border)] flex items-center justify-between hover:border-red-500/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                                    <DatabaseZap size={20} />
                                </div>
                                <span className="font-medium">{t('settings.clear_data')}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmClear}
                title={t('settings.clear_history')}
                message={t('common.confirm_clear_history')}
            />
        </div>
    );
};

export default SettingsPage;
