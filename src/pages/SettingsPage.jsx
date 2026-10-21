import React, { useState } from 'react';
import { Moon, Sun, Globe, Trash2, DatabaseZap, Save, Sparkles, Keyboard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useHistory } from '../contexts/HistoryContext';
import { useNotification } from '../contexts/NotificationContext';
import { useKeyboard } from '../contexts/KeyboardContext';
import ConfirmModal from '../components/ConfirmModal';
import packageJson from '../../package.json';

const SettingsPage = () => {
    const { t, language, setLanguage } = useLanguage();
    const { isDarkMode, toggleTheme } = useTheme();
    const { clearHistory, autoSave, toggleAutoSave } = useHistory();
    const { isVirtualKeyboardEnabled, toggleVirtualKeyboard } = useKeyboard();
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
            localStorage.clear();

            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(key => caches.delete(key)));
            }

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
        <div className="flex flex-col gap-6 animate-fade-in pb-20">
            <div>
                <h2 className="text-2xl font-bold gradient-text">{t('settings.title')}</h2>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
                    Personalização e preferências do Secador Monitor
                </p>
            </div>

            <div className="glass-panel p-0 overflow-hidden divide-y divide-[var(--color-border)]">
                {/* Theme Settings */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="font-semibold text-sm sm:text-base text-[var(--color-text)] block truncate">
                                {t('settings.dark_mode')}
                            </span>
                            <span className="text-xs text-[var(--color-text-secondary)] block truncate">
                                {isDarkMode ? 'Tema escuro ativado' : 'Tema claro ativado'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${isDarkMode ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                        aria-label="Alternar tema"
                    >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                    </button>
                </div>

                {/* Virtual Keyboard Option */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                            <Keyboard size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="font-semibold text-sm sm:text-base text-[var(--color-text)] block truncate">
                                {t('settings.virtual_keyboard')}
                            </span>
                            <span className="text-xs text-[var(--color-text-secondary)] block truncate">
                                {isVirtualKeyboardEnabled ? t('settings.virtual_keyboard_on') : t('settings.virtual_keyboard_off')}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={toggleVirtualKeyboard}
                        className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${isVirtualKeyboardEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                        aria-label="Alternar teclado virtual"
                    >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isVirtualKeyboardEnabled ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                    </button>
                </div>

                {/* Language Settings */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
                            <Globe size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="font-semibold text-sm sm:text-base text-[var(--color-text)] block truncate">
                                {t('settings.language')}
                            </span>
                            <span className="text-xs text-[var(--color-text-secondary)] block truncate">
                                Idioma de exibição
                            </span>
                        </div>
                    </div>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="input-field w-auto min-w-[120px] max-w-[140px] py-1.5 px-3 text-sm font-medium rounded-xl shrink-0 cursor-pointer"
                    >
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>

                {/* Auto Save Settings */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                            <Save size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="font-semibold text-sm sm:text-base text-[var(--color-text)] block truncate">
                                {t('settings.auto_save')}
                            </span>
                            <span className="text-xs text-[var(--color-text-secondary)] block truncate">
                                Salvar medições e médias automaticamente
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={toggleAutoSave}
                        className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${autoSave ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                        aria-label="Alternar salvamento automático"
                    >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${autoSave ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                    </button>
                </div>

                {/* History Management */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="p-2.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl shrink-0">
                            <Trash2 size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="font-semibold text-sm sm:text-base text-[var(--color-text)] block truncate">
                                {t('settings.clear_history')}
                            </span>
                            <span className="text-xs text-[var(--color-text-secondary)] block truncate">
                                Apagar registros salvos de umidade
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={handleClearClick} 
                        className="btn-secondary text-xs py-1.5 px-3 text-red-500 border-red-200 dark:border-red-900/40 hover:bg-red-500/10 shrink-0"
                    >
                        {t('common.clear')}
                    </button>
                </div>

                {/* System & Cache */}
                <div className="p-4 sm:p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">
                        {t('settings.system')}
                    </h3>
                    <button
                        onClick={handleClearData}
                        className="bg-[var(--color-surface-solid)] w-full p-3.5 rounded-xl border border-[var(--color-border)] flex items-center justify-between hover:border-red-500/40 transition-colors"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-orange-500/10 text-orange-600 rounded-lg shrink-0">
                                <DatabaseZap size={18} />
                            </div>
                            <div className="text-left min-w-0">
                                <span className="font-medium text-sm text-[var(--color-text)] block truncate">
                                    {t('settings.clear_data')}
                                </span>
                                <span className="text-xs text-[var(--color-text-tertiary)] block truncate">
                                    Redefinir cache e recarregar
                                </span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* App Info Footer */}
                <div className="p-4 sm:p-5 bg-[var(--color-surface-solid)]/50 flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-emerald-500" />
                        <span>Secador Monitor Versão 2.0 Clean</span>
                    </div>
                    <span className="font-mono font-bold text-[var(--color-primary)]">v{packageJson.version}</span>
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
