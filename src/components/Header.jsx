import React from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import NotificationBell from './NotificationBell';

const Header = ({ onMenuClick }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === '/';

    return (
        <header className="h-16 flex items-center px-3 sm:px-6 justify-between glass-panel rounded-none border-x-0 border-t-0 sticky top-0 z-30 mb-4 sm:mb-5">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {isHome ? (
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-1 hover:bg-[var(--color-border)] rounded-xl transition-colors text-[var(--color-text)] shrink-0"
                        aria-label="Abrir Menu"
                    >
                        <Menu size={22} />
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 -ml-1 hover:bg-[var(--color-border)] rounded-xl transition-colors text-[var(--color-text)] hover:text-[var(--color-primary)] shrink-0 flex items-center gap-1"
                        title={t('common.back')}
                        aria-label="Voltar para o Início"
                    >
                        <ArrowLeft size={22} />
                    </button>
                )}

                <div 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 cursor-pointer select-none group min-w-0"
                >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform shrink-0">
                        S
                    </div>
                    <span className="text-base font-extrabold text-[var(--color-text)] tracking-tight group-hover:text-[var(--color-primary)] transition-colors truncate">
                        Secador Monitor
                    </span>
                    <span className="hidden md:inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                        2.0 Clean
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
                <NotificationBell />
                {!isHome && (
                    <button
                        onClick={onMenuClick}
                        className="p-2 hover:bg-[var(--color-border)] rounded-xl transition-colors text-[var(--color-text)] shrink-0"
                        aria-label="Abrir Menu"
                    >
                        <Menu size={22} />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
