import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="bg-surface text-on-surface border-t border-zinc-100 pt-24 pb-12 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="text-3xl font-black tracking-tighter text-zinc-900">AURA LUXE</Link>
                        <p className="text-zinc-500 font-body-md max-w-xs leading-relaxed">
                            Redefining the landscape of luxury performance. Curated for the forward-thinking athlete and aesthetic visionary.
                        </p>
                        <div className="flex gap-4">
                            {['instagram', 'twitter', 'facebook'].map(social => (
                                <button key={social} className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all duration-500">
                                    <span className="material-symbols-outlined text-lg">{social === 'twitter' ? 'x' : social}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-8">
                        <h4 className="font-label-bold text-xs uppercase tracking-widest text-zinc-400">Collections</h4>
                        <ul className="space-y-4">
                            {['New Arrivals', 'Best Sellers', 'Runway', 'The Archive'].map(item => (
                                <li key={item}>
                                    <Link to="/" className="font-label-bold text-xs uppercase tracking-widest text-zinc-900 hover:opacity-50 transition-opacity">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-8">
                        <h4 className="font-label-bold text-xs uppercase tracking-widest text-zinc-400">Support</h4>
                        <ul className="space-y-4">
                            {['Shipping', 'Returns', 'Size Guide', 'Contact'].map(item => (
                                <li key={item}>
                                    <Link to="/" className="font-label-bold text-xs uppercase tracking-widest text-zinc-900 hover:opacity-50 transition-opacity">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8">
                        <h4 className="font-label-bold text-xs uppercase tracking-widest text-zinc-400">Newsletter</h4>
                        <div className="space-y-4">
                            <p className="text-zinc-500 text-xs tracking-wide">Join the inner circle for exclusive drops and runway updates.</p>
                            <div className="flex border-b-2 border-zinc-900 pb-2">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="bg-transparent border-none focus:ring-0 w-full text-xs font-label-bold uppercase tracking-widest placeholder:text-zinc-300"
                                />
                                <button className="material-symbols-outlined text-zinc-900">arrow_forward</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-label-bold uppercase tracking-widest text-zinc-400">
                        © 2026 AURA LUXE. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8">
                        <button className="text-[10px] font-label-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900">Privacy Policy</button>
                        <button className="text-[10px] font-label-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900">Terms of Service</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
