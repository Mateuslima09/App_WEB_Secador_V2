import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Home, Calculator, ArrowRightLeft, History, Settings, X, RefreshCw, Sparkles } from 'lucide-react';
import packageJson from '../../package.json';

const Sidebar = ({ isOpen, onClose }) => {
    const { t } = useLanguage();

    const navItems = [
        { path: '/', icon: Home, label: t('menu.home'), end: true },
        { path: '/inversion', icon: ArrowRightLeft, label: t('menu.inversion') },
        { path: '/average', icon: Calculator, label: t('menu.average') },
        { path: '/history', icon: History, label: t('menu.history') },
        { path: '/update', icon: RefreshCw, label: t('menu.update') || 'Atualizações' },
        { path: '/settings', icon: Settings, label: t('menu.settings') },
    ];

    const overlayClass = isOpen
        ? "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 opacity-100 backdrop-blur-xs"
        : "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 opacity-0 pointer-events-none";

    const sidebarClass = isOpen
        ? "fixed top-0 left-0 h-full w-72 glass-panel z-50 transition-transform duration-300 transform translate-x-0 border-l-0 rounded-l-none flex flex-col shadow-2xl"
        : "fixed top-0 left-0 h-full w-72 glass-panel z-50 transition-transform duration-300 transform -translate-x-full border-l-0 rounded-l-none flex flex-col shadow-2xl";

    return (
        <>
            <div className={overlayClass} onClick={onClose} />
            <aside className={sidebarClass}>
                <div className="p-5 flex justify-between items-center border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                            S
                        </div>
                        <div>
                            <h1 className="text-base font-extrabold text-[var(--color-text)] leading-tight">
                                Secador Monitor
                            </h1>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
                                v{packageJson.version} Clean
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] rounded-xl transition-colors"
                        aria-label="Fechar menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 flex flex-col gap-1.5 flex-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={onClose}
                            className={({ isActive }) => `
                                flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 font-medium text-sm
                                ${isActive
                                    ? 'bg-[var(--color-primary)] text-white shadow-md shadow-emerald-500/25 font-bold'
                                    : 'text-[var(--color-text)] hover:bg-[var(--color-surface-solid)] hover:text-[var(--color-primary)]'
                                }
                            `}
                        >
                            <item.icon size={20} className="shrink-0" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-[var(--color-border)] text-center bg-[var(--color-surface-solid)]/40">
                    <p className="text-xs text-[var(--color-text-tertiary)] flex items-center justify-center gap-1.5">
                        <Sparkles size={12} className="text-emerald-500" />
                        <span>Secador Monitor • Versão 2.0</span>
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
