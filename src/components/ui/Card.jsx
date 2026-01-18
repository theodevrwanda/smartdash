
import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className }) => {
    return (
        <div className={clsx("bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-all duration-300", className)}>
            {children}
        </div>
    );
};

export default Card;
