import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { useScrollContext } from '../../context/ScrollContext';
import React, { useState, useEffect, useRef } from 'react';

/**
 * ScrollProgress — A unified gradient bar that tracks either the window 
 * or a specific container provided via ScrollContext.
 */
const ScrollProgress = () => {
    const { scrollContainer, activeContainer } = useScrollContext();
    
    // We use a internal component to ensure useScroll hook re-initializes 
    // when the scroll target changes. 
    return (
        <ProgressBarInner 
            key={activeContainer ? 'container' : 'window'}
            scrollContainer={scrollContainer} 
            activeContainer={activeContainer} 
        />
    );
};

const ProgressBarInner = ({ scrollContainer, activeContainer }) => {
    const { scrollYProgress } = useScroll({
        container: activeContainer ? scrollContainer : undefined
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 50,
        restDelta: 0.001,
    });

    const [isScrollable, setIsScrollable] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);

    // Track scroll position to fix the "stuck at 100%" issue
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // If progress is very close to 1 but we are actually at the top, it's a bug
        const el = activeContainer || document.documentElement;
        if (el && el.scrollTop < 5 && latest > 0.9) {
            setIsAtTop(true);
        } else {
            setIsAtTop(false);
        }
    });

    useEffect(() => {
        const checkScrollable = () => {
            const el = activeContainer || document.documentElement;
            if (el) {
                // Check if the content is taller than the container
                const canScroll = el.scrollHeight > el.clientHeight + 5;
                setIsScrollable(canScroll);
                setIsAtTop(el.scrollTop < 5);
            }
        };

        checkScrollable();
        
        // Use ResizeObserver for more reliable detection of content changes
        const el = activeContainer || document.documentElement;
        if (!el) return;

        const resizeObserver = new ResizeObserver(checkScrollable);
        resizeObserver.observe(el);
        
        // Also observe the first child of the scroller if possible (content changes)
        if (el.firstElementChild) {
            resizeObserver.observe(el.firstElementChild);
        }

        window.addEventListener('resize', checkScrollable);
        const interval = setInterval(checkScrollable, 1000); // Heartbeat check

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', checkScrollable);
            clearInterval(interval);
        };
    }, [activeContainer]);

    // The bar should be hidden ONLY if the container is not scrollable (content fits on screen)
    const shouldShow = isScrollable;

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: shouldShow ? 1 : 0 }}
            style={{
                scaleX: (isScrollable && isAtTop) ? 0 : scaleX,
                background: 'linear-gradient(90deg, #4f46e5 0%, #8b5cf6 40%, #ec4899 100%)',
            }}
            transition={{ opacity: { duration: 0.3 } }}
        />
    );
};

export default ScrollProgress;
