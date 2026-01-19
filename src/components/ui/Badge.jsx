
import React from 'react';
import clsx from 'clsx';

export const Badge = ({ children, variant = 'default', className }) => {
    const variants = {
        default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        primary: 'bg-coral-100 text-coral-700 dark:bg-coral-900/30 dark:text-coral-400 border border-coral-200 dark:border-coral-800/50',
        success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50',
        error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50',
        outline: 'bg-transparent border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
    };

    return (
        <span className={clsx("px-3 py-1 rounded-soft text-xs font-semibold inline-flex items-center gap-1", variants[variant] || variants.default, className)}>
            {children}
        </span>
    );
};
