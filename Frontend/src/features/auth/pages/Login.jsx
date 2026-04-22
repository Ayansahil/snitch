import React, { useState } from 'react';
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const Login = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [ formData, setFormData ] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [ name ]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await handleLogin({ email: formData.email, password: formData.password });
            if (user.role == "buyer") {
                navigate("/");
            } else if (user.role == "seller") {
                navigate("/seller/dashboard");
            }
        } catch (error) {
            console.error("Login failed", error);
        }
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
                        <span className="font-display-xl text-7xl text-white/10 [text-stroke:1px_white] leading-none uppercase">Performance</span>
                        <span className="font-display-xl text-7xl text-white leading-none uppercase">Refined</span>
                        <span className="font-display-xl text-7xl text-secondary-fixed italic leading-none uppercase">Athletics.</span>
                    </div>
                    <p className="mt-8 max-w-sm text-zinc-400 text-lg">
                        Join the elite ecosystem of luxury performance. Curated for the forward-thinking athlete.
                    </p>
                </div>
            </section>

            {/* Right Side: Clean Form Card */}
            <section className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-surface p-6 overflow-hidden">
                <div className="w-full max-w-[400px] space-y-8">
                    {/* Toggle Switch */}
                    <div className="flex justify-between items-center p-1 bg-zinc-100 rounded-xl">
                        <button className="flex-1 py-2 px-4 rounded-lg bg-white shadow-sm font-label-bold text-[10px] uppercase tracking-widest text-on-surface transition-all">
                            Login
                        </button>
                        <button 
                            onClick={() => navigate('/register')}
                            className="flex-1 py-2 px-4 rounded-lg text-zinc-400 hover:text-on-surface font-label-bold text-[10px] uppercase tracking-widest transition-all"
                        >
                            Register
                        </button>
                    </div>

                    {/* Welcome Text */}
                    <div className="space-y-2">
                        <h1 className="font-headline-lg text-3xl text-on-surface">Welcome Back.</h1>
                        <p className="font-body-md text-xs text-zinc-500">Access your curated collections and orders.</p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="group relative">
                                <label className="font-label-bold text-[9px] uppercase tracking-widest text-zinc-400 mb-1 block">Email Address</label>
                                <input 
                                    className="w-full bg-zinc-50 border-0 border-b-2 border-transparent focus:border-on-surface focus:ring-0 rounded-lg p-4 transition-all placeholder:text-zinc-300 text-sm" 
                                    placeholder="name@example.com" 
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="group relative">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="font-label-bold text-[9px] uppercase tracking-widest text-zinc-400 block">Password</label>
                                    <button type="button" className="text-[9px] font-label-bold uppercase tracking-widest text-zinc-400 hover:text-on-surface underline">Forgot?</button>
                                </div>
                                <input 
                                    className="w-full bg-zinc-50 border-0 border-b-2 border-transparent focus:border-on-surface focus:ring-0 rounded-lg p-4 transition-all placeholder:text-zinc-300 text-sm" 
                                    placeholder="••••••••" 
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        {/* CTA Button */}
                        <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg" type="submit">
                            Sign In
                        </button>
                    </form>

                    {/* Social Logins */}
                    <div className="space-y-6">
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-zinc-100"></div>
                            <span className="flex-shrink mx-3 font-label-bold text-[8px] uppercase tracking-[0.2em] text-zinc-300">OR CONTINUE WITH</span>
                            <div className="flex-grow border-t border-zinc-100"></div>
                        </div>
                        <ContinueWithGoogle />
                    </div>

                    {/* Footer Text */}
                    <p className="text-center text-zinc-400 text-[9px] uppercase tracking-widest">
                        By continuing, you agree to the AURA LUXE <button className="underline hover:text-on-surface">Terms</button> and <button className="underline hover:text-on-surface">Privacy</button>.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Login;