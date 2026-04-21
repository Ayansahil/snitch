import React from 'react';
import QuantityControl from '../../../components/common/QuantityControl';

const CartItem = ({ 
    item, 
    quantity, 
    onIncrease, 
    onDecrease, 
    currency,
    isProcessing 
}) => {
    const imageUrl = item.product?.images?.[0]?.url || '/snitch_editorial_warm.png';
    const title = item.product?.title || 'Unknown Product';
    const amount = item.price?.amount || item.product?.price?.amount || 0;
    const itemCurrency = item.price?.currency || item.product?.price?.currency || currency;

    // Safe handling of variant attributes
    const getVariantLabel = () => {
        const variantObj = item.product?.variants?.find(
            v => v._id?.toString() === item.variant?.toString()
        );
        if (!variantObj || !variantObj.attributes) return 'Default Variant';
        return Object.entries(variantObj.attributes)
            .map(([k, v]) => `${k}: ${v}`)
            .join(' / ');
    };

    return (
        <div className="py-8 flex gap-6 items-start">
            {/* Product Image */}
            <div
                className="w-24 h-32 flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: '#f5f3f0' }}
            >
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-2">
                <h3
                    className="text-xl font-light leading-snug"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                >
                    {title}
                </h3>

                <p
                    className="text-[10px] uppercase tracking-[0.15em]"
                    style={{ color: '#B5ADA3' }}
                >
                    {getVariantLabel()}
                </p>

                <p
                    className="text-[11px] uppercase tracking-[0.2em] font-medium mt-1"
                    style={{ color: '#7A6E63' }}
                >
                    {itemCurrency} {(amount * quantity).toLocaleString()}
                </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <span
                    className="text-[10px] uppercase tracking-[0.15em]"
                    style={{ color: '#B5ADA3' }}
                >
                    {itemCurrency} {amount.toLocaleString()} each
                </span>

                <QuantityControl 
                    quantity={quantity}
                    onIncrease={() => onIncrease(item)}
                    onDecrease={() => onDecrease(item.product?._id, item.variant || 'default', quantity)}
                    isLoading={isProcessing}
                />
            </div>
        </div>
    );
};

export default CartItem;
