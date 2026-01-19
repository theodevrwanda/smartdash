
import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className }) => {
    return (
        <div className={clsx("bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6 transition-all duration-300", className)}>
            {children}
        </div>
    );
};

export default Card;
