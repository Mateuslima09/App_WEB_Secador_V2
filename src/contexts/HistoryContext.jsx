import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('calc_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [autoSave, setAutoSave] = useState(() => {
        const saved = localStorage.getItem('settings_autosave');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('calc_history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('settings_autosave', JSON.stringify(autoSave));
    }, [autoSave]);

    const toggleAutoSave = () => {
        setAutoSave(prev => !prev);
    };

    const MAX_ITEMS = 100;
    const isHistoryFull = history.length >= MAX_ITEMS;

    const addToHistory = (item) => {
        if (isHistoryFull) return false;

        const newItem = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...item
        };
        setHistory(prev => [newItem, ...prev]);
        return true;
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <HistoryContext.Provider value={{ history, addToHistory, clearHistory, autoSave, toggleAutoSave, isHistoryFull, MAX_ITEMS }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => useContext(HistoryContext);
