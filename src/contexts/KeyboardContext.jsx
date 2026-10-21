import React, { createContext, useContext, useState, useEffect } from 'react';

const KeyboardContext = createContext();

export const KeyboardProvider = ({ children }) => {
    const [isVirtualKeyboardEnabled, setIsVirtualKeyboardEnabled] = useState(() => {
        const saved = localStorage.getItem('settings_virtual_keyboard');
        // If not set, default to false on touch/mobile devices or true if user explicitly enabled it
        if (saved !== null) {
            return JSON.parse(saved);
        }
        // Default to false if on small screen / mobile so native keyboard is default,
        // or let's default to true but easily toggleable
        return true;
    });

    useEffect(() => {
        localStorage.setItem('settings_virtual_keyboard', JSON.stringify(isVirtualKeyboardEnabled));
    }, [isVirtualKeyboardEnabled]);

    const toggleVirtualKeyboard = () => {
        setIsVirtualKeyboardEnabled(prev => !prev);
    };

    return (
        <KeyboardContext.Provider value={{
            isVirtualKeyboardEnabled,
            setIsVirtualKeyboardEnabled,
            toggleVirtualKeyboard
        }}>
            {children}
        </KeyboardContext.Provider>
    );
};

export const useKeyboard = () => {
    const context = useContext(KeyboardContext);
    if (!context) {
        throw new Error('useKeyboard must be used within a KeyboardProvider');
    }
    return context;
};
