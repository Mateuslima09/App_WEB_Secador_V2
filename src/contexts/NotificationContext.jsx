import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [persistentNotifications, setPersistentNotifications] = useState([]);

    const showNotification = useCallback((type, message, duration = 3000) => {
        const id = uuidv4();
        setNotifications(prev => [...prev, { id, type, message }]);

        if (duration) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const addPersistentNotification = useCallback((notification) => {
        setPersistentNotifications(prev => {
            // Check if a notification with this ID already exists
            if (notification.id && prev.some(n => n.id === notification.id)) {
                return prev;
            }

            const id = notification.id || uuidv4();
            const newNotification = {
                id,
                timestamp: new Date().toISOString(),
                read: false,
                ...notification
            };
            return [newNotification, ...prev];
        });
        // We can't return the ID reliably here if we are inside setState, 
        // but for this use case we don't strictly need it returned immediately for logic elsewhere.
        // If we really need it, we can compute it before setState.
        return notification.id;
    }, []);

    const markAsRead = useCallback((id) => {
        setPersistentNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    }, []);

    const clearAllNotifications = useCallback(() => {
        setPersistentNotifications([]);
    }, []);

    const unreadCount = persistentNotifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            showNotification,
            removeNotification,
            persistentNotifications,
            addPersistentNotification,
            markAsRead,
            clearAllNotifications,
            unreadCount
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
