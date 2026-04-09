import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const getInitialTheme = () => {
    // 1. Check localStorage
    const stored = localStorage.getItem('ai_edu_theme');
    if (stored === 'dark' || stored === 'light') return stored;

    return 'dark';
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(getInitialTheme);

    // Apply the dark class to <html> whenever theme changes
    useEffect(() => {
        const root = document.documentElement;
        const favicon = document.querySelector('link[rel="icon"]');

        if (theme === 'dark') {
            root.classList.add('dark');
            if (favicon) favicon.href = '/favicon-dark.png';
        } else {
            root.classList.remove('dark');
            if (favicon) favicon.href = '/favicon-light.png';
        }
        localStorage.setItem('ai_edu_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const setTheme = (newTheme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
