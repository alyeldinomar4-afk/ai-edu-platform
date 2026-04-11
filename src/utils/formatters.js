/**
 * Utility functions for formatting data in the UI.
 */

/**
 * Formats a number with commas (e.g., 12500 -> 12,500)
 */
export const formatNumber = (num, locale = 'en-US') => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat(locale).format(num);
};

/**
 * Formats a number into a compact string (e.g., 1200 -> 1.2K)
 */
export const formatCompactNumber = (num, locale = 'en-US') => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(num);
};

/**
 * Formats a number as currency (USD)
 */
export const formatCurrency = (num, locale = 'en-US', currency = 'USD') => {
    if (num === null || num === undefined) return currency === 'USD' ? '$0' : '0';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(num);
};

/**
 * Formats views count (e.g., 1200 -> 1.2k views)
 */
export const formatViews = (num, locale = 'en-US') => {
    if (num === null || num === undefined) return '0 views';
    return `${formatCompactNumber(num, locale).toLowerCase()} views`;
};
/**
 * Formats duration in seconds to MM:SS or HH:MM:SS
 */
export const formatDuration = (totalSeconds) => {
    // If it's already a formatted string (MM:SS or HH:MM:SS), return as is
    if (typeof totalSeconds === 'string' && totalSeconds.includes(':')) {
        return totalSeconds;
    }

    const secondsNum = parseInt(totalSeconds, 10);
    if (!secondsNum || isNaN(secondsNum) || secondsNum <= 0) return '0:00';
    
    const hours = Math.floor(secondsNum / 3600);
    const minutes = Math.floor((secondsNum % 3600) / 60);
    const seconds = Math.floor(secondsNum % 60);

    const parts = [];
    if (hours > 0) parts.push(hours);
    parts.push(hours > 0 ? String(minutes).padStart(2, '0') : minutes);
    parts.push(String(seconds).padStart(2, '0'));

    return parts.join(':');
};
