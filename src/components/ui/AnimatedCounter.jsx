import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

/**
 * AnimatedCounter — Counts up from 0 to `target` when it scrolls into view.
 * 
 * @param {number} target - The number to count up to.
 * @param {string} suffix - Optional suffix like '+', '%', '★'
 * @param {string} prefix - Optional prefix like '$'
 * @param {number} duration - Animation duration in seconds (default 2)
 * @param {string} className - Additional classes for the number element
 */
const AnimatedCounter = ({ target, suffix = '', prefix = '', duration = 2, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 60,
        stiffness: 100,
        duration: duration * 1000,
    });

    useEffect(() => {
        if (isInView) {
            motionValue.set(target);
        }
    }, [isInView, motionValue, target]);

    useEffect(() => {
        const unsubscribe = springValue.on('change', (latest) => {
            if (ref.current) {
                const value = Math.round(latest);
                // Format with commas for large numbers
                const formatted = value >= 1000 
                    ? value.toLocaleString() 
                    : value.toString();
                ref.current.textContent = `${prefix}${formatted}${suffix}`;
            }
        });
        return unsubscribe;
    }, [springValue, suffix, prefix]);

    return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
};

export default AnimatedCounter;
