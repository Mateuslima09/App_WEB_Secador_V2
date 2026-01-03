import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Calculator, ArrowRightLeft, History, Settings, X, RefreshCw } from 'lucide-react';
import packageJson from '../../package.json';

const Sidebar = ({ isOpen, onClose }) => {
    const { t } = useLanguage();

    const navItems = [
        { path: '/average', icon: Calculator, label: t('menu.average') },
        { path: '/', icon: ArrowRightLeft, label: t('menu.inversion') },
        { path: '/history', icon: History, label: t('menu.history') },
        { path: '/update', icon: RefreshCw, label: 'Atualização' }, // Using hardcoded label or add to translations? Let's use hardcoded for now or 'System'
        { path: '/settings', icon: Settings, label: t('menu.settings') },
    ];

    const overlayClass = isOpen
        ? "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 opacity-100"
        : "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 opacity-0 pointer-events-none";

    const sidebarClass = isOpen
        ? "fixed top-0 left-0 h-full w-64 glass-panel z-50 transition-transform duration-300 transform translate-x-0 border-l-0 rounded-l-none"
        : "fixed top-0 left-0 h-full w-64 glass-panel z-50 transition-transform duration-300 transform -translate-x-full border-l-0 rounded-l-none";

    return (
        <>
            <div className={overlayClass} onClick={onClose} />
            <aside className={sidebarClass}>
                <div className="p-4 flex justify-between items-center border-b border-[var(--color-border)]">
                    <h1 className="text-xl font-bold text-[var(--color-primary)]">SecadorCheck</h1>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--color-border)] rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <nav className="p-4 flex flex-col gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => `
                flex items-center gap-3 p-3 rounded-lg transition-colors
                ${isActive
                                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-green-500/20'
                                    : 'text-[var(--color-text)] hover:bg-[var(--color-border)]'
                                }
              `}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 mt-auto border-t border-[var(--color-border)] text-center">
                    <p className="text-xs text-[var(--color-text-secondary)] opacity-70">
                        v{packageJson.version}
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
