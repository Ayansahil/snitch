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
    const itemCurrency = item.price?.currency || item.product?.price?.currency || currency;
    const getVariantObj = () => {
        return item.product?.variants?.find(
            v => v._id?.toString() === item.variant?.toString()
        );
    };

    const variantObj = getVariantObj();
    const currentPrice = variantObj?.price?.amount || item.product?.price?.amount || 0;
    const snapshotPrice = item.price?.amount || 0;
    const diff = currentPrice - snapshotPrice; 
    const isPriceIncreased = diff > 0;
    const isPriceDecreased = diff < 0;
    
    const stock = variantObj?.stock ?? item.product?.variants?.[0]?.stock ?? 0;

    const getVariantLabel = () => {
        if (!variantObj || !variantObj.attributes) return 'Default Variant';
        return Object.entries(variantObj.attributes)
            .map(([k, v]) => v)
            .join(' / ');
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-container hover:shadow-md transition-all duration-300 group">
            {/* Product Image */}
            <div className="w-full md:w-56 h-72 md:h-56 bg-surface-container rounded-xl overflow-hidden relative shrink-0">
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={imageUrl} 
                    alt={title} 
                />
                {isPriceDecreased && (
                    <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-label-bold uppercase tracking-wider">
                        Price Drop
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-3">
                        <h3 className="font-headline-md text-2xl text-on-surface tracking-tight">{title}</h3>
                        
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-tertiary-fixed-dim text-on-tertiary-fixed-variant text-[10px] font-label-bold uppercase tracking-widest rounded-md">
                                {getVariantLabel()}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-3">
                                <span className="font-headline-md text-xl text-on-surface">
                                    {itemCurrency} {currentPrice.toLocaleString()}
                                </span>
                                {(isPriceDecreased || isPriceIncreased) && (
                                    <span className="font-label-bold text-sm text-zinc-400 line-through">
                                        {itemCurrency} {snapshotPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <p className="font-label-bold text-[10px] text-zinc-400 uppercase tracking-widest">
                                {stock} IN STOCK
                            </p>
                        </div>
                    </div>
                </div>

                {/* Price Change Notifications */}
                <div className="mt-6">
                    {isPriceDecreased && (
                        <p className="font-label-bold text-[11px] uppercase tracking-widest text-secondary flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
                            YOU WILL GET THIS AT {itemCurrency} {currentPrice.toLocaleString()} SAVE {Math.abs(diff).toLocaleString()}.
                        </p>
                    )}
                    {isPriceIncreased && (
                        <p className="font-label-bold text-[11px] uppercase tracking-widest text-error flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse"></span>
                            WARNING: THIS PRODUCT WILL COST YOU {Math.abs(diff).toLocaleString()} MORE.
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-auto pt-8 border-t border-surface-container">
                    <QuantityControl 
                        quantity={quantity}
                        onIncrease={() => onIncrease(item)}
                        onDecrease={() => onDecrease(item)}
                        isLoading={isProcessing}
                    />
                    <button 
                        onClick={() => onRemove(item.product?._id, item.variant || 'default')}
                        className="flex items-center gap-2 text-zinc-400 hover:text-error transition-colors group/remove"
                    >
                        <span className="font-label-bold text-[10px] uppercase tracking-widest">Remove</span>
                        <span className="material-symbols-outlined text-lg transition-transform group-hover/remove:scale-110">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
