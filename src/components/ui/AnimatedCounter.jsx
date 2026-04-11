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
import { formatCompactNumber, formatNumber } from '../../utils/formatters';

/**
 * AnimatedCounter — Counts up from 0 to `target` when it scrolls into view.
 * 
 * @param {number} target - The number to count up to.
 * @param {string} suffix - Optional suffix like '+', '%', '★'
 * @param {string} prefix - Optional prefix like '$'
 * @param {number} duration - Animation duration in seconds (default 2)
 * @param {string} className - Additional classes for the number element
 * @param {string} locale - The locale for number formatting
 * @param {boolean} compact - Whether to use compact notation (e.g. 1.2K)
 */
const AnimatedCounter = ({ target, suffix = '', prefix = '', duration = 2, className = '', locale = 'en-US', compact = false }) => {
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
                const formatted = compact 
                    ? formatCompactNumber(value, locale) 
                    : formatNumber(value, locale);
                ref.current.textContent = `${prefix}${formatted}${suffix}`;
            }
        });
        return unsubscribe;
    }, [springValue, suffix, prefix, locale, compact]);

    return <span ref={ref} className={className}>{prefix}{compact ? '0' : '0'}{suffix}</span>;
};

export default AnimatedCounter;
