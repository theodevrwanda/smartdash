
import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className }) => {
    return (
        <div className={clsx("bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300", className)}>
            {children}
        </div>
    );
};

export default Card;
