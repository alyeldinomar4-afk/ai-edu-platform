import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils';
import { useState } from 'react';

const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark btn-3d',
    secondary: 'bg-secondary text-white hover:bg-violet-600 btn-3d',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(79,70,229,0.25)] transition-shadow duration-300',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600 btn-3d',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    onClick,
    disabled = false,
    type = 'button',
    icon: Icon,
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasGlint = variant === 'primary' || variant === 'secondary';

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            type={type}
            onClick={onClick}
            disabled={disabled}
            {...props}
            className={cn(
                'relative rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer overflow-hidden group',
                variants[variant],
                sizes[size],
                disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                className
            )}
        >
            {/* Holographic Glint Effect */}
            {hasGlint && (
                <motion.div
                    initial={{ x: '-100%', skewX: -20 }}
                    animate={isHovered ? { x: '200%' } : { x: '-100%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10"
                />
            )}
            
            <span className="relative z-20 flex items-center gap-2">
                {Icon && <Icon size={size === 'sm' ? 16 : 20} />}
                {children}
            </span>
        </motion.button>
    );
};

export default Button;
