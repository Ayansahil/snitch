import React from 'react';
import QuantityControl from '../../../components/common/QuantityControl';

const CartItem = ({ 
    item, 
    quantity, 
    onIncrease, 
    onDecrease, 
    onRemove,
    currency,
    isProcessing 
}) => {
    const imageUrl = item.product?.images?.[0]?.url || '/snitch_editorial_warm.png';
    const title = item.product?.title || 'Unknown Product';
    const amount = item.price?.amount || item.product?.price?.amount || 0;
    const itemCurrency = item.price?.currency || item.product?.price?.currency || currency;

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
        <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-50 group hover:border-zinc-200 transition-all">
            <div className="w-full md:w-48 h-64 md:h-48 bg-surface-container rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
                    src={imageUrl} 
                    alt={title} 
                />
            </div>
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-headline-md text-xl text-on-surface">{title}</h3>
                        <p className="font-headline-md text-xl">{itemCurrency} {amount.toLocaleString()}</p>
                    </div>
                    <div className="mt-2 space-y-1">
                        <p className="font-label-bold text-[10px] text-zinc-400 uppercase tracking-widest">{getVariantLabel()}</p>
                    </div>
                </div>
                <div className="flex justify-between items-end mt-8">
                    <QuantityControl 
                        quantity={quantity}
                        onIncrease={() => onIncrease(item)}
                        onDecrease={() => onDecrease(item)}
                        isLoading={isProcessing}
                    />
                    <button 
                        onClick={() => onRemove(item.product?._id, item.variant || 'default')}
                        className="flex items-center gap-2 text-error font-label-bold text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity"
                    >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
