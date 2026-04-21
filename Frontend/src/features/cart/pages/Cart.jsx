import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useCart } from '../hooks/useCart';
import { setItems } from '../state/cart.slice';


const Cart = () => {
    const cartItems = useSelector(state => state.cart.items);
    const { handleGetCart, handleAddItem } = useCart();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Local quantity map keyed by `productId_variantId`
    const [localQuantities, setLocalQuantities] = useState({});
    const [loading, setLoading] = useState(true);
    const [addingItemKey, setAddingItemKey] = useState(null);

    useEffect(() => {
        async function fetchCart() {
            try {
                await handleGetCart();
            } finally {
                setLoading(false);
            }
        }
        fetchCart();
    }, []);

    // Seed local quantities from redux whenever cartItems change
    useEffect(() => {
        const map = {};
        cartItems.forEach(item => {
            const key = `${item.product?._id}_${item.variant || 'default'}`;
            if (localQuantities[key] === undefined) {
                map[key] = item.quantity;
            } else {
                map[key] = localQuantities[key];
            }
        });
        setLocalQuantities(map);
    }, [cartItems]);

    function getKey(item) {
        return `${item.product?._id}_${item.variant || 'default'}`;
    }

    function getVariantLabel(item) {
        const variantObj = item.product?.variants?.find(
            v => v._id?.toString() === item.variant?.toString()
        );
        if (!variantObj || !variantObj.attributes) return 'Default Variant';
        return Object.entries(variantObj.attributes)
            .map(([k, v]) => `${k}: ${v}`)
            .join(' / ');
    }

    async function handleIncrease(item) {
        const key = getKey(item);
        setAddingItemKey(key);
        try {
            await handleAddItem({
                productId: item.product?._id,
                variantId: item.variant || 'default',
            });
            setLocalQuantities(prev => ({ ...prev, [key]: (prev[key] ?? item.quantity) + 1 }));
        } finally {
            setAddingItemKey(null);
        }
    }

    function handleDecrease(item) {
        const key = getKey(item);
        const currentQty = localQuantities[key] ?? item.quantity;
        
        if (currentQty <= 1) {
            // Remove item from local state and store
            const newCartItems = cartItems.filter(i => getKey(i) !== key);
            dispatch(setItems(newCartItems));
            
            setLocalQuantities(prev => {
                const newState = { ...prev };
                delete newState[key];
                return newState;
            });
        } else {
            setLocalQuantities(prev => ({ ...prev, [key]: currentQty - 1 }));
        }
    }

    const totalItems = Object.values(localQuantities).reduce((sum, qty) => sum + qty, 0);

    const totalPrice = cartItems.reduce((sum, item) => {
        const key = getKey(item);
        const qty = localQuantities[key] ?? item.quantity;
        // If qty is 0 (item removed), don't add to price
        if (!qty) return sum;
        
        const amount = item.price?.amount || item.product?.price?.amount || 0;
        return sum + amount * qty;
    }, 0);

    const currency = cartItems[0]?.price?.currency
        || cartItems[0]?.product?.price?.currency
        || 'INR';

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
               

                <div className="max-w-5xl mx-auto px-8 lg:px-16 xl:px-24 pb-32">
                    {/* ── Page Header ── */}
                    <div className="pt-14 pb-10">
                        <span
                            className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3 block"
                            style={{ color: '#C9A96E' }}
                        >
                            {totalItems} {totalItems === 1 ? 'Piece' : 'Pieces'}
                        </span>
                        <h1
                            className="text-4xl lg:text-5xl font-light leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                        >
                            Your Cart
                        </h1>
                        <div className="mt-4 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
                    </div>

                    {loading ? (
                        <div className="py-32 text-center">
                            <p
                                className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse"
                                style={{ color: '#B5ADA3' }}
                            >
                                Preparing your cart…
                            </p>
                        </div>
                    ) : cartItems.length === 0 ? (
                        /* ── Empty State ── */
                        <div className="py-24 text-center flex flex-col items-center">
                            <span
                                className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4"
                                style={{ color: '#C9A96E' }}
                            >
                                Empty
                            </span>
                            <p
                                className="max-w-md mx-auto text-lg leading-relaxed mb-10"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A6E63' }}
                            >
                                Your cart holds nothing yet. Discover our curated archive and add pieces you love.
                            </p>
                            <Link
                                to="/"
                                className="py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300"
                                style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = '#C9A96E';
                                    e.currentTarget.style.color = '#1b1c1a';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '#1b1c1a';
                                    e.currentTarget.style.color = '#fbf9f6';
                                }}
                            >
                                Explore the Archive
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                            {/* ── Cart Items ── */}
                            <div className="flex-1 w-full">
                                <div className="divide-y" style={{ borderColor: '#e4e2df' }}>
                                    {cartItems.map((item) => {
                                        const key = getKey(item);
                                        const qty = localQuantities[key] ?? item.quantity;
                                        const isZero = qty === 0;
                                        const isAdding = addingItemKey === key;

                                        const imageUrl = item.product?.images?.[0]?.url || '/snitch_editorial_warm.png';
                                        const title = item.product?.title || 'Unknown Product';
                                        const variantLabel = getVariantLabel(item);
                                        const amount = item.price?.amount || item.product?.price?.amount || 0;
                                        const itemCurrency = item.price?.currency || item.product?.price?.currency || currency;

                                        return (
                                            <div
                                                key={key}
                                                className="py-8 flex gap-6 items-start"
                                            >
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
                                                        {variantLabel}
                                                    </p>

                                                    <p
                                                        className="text-[11px] uppercase tracking-[0.2em] font-medium mt-1"
                                                        style={{ color: '#7A6E63' }}
                                                    >
                                                        {itemCurrency} {(amount * qty).toLocaleString()}
                                                    </p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                                    {/* Unit price */}
                                                    <span
                                                        className="text-[10px] uppercase tracking-[0.15em]"
                                                        style={{ color: '#B5ADA3' }}
                                                    >
                                                        {itemCurrency} {amount.toLocaleString()} each
                                                    </span>

                                                    {/* +/- controls */}
                                                    <div
                                                        className="flex items-center border transition-colors duration-200"
                                                        style={{ borderColor: isZero ? '#ef4444' : '#d0c5b5' }}
                                                    >
                                                        <button
                                                            onClick={() => handleDecrease(item)}
                                                            className="w-9 h-9 flex items-center justify-center text-base transition-colors duration-200 hover:bg-[#f5f3f0]"
                                                            style={{ color: isZero ? '#ef4444' : '#1b1c1a' }}
                                                            aria-label="Decrease quantity"
                                                        >
                                                            −
                                                        </button>
                                                        <span
                                                            className="w-8 text-center text-[12px] font-medium"
                                                            style={{ color: isZero ? '#ef4444' : '#1b1c1a' }}
                                                        >
                                                            {qty}
                                                        </span>
                                                        <button
                                                            onClick={() => handleIncrease(item)}
                                                            disabled={isAdding}
                                                            className="w-9 h-9 flex items-center justify-center text-base transition-colors duration-200 hover:bg-[#f5f3f0] disabled:opacity-40"
                                                            style={{ color: '#1b1c1a' }}
                                                            aria-label="Increase quantity"
                                                        >
                                                            {isAdding ? '…' : '+'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── Order Summary ── */}
                            <div
                                className="w-full lg:w-72 flex-shrink-0 border p-8 sticky top-10"
                                style={{ borderColor: '#e4e2df', backgroundColor: '#f5f3f0' }}
                            >
                                <h2
                                    className="text-xl font-light mb-6"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                                >
                                    Order Summary
                                </h2>
                                <div className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.15em]">
                                    <div className="flex justify-between" style={{ color: '#7A6E63' }}>
                                        <span>Items</span>
                                        <span>{totalItems}</span>
                                    </div>
                                    <div className="h-px w-full" style={{ backgroundColor: '#e4e2df' }} />
                                    <div className="flex justify-between font-medium" style={{ color: '#1b1c1a' }}>
                                        <span>Subtotal</span>
                                        <span>{currency} {totalPrice.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] normal-case tracking-normal mt-1" style={{ color: '#B5ADA3' }}>
                                        Shipping calculated at checkout.
                                    </p>
                                </div>

                                <button
                                    className="mt-8 w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                    style={{
                                        backgroundColor: '#1b1c1a',
                                        color: '#fbf9f6',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = '#C9A96E';
                                        e.currentTarget.style.color = '#1b1c1a';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = '#1b1c1a';
                                        e.currentTarget.style.color = '#fbf9f6';
                                    }}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <footer className="border-t py-12 text-center" style={{ borderColor: '#e4e2df' }}>
                    <span
                        className="text-[10px] uppercase tracking-[0.35em]"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                    >
                        Snitch. © {new Date().getFullYear()}
                    </span>
                </footer>
            </div>
        </>
    );
};

export default Cart;
