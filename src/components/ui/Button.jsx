import { motion } from 'framer-motion';
import { cn } from '../../utils';

const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20',
    secondary: 'bg-secondary text-white hover:bg-sky-600 shadow-md shadow-secondary/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-red-500 text-white hover:bg-red-600',
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
    disabled,
    type = 'button',
    icon: Icon
}) => {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer',
                variants[variant],
                sizes[size],
                disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                className
            )}
        >
            {Icon && <Icon size={size === 'sm' ? 16 : 20} />}
            {children}
        </motion.button>
    );
};

export default Button;
