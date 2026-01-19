import React from 'react';

const Loading = ({ message = 'Loading...', fullScreen = true }) => {
    return (
        <div className={`${fullScreen ? 'fixed inset-0' : 'w-full h-full'} flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50`}>
            <div className="flex flex-col items-center gap-6">
                {/* Modern gradient spinner */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="spinner-gradient">
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="spinner-bar"
                                    style={{
                                        transform: `rotate(${i * 30}deg) translate(0, -140%)`,
                                        animationDelay: `${-1.2 + i * 0.1}s`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Loading text */}
                {message && (
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider animate-pulse">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Loading;
