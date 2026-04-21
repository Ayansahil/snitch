import React from 'react';

const QuantityControl = ({ quantity, onIncrease, onDecrease, isLoading }) => {
    const isZero = quantity <= 0;

    return (
        <div
            className="flex items-center border transition-colors duration-200"
            style={{ borderColor: isZero ? '#ef4444' : '#d0c5b5' }}
        >
            <button
                onClick={onDecrease}
                disabled={isLoading}
                className="w-9 h-9 flex items-center justify-center text-base transition-colors duration-200 hover:bg-[#f5f3f0] disabled:opacity-40"
                style={{ color: isZero ? '#ef4444' : '#1b1c1a' }}
                aria-label="Decrease quantity"
            >
                −
            </button>
            <span
                className="w-8 text-center text-[12px] font-medium"
                style={{ color: isZero ? '#ef4444' : '#1b1c1a' }}
            >
                {isLoading ? '…' : quantity}
            </span>
            <button
                onClick={onIncrease}
                disabled={isLoading}
                className="w-9 h-9 flex items-center justify-center text-base transition-colors duration-200 hover:bg-[#f5f3f0] disabled:opacity-40"
                style={{ color: '#1b1c1a' }}
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    );
};

export default QuantityControl;
