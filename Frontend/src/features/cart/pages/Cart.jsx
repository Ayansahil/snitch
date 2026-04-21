import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector ,useDispatch } from 'react-redux';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import { updateQuantity as updateQuantityAction, removeItem as removeItemAction } from '../state/cart.slice';

const Cart = () => {
    const cartItems = useSelector(state => state.cart.items);
    const { handleGetCart, handleAddItem, handleRemoveItem, handleUpdateItemQuantity } = useCart();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [processingKey, setProcessingKey] = useState(null);

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

    function getKey(item) {
        return `${item.product?._id}_${item.variant || 'default'}`;
    }

    async function handleIncrease(item) {
        const key = getKey(item);
        setProcessingKey(key);
        try {
            await handleAddItem({
                productId: item.product?._id,
                variantId: item.variant || 'default',
            });
            // Auto-sync is handled by the hook
        } finally {
            setProcessingKey(null);
        }
    }

    const dispatch = useDispatch();

    const updateQuantity = (productId, variantId, newQty) => {
        // Redux slice update is still useful for optimistic feel, 
        // but handleUpdateItemQuantity below will overwrite it with DB truth.
        dispatch(updateQuantityAction({
            productId,
            variantId,
            quantity: newQty
        }));
    };

    const removeItem = async (productId, variantId) => {
        // Persistent removal from DB
        const key = `${productId}_${variantId}`;
        setProcessingKey(key);
        try {
            await handleRemoveItem({
                productId,
                variantId,
            });
            // Auto-sync is handled by the hook
        } finally {
            setProcessingKey(null);
        }
    };

    const handleDecrease = async (productId, variantId, quantity) => {
        if (quantity > 1) {
            // Persistent Update API (STRICT IMPLEMENTATION)
            const key = `${productId}_${variantId}`;
            setProcessingKey(key);
            try {
                await handleUpdateItemQuantity({
                    productId,
                    variantId,
                    quantity: quantity - 1
                });
            } finally {
                setProcessingKey(null);
            }
        } else {
            await removeItem(productId, variantId);
        }
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = cartItems.reduce((sum, item) => {
        const amount = item.price?.amount || item.product?.price?.amount || 0;
        return sum + amount * item.quantity;
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
                {/* ── Minimal Top Header ── */}
                <div className="px-8 lg:px-16 xl:px-24 pt-10 pb-6 flex items-center justify-between border-b" style={{ borderColor: '#e4e2df' }}>
                    <Link to="/"
                        className="text-sm font-medium tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                    >
                        Snitch.
                    </Link>
                </div>

                <div className="max-w-5xl mx-auto px-8 lg:px-16 xl:px-24 pb-32">
                    {/* ── Back Navigation ── */}
                    <div className="pt-8">
                        <button
                            onClick={() => navigate("/")}
                            className="text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2 transition-colors hover:text-[#C9A96E]"
                            style={{ color: '#7A6E63' }}
                        >
                            <span>←</span> Back to Archive
                        </button>
                    </div>

                    {/* ── Page Header ── */}
                    <div className="pt-10 pb-10">
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
                                Synchronizing with archive…
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
                                    {cartItems.map((item) => (
                                        <CartItem 
                                            key={getKey(item)}
                                            item={item}
                                            quantity={item.quantity}
                                            onIncrease={handleIncrease}
                                            onDecrease={(p, v, q) => handleDecrease(p, v, q)}
                                            currency={currency}
                                            isProcessing={processingKey === getKey(item)}
                                        />
                                    ))}
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
