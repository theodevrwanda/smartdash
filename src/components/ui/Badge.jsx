
import React from 'react';
import clsx from 'clsx';

export const Badge = ({ children, variant = 'default', className }) => {
    const variants = {
        default: 'bg-slate-100 text-slate-700',
        success: 'bg-green-100 text-green-700 border border-green-200',
        warning: 'bg-amber-100 text-amber-700 border border-amber-200',
        error: 'bg-red-100 text-red-700 border border-red-200',
        info: 'bg-blue-100 text-blue-700 border border-blue-200',
    };

    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1", variants[variant] || variants.default, className)}>
            {children}
        </span>
    );
};
