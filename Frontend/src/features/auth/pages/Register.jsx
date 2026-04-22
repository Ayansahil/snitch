import React, { useState } from 'react';
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const Register = () => {
    const { handleRegister } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        password: '',
        isSeller: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister({
            email: formData.email,
            contact: formData.contactNumber,
            password: formData.password,
            isSeller: formData.isSeller,
            fullname: formData.fullName
        });
        navigate("/");
    };

    return (
        <main className="flex h-screen w-full overflow-hidden bg-background text-on-background font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed">
            {/* Left Side: High-Impact Branding */}
            <section className="hidden lg:flex flex-col relative w-1/2 h-full bg-primary-container overflow-hidden">
                {/* Branding Navigation */}
                <div className="absolute top-0 left-0 p-12 z-20">
                    <button 
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-2 text-white/70 hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                        <span className="font-label-bold text-[10px] uppercase tracking-widest">Back to AURA LUXE</span>
                    </button>
                </div>
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        className="w-full h-full object-cover grayscale opacity-50" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYaGed8xly6904KuaucQnQYn3iNbq2ybkYRnigu48txdvBs3jmfN7MfuypGDdhLSCoxSFps4Hg7ZdAex4McoVCyGbwOX2KMT53rcLivC21uNabYLj3_9zCfbjWb5W_RJyjyOxK66i74aQqXyBOPVO501_wNiNPIwoldySDPy7qfrZEowggUGzaeVP9wzovHVEm-4UmzAllp_rYctc8-cjqJRLaLDqRZKh1UgwUPpo9akKUnj1mnfbCR80rkTxpaFAYnttQfvrhMW5y" 
                        alt="Editorial Model" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                </div>
                {/* Experimental Typography Overlay */}
                <div className="relative z-10 mt-auto p-12 mb-12">
                    <div className="flex flex-col space-y-[-10px]">
                        <span className="font-display-xl text-7xl text-white/10 [text-stroke:1px_white] leading-none uppercase">Define Your</span>
                        <span className="font-display-xl text-7xl text-white leading-none uppercase">Aesthetic</span>
                        <span className="font-display-xl text-7xl text-secondary-fixed italic leading-none uppercase">Identity.</span>
                    </div>
                    <p className="mt-8 max-w-sm text-zinc-400 text-lg">
                        Join the exclusive movement of creators and brands redefining the modern fashion landscape.
                    </p>
                </div>
            </section>

            {/* Right Side: Clean Form Card */}
            <section className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-surface p-6 md:p-10 overflow-hidden">
                <div className="w-full max-w-[420px] space-y-6">
                    {/* Toggle Switch */}
                    <div className="flex justify-between items-center p-1 bg-zinc-100 rounded-xl">
                        <button 
                            onClick={() => navigate('/login')}
                            className="flex-1 py-2 px-4 rounded-lg text-zinc-400 hover:text-on-surface font-label-bold text-[10px] uppercase tracking-widest transition-all"
                        >
                            Login
                        </button>
                        <button className="flex-1 py-2 px-4 rounded-lg bg-white shadow-sm font-label-bold text-[10px] uppercase tracking-widest text-on-surface transition-all">
                            Register
                        </button>
                    </div>

                    {/* Welcome Text */}
                    <div className="space-y-1">
                        <h1 className="font-headline-lg text-3xl text-on-surface">Join the Archive.</h1>
                        <p className="font-body-md text-xs text-zinc-500">Create your account to access curated collections.</p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-3">
                            <div className="group relative">
                                <label className="font-label-bold text-[10px] uppercase tracking-widest text-zinc-400 mb-1 block">Full Name</label>
                                <input 
                                    className="w-full bg-zinc-50 border-0 border-b-2 border-transparent focus:border-on-surface focus:ring-0 rounded-lg p-3.5 transition-all placeholder:text-zinc-300 text-sm" 
                                    placeholder="John Doe" 
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="group relative">
                                <label className="font-label-bold text-[10px] uppercase tracking-widest text-zinc-400 mb-1 block">Contact Number</label>
                                <input 
                                    className="w-full bg-zinc-50 border-0 border-b-2 border-transparent focus:border-on-surface focus:ring-0 rounded-lg p-3.5 transition-all placeholder:text-zinc-300 text-sm" 
                                    placeholder="+91 98765 43210" 
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="group relative">
                                <label className="font-label-bold text-[10px] uppercase tracking-widest text-zinc-400 mb-1 block">Email Address</label>
                                <input 
                                    className="w-full bg-zinc-50 border-0 border-b-2 border-transparent focus:border-on-surface focus:ring-0 rounded-lg p-3.5 transition-all placeholder:text-zinc-300 text-sm" 
                                    placeholder="name@example.com" 
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="group relative">
                                <label className="font-label-bold text-[10px] uppercase tracking-widest text-zinc-400 mb-1 block">Password</label>
                                <input 
                                    className="w-full bg-zinc-50 border-0 border-b-2 border-transparent focus:border-on-surface focus:ring-0 rounded-lg p-3.5 transition-all placeholder:text-zinc-300 text-sm" 
                                    placeholder="••••••••" 
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Seller Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer group py-1">
                            <input 
                                type="checkbox" 
                                name="isSeller"
                                checked={formData.isSeller}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-zinc-200 text-primary focus:ring-primary/20 transition-all" 
                            />
                            <span className="font-label-bold text-[10px] uppercase tracking-widest text-zinc-400 group-hover:text-on-surface transition-colors">Register as Seller</span>
                        </label>

                        {/* CTA Button */}
                        <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg mt-2" type="submit">
                            Sign Up
                        </button>
                    </form>

                    {/* Social Logins */}
                    <div className="space-y-4">
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-zinc-100"></div>
                            <span className="flex-shrink mx-4 font-label-bold text-[9px] uppercase tracking-[0.2em] text-zinc-300">OR CONTINUE WITH</span>
                            <div className="flex-grow border-t border-zinc-100"></div>
                        </div>
                        <ContinueWithGoogle />
                    </div>

                    {/* Footer Text */}
                    <p className="text-center text-zinc-400 text-[10px] uppercase tracking-widest pt-2">
                        By continuing, you agree to the AURA LUXE <button className="underline hover:text-on-surface">Terms</button> and <button className="underline hover:text-on-surface">Privacy</button>.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Register;