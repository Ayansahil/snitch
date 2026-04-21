import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery } from '../state/product.slice';

const Navbar = () => {
    const user = useSelector(state => state.auth.user);
    const cartItems = useSelector(state => state.cart.items);
    const searchQuery = useSelector(state => state.product.searchQuery);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [localSearch, setLocalSearch] = useState(searchQuery);

    // Total quantity for the badge
    const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    // Sync local search with global search query (useful if cleared elsewhere)
    useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    // Handle debounced search update
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
        <nav 
            className="px-8 lg:px-16 xl:px-24 pt-10 pb-6 flex items-center justify-between border-b sticky top-0 z-50 transition-all duration-300" 
            style={{ borderColor: '#e4e2df', backgroundColor: '#fbf9f6f2', backdropFilter: 'blur(8px)' }}
        >
            {/* ── Logo ── */}
            <Link to="/"
                className="text-sm font-medium tracking-[0.35em] uppercase hover:opacity-80 transition-opacity flex-shrink-0"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
            >
                Snitch.
            </Link>

            {/* ── Search Bar (Issue 4: Center position) ── */}
            <div className="flex-1 max-w-md mx-8 relative">
                <input
                    type="text"
                    value={localSearch}
                    onChange={handleSearchChange}
                    placeholder="Search curated pieces…"
                    className="w-full py-2 pl-4 pr-10 text-[11px] tracking-[0.08em] border bg-transparent outline-none transition-colors duration-200 placeholder:uppercase placeholder:tracking-[0.18em]"
                    style={{
                        borderColor: localSearch ? '#C9A96E' : '#d0c5b5',
                        color: '#1b1c1a',
                        fontFamily: "'Inter', sans-serif",
                    }}
                />
                <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: '#B5ADA3' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4"
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
            </div>

            {/* ── Right Icons (Issue 3: Icon replacement + count) ── */}
            <div className="flex gap-8 items-center text-[10px] uppercase tracking-[0.2em] font-medium flex-shrink-0" style={{ color: '#7A6E63' }}>
                {user ? (
                    <div className="hidden md:flex gap-6 items-center">
                        <span style={{ color: '#1b1c1a' }}>{user.fullname}</span>
                        {user.role === 'seller' && (
                            <Link to="/seller/dashboard" className="transition-colors hover:text-[#C9A96E]">Dashboard</Link>
                        )}
                    </div>
                ) : (
                    <div className="hidden md:flex gap-6 items-center">
                        <Link to="/login" className="transition-colors hover:text-[#C9A96E]">Sign In</Link>
                        <Link to="/register" className="transition-colors hover:text-[#C9A96E]">Sign Up</Link>
                    </div>
                )}

                {/* Cart Icon with Badge */}
                <Link to="/cart" className="relative group p-1">
                    <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="transition-colors group-hover:text-[#C9A96E]"
                        style={{ color: '#1b1c1a' }}
                    >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    
                    {totalQuantity > 0 && (
                        <span 
                            className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center text-[9px] font-bold rounded-full text-white px-1"
                            style={{ backgroundColor: '#C9A96E' }}
                        >
                            {totalQuantity}
                        </span>
                    )}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
