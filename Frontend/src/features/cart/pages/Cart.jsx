import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import Navbar from '../../products/components/Navbar';
import Footer from '../../../components/common/Footer';

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
        } finally {
            setProcessingKey(null);
        }
    }

    const removeItem = async (productId, variantId) => {
        const key = `${productId}_${variantId}`;
        setProcessingKey(key);
        try {
            await handleRemoveItem({
                productId,
                variantId,
            });
        } finally {
            setProcessingKey(null);
        }
    };

    const handleDecrease = async (item) => {
        const productId = item.product?._id;
        const variantId = item.variant || 'default';
        const quantity = item.quantity;
        const key = getKey(item);

        if (quantity > 1) {
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
        <div className="bg-background text-on-background font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen">
            <Navbar />

            <main className="pt-32 pb-section-gap px-8 md:px-12 max-w-[1280px] mx-auto">
                {/* Cart Title */}
                <header className="mb-12">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Your Bag</h1>
                    <p className="font-body-md text-on-surface-variant mt-2">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag. Estimated shipping will be calculated at checkout.
                    </p>
                </header>

                {loading ? (
                    <div className="py-24 text-center">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse text-zinc-400">Synchronizing Archive...</span>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="py-24 text-center flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4 text-secondary">Empty</span>
                        <p className="max-w-md mx-auto text-lg leading-relaxed mb-10 font-headline-md text-zinc-500">
                            Your bag is currently empty. Explore our latest pieces and add them to your collection.
                        </p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-primary text-on-primary px-10 py-4 font-label-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                        >
                            Explore Collection
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Left Column: Cart Items */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            {cartItems.map((item) => (
                                <CartItem 
                                    key={getKey(item)}
                                    item={item}
                                    quantity={item.quantity}
                                    onIncrease={handleIncrease}
                                    onDecrease={handleDecrease}
                                    onRemove={removeItem}
                                    currency={currency}
                                    isProcessing={processingKey === getKey(item)}
                                />
                            ))}
                        </div>

                        {/* Right Column: Order Summary */}
                        <aside className="lg:col-span-4 sticky top-32">
                            <div className="bg-white p-8 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-zinc-50">
                                <h2 className="font-headline-md text-headline-md text-on-surface mb-8">Order Summary</h2>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between font-body-md">
                                        <span className="text-on-surface-variant">Subtotal</span>
                                        <span className="text-on-surface font-bold">{currency} {totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-body-md">
                                        <span className="text-on-surface-variant">Shipping</span>
                                        <span className="text-on-surface font-bold text-xs uppercase">Calculated at checkout</span>
                                    </div>
                                    <div className="pt-6 border-t border-zinc-100 flex justify-between items-baseline">
                                        <span className="font-headline-md text-headline-md">Total</span>
                                        <span className="font-headline-lg text-headline-lg text-primary">
                                            {currency} {totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <button className="w-full py-5 bg-primary text-on-primary font-label-bold text-label-bold uppercase rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl hover:shadow-2xl mb-4">
                                    Proceed to Checkout
                                </button>
                                <div className="flex items-center justify-center gap-2 text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
                                    <span className="material-symbols-outlined text-sm">lock</span>
                                    Secure encrypted checkout
                                </div>
                                
                                {/* Promo Code */}
                                <div className="mt-8 pt-8 border-t border-zinc-100">
                                    <p className="font-label-bold text-[10px] uppercase tracking-widest text-zinc-400 mb-4">Promo Code</p>
                                    <div className="flex gap-2">
                                        <input 
                                            className="flex-1 bg-zinc-50 border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary/10" 
                                            placeholder="Enter code" 
                                            type="text"
                                        />
                                        <button className="px-6 border-2 border-primary font-label-bold text-[10px] uppercase rounded-lg hover:bg-primary hover:text-white transition-all">Apply</button>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
