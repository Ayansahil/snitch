import React from 'react';

const QuantityControl = ({ quantity, onIncrease, onDecrease, isLoading }) => {
    const isZero = quantity <= 0;

    return (
        <div className={`flex items-center bg-zinc-50 rounded-xl border-2 transition-all duration-300 ${isZero ? 'border-error/20 bg-error/5' : 'border-transparent hover:border-zinc-200'}`}>
            <button
                onClick={onDecrease}
                disabled={isLoading}
                className="w-10 h-10 flex items-center justify-center transition-all hover:bg-zinc-100 active:scale-90 disabled:opacity-30 rounded-l-xl"
                aria-label="Decrease quantity"
            >
                <span className={`material-symbols-outlined text-lg ${isZero ? 'text-error' : 'text-on-surface'}`}>remove</span>
            </button>
            <span className={`w-8 text-center font-label-bold text-xs tabular-nums ${isZero ? 'text-error' : 'text-on-surface'}`}>
                {isLoading ? (
                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : quantity}
            </span>
            <button
                onClick={onIncrease}
                disabled={isLoading}
                className="w-10 h-10 flex items-center justify-center transition-all hover:bg-zinc-100 active:scale-90 disabled:opacity-30 rounded-r-xl"
                aria-label="Increase quantity"
            >
                <span className="material-symbols-outlined text-lg text-on-surface">add</span>
            </button>
        </div>
    );
};

export default QuantityControl;
