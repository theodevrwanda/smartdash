
import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className }) => {
    return (
        <div className={clsx("bg-white dark:bg-slate-900 rounded-card shadow-card hover:shadow-card-hover border border-slate-100 dark:border-slate-800 p-6 transition-smooth", className)}>
            {children}
        </div>
    );
};

export default Card;
