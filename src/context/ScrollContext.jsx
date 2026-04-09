import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ScrollContext = createContext();

/**
 * ScrollProvider — Manages the active scroll container reference.
 */
export const ScrollProvider = ({ children }) => {
    // We store the actual element to trigger re-renders of the consumer
    const [activeContainer, setActiveContainer] = useState(null);
    
    // We also maintain a stable ref-like object that useScroll can track
    const containerRef = useRef(null);

    const setScrollContainer = useCallback((element) => {
        containerRef.current = element;
        setActiveContainer(element);
    }, []);

    return (
        <ScrollContext.Provider value={{ scrollContainer: containerRef, activeContainer, setScrollContainer }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScrollContext = () => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error('useScrollContext must be used within a ScrollProvider');
    }
    return context;
};
