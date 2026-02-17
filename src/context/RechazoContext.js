import React, { createContext, useState, useContext } from 'react';

const RechazoContext = createContext();

export const RechazoProvider = ({ children }) => {
    const [cacheNota, setCacheNota] = useState(null);
    const [cacheSearch, setCacheSearch] = useState('');
    const [cacheSelecteds, setCacheSelecteds] = useState([]);

    const limpiarCache = () => {
        setCacheNota(null);
        setCacheSearch('');
        setCacheSelecteds([]);
    };

    return (
        <RechazoContext.Provider value={{ 
            cacheNota, setCacheNota, 
            cacheSearch, setCacheSearch, 
            cacheSelecteds, setCacheSelecteds,
            limpiarCache 
        }}>
            {children}
        </RechazoContext.Provider>
    );
};

export const useRechazoCache = () => useContext(RechazoContext);