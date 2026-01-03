import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Check, Trash2, Info } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

const NotificationBell = () => {
    const { t } = useLanguage();
    const {
        persistentNotifications,
        markAsRead,
        clearAllNotifications,
        unreadCount
    } = useNotification();

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);

    // ... (keep useEffect for click outside)

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        if (notification.actionLink) {
            navigate(notification.actionLink);
            setIsOpen(false);
        }
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleMarkRead = (id, e) => {
        e.stopPropagation();
        markAsRead(id);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="relative" ref={popoverRef}>
            <button
                onClick={handleToggle}
                className="p-2 relative hover:bg-[var(--color-border)] rounded-full transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} className="text-[var(--color-text)]" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-[var(--color-surface)] animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 glass-panel border border-[var(--color-border)] shadow-xl z-50 overflow-hidden animate-fade-in origin-top-right">
                    <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]/50">
                        <h3 className="font-semibold text-sm">Notificações</h3>
                        {persistentNotifications.length > 0 && (
                            <button
                                onClick={clearAllNotifications}
                                className="text-xs text-[var(--color-text-secondary)] hover:text-red-500 flex items-center gap-1 transition-colors"
                            >
                                <Trash2 size={12} />
                                {t('common.clear') || 'Limpar'}
                            </button>
                        )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {persistentNotifications.length === 0 ? (
                            <div className="p-8 text-center text-[var(--color-text-secondary)] flex flex-col items-center gap-2">
                                <Bell size={32} className="opacity-20" />
                                <p className="text-sm">Nenhuma notificação</p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {persistentNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`
                                            p-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)]/50 transition-colors cursor-pointer relative group
                                            ${!notification.read ? 'bg-[var(--color-primary)]/5' : ''}
                                        `}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 shrink-0 ${!notification.read ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                                                <Info size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className={`text-sm font-medium truncate ${!notification.read ? 'text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-[10px] text-[var(--color-text-secondary)] shrink-0">
                                                        {formatDate(notification.timestamp)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="shrink-0 flex items-center">
                                                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
