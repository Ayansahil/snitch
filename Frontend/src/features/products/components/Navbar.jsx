import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery } from '../state/product.slice';
import { useAuth } from '../../auth/hooks/useAuth';

const Navbar = () => {
    const user = useSelector(state => state.auth.user);
    const cartItems = useSelector(state => state.cart.items);
    const searchQuery = useSelector(state => state.product.searchQuery);
    const { handleLogout } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [localSearch, setLocalSearch] = useState(searchQuery);

    const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setSearchQuery(localSearch));
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, dispatch]);

    const handleSearchChange = (e) => {
        setLocalSearch(e.target.value);
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-b border-zinc-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center px-8 py-6 w-full max-w-[1440px] mx-auto">
                {/* Brand */}
                <Link to="/" className="text-2xl font-black tracking-tighter text-zinc-900">AURA LUXE</Link>
                
                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-900 border-b-2 border-zinc-900 pb-1">Shop</Link>
                    <Link to="/" className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Collections</Link>
                    <Link to="/" className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Archive</Link>
                    <Link to="/" className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Runway</Link>
                </div>

                {/* Right Side Tools */}
                <div className="flex items-center gap-6">
                    {/* Search Input */}
                    <div className="relative hidden lg:block">
                        <input 
                            type="text"
                            value={localSearch}
                            onChange={handleSearchChange}
                            placeholder="Search"
                            className="bg-zinc-50 border-none rounded-full px-6 py-2 text-sm focus:ring-1 focus:ring-primary w-64 transition-all"
                        />
                    </div>
                    
                    <div className="flex items-center gap-5">
                        {/* User / Auth */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to={user.role === 'seller' ? "/seller/dashboard" : "/profile"} className="hover:scale-105 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-zinc-900">person</span>
                                </Link>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hidden sm:inline">{user.fullname.split(' ')[0]}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="hover:scale-105 transition-transform duration-300 text-zinc-400 hover:text-zinc-900"
                                    title="Logout"
                                >
                                    <span className="material-symbols-outlined text-lg">logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="hover:scale-105 transition-transform duration-300">
                                <span className="material-symbols-outlined text-zinc-900">person</span>
                            </Link>
                        )}

                        {/* Wishlist Placeholder */}
                        <button className="hover:scale-105 transition-transform duration-300 active:scale-95">
                            <span className="material-symbols-outlined text-zinc-900">favorite</span>
                        </button>

                        {/* Cart */}
                        <Link to="/cart" className="hover:scale-105 transition-transform duration-300 active:scale-95 relative">
                            <span className="material-symbols-outlined text-zinc-900">shopping_bag</span>
                            {totalQuantity > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
