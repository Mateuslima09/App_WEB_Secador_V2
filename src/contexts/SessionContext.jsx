import React, { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [averageValues, setAverageValues] = useState([]);
    const [averageResult, setAverageResult] = useState(null);

    const clearAverageSession = () => {
        setAverageValues([]);
        setAverageResult(null);
    };

    return (
        <SessionContext.Provider value={{
            averageValues,
            setAverageValues,
            averageResult,
            setAverageResult,
            clearAverageSession
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
