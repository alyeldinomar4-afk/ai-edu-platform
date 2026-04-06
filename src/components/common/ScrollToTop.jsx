import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll the main window to the top
        window.scrollTo(0, 0);
        
        // Also ensure body and documentElement are reset for cross-browser reliability
        if (document.body) document.body.scrollTop = 0;
        if (document.documentElement) document.documentElement.scrollTop = 0;

    }, [pathname]);

    return null;
};

export default ScrollToTop;
