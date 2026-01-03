import React from 'react';
import { Menu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import NotificationBell from './NotificationBell';

const Header = ({ onMenuClick }) => {
    const { t } = useLanguage();

    return (
        <header className="h-16 flex items-center px-4 justify-between glass-panel rounded-none border-x-0 border-t-0 sticky top-0 z-30 mb-4">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 hover:bg-[var(--color-border)] rounded-full transition-colors"
                    aria-label="Open Menu"
                >
                    <Menu size={24} className="text-[var(--color-text)]" />
                </button>
                <h1 className="text-lg font-bold text-[var(--color-text)]">
                    Secador Monitor
                </h1>
            </div>
            <NotificationBell />
        </header>
    );
};

export default Header;
