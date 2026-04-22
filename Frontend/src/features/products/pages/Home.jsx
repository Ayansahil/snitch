import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../../../components/common/Footer';

const Home = () => {
    const products = useSelector(state => state.product.products);
    const searchQuery = useSelector(state => state.product.searchQuery);
    const { handleGetAllProducts } = useProduct();
    const navigate = useNavigate();

    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    useEffect(() => {
        if (!products) return;
        
        const filtered = products.filter(p =>
            p.title?.toLowerCase().includes((searchQuery || "").toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    return (
        <div className="bg-background text-on-background font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen">
            <Navbar />

            <main className="pt-24 overflow-x-hidden">
                {/* Hero Section */}
                <section className="min-h-[819px] flex flex-col md:flex-row items-center px-8 md:px-20 max-w-[1440px] mx-auto gap-12 py-12">
                    <div className="flex-1 space-y-stack-md">
                        <span className="text-label-bold font-label-bold text-secondary tracking-[0.2em] uppercase">Limited Edition Release</span>
                        <h1 className="font-display-xl text-display-xl">VELOCITY <br/> ELITE ONE</h1>
                        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-lg">
                            Engineered for the elite. Combining responsive cushioning with a featherweight carbon-fiber plate for unprecedented energy return.
                        </p>
                        <div className="flex items-center gap-6 pt-6">
                            <button className="bg-primary text-on-primary px-10 py-5 font-label-bold text-label-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl">Shop Now</button>
                            <button className="border-2 border-primary px-10 py-5 font-label-bold text-label-bold uppercase tracking-widest hover:bg-zinc-50 transition-all">Discover Tech</button>
                        </div>
                        <div className="flex gap-4 pt-12">
                            <div className="w-12 h-1 bg-primary"></div>
                            <div className="w-12 h-1 bg-surface-container-highest"></div>
                            <div className="w-12 h-1 bg-surface-container-highest"></div>
                        </div>
                    </div>
                    <div className="flex-1 relative w-full h-[500px] md:h-[700px] bg-secondary-container/30 rounded-[4rem] flex items-center justify-center">
                        <img 
                            className="w-full h-full object-contain transform -rotate-12 hover:rotate-0 transition-transform duration-700" 
                            alt="Modern high-performance red running shoe" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs0M8HsAc1KZD9YwHR-Cnjv-4i-EdA3fQ8eM1XMaCBXIpUJqEGbmlBuIykyZ5jOLuTOijRtnyBRr-DVb_OJS4624EJw5-6qUf5moPPQ3gkwJ4EdJ8VouvxJELDyyYr4uD_T4UZbqUlg58UKkmkLWoW6uN6uluoGfHx_4wJDGJtmAOf7etQq-nD_xxAvTahpSHEYIuwIJpSwvd67yEd2d07lr51-5DNa0w8Tmy0U32JO9mX2UB5aqlUNgQUY1JIHAjkTMaAU7jgnRcZ"
                        />
                    </div>
                </section>

                {/* Category Horizontal Scroll */}
                <section className="py-section-gap px-8">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="font-headline-lg text-headline-lg">Shop by Pursuit</h2>
                                <p className="text-body-md font-body-md text-on-surface-variant">Curated performance for every arena.</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-zinc-100 transition-colors">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <button className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-zinc-100 transition-colors">
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-grid-gutter overflow-x-auto hide-scrollbar pb-8">
                            {/* Static Categories */}
                            {[
                                { name: 'Running', items: '12 Items', color: 'bg-secondary-container/20', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnhFjrMXqsfMt0kbqt3gCUAAM0DVawtfClq64hLNbCl6vfDvgssmpGN_dEwK0TA4kR_yHy7NDnkFC5roqviORkhkHvBkyhHcGqR4PTVQ0OsP80R-5ptTR0_aWeV7bTQdOElBuCfqmtu45kUZILKzKFjij8wf8NK8jeOIMPb4RavWTZsQzBTSnP9DpW9F-ut5t8DVGPGmBPkAecZhUj7-953U1fLI5_Qj1aeVPeQn6uwV8iyAMuGG8r1NZ4ffIiLSCp95ebOPfID9sU' },
                                { name: 'Lifestyle', items: '24 Items', color: 'bg-error-container/20', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4hC54ep75NjXZI_sSi67UrJmpU0KR1XuVchNxuLM0iR84e86cSKD1QqcimgBm222LTYup01XMt4pjoGgxWMDE77r8wALJGNNjaBb19udVSB41e-y-LsYvHjd7Q-Oj-SJ-c2vEkRI-D292BQ1iBjQhVcDfFT3mNSzMBH2N2TeMh2ad8L7O72oVMAdaDHXtcK0-teFk6FtO9xT9p6f63IKekc6abPSKBxXMw0KdqfT9es1L4XhHNLFb5M526n0SZkoe0Za3ITnSnTwY' },
                                { name: 'Basketball', items: '18 Items', color: 'bg-tertiary-fixed/20', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGeJUiiGlx4XhIt9SQCtoAFLIdOBkYVsz2QasQt6M7AJ9yQKsDiNoQszji-IEYujM6WKmLidsEr3jGJdLsDqlj3neNtrX8Zc2zQzZ1QGbhXern7vF_GoBcL7OpubdQLirQMl7pwikk5hgoaQUSL10HLLG4ckz9Ma_t0Urv4g9RYzNYY493ycVRc3IEFVGAzOBvuTAQwvAXKjnkZRS-xYEq8tMTvZgFVlMlLGf30UpsfCypS1czcPRqKbwomznCdSlvefuOoN0fH6Ia' },
                                { name: 'Training', items: '09 Items', color: 'bg-secondary-fixed/20', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYy2NebdYE4_pw6LXRj11kar2FbzsCybqy4NK_GO-c8FCFfpVvzEVEVFg37nwsbZFULo62F98EWfcj_uWV_AC69iqkFbMwIxw_tVhL4Hj3ceaHcRuObKCfk6JNn6eDWi2nJZrDXS80xbCkf6tNWS4GI1FyMPIJU-bu_uI6lOzJ3dWsL4SIstuL2uSIgx07tBNIUFTKYzLdyyr2UtW7VoQ-aCX6_lSbPPuQuqICKMa7gfLtucmQ54QKYBRSMMeQunMCqpiwlZrXCF5i' }
                            ].map((cat, idx) => (
                                <div key={idx} className="min-w-[400px] group cursor-pointer">
                                    <div className={`h-[500px] ${cat.color} rounded-2xl overflow-hidden mb-6 flex items-center justify-center relative`}>
                                        <img className="w-4/5 object-contain group-hover:scale-110 transition-transform duration-500" alt={cat.name} src={cat.img} />
                                        <span className="absolute bottom-8 left-8 text-label-bold font-label-bold bg-white px-4 py-2 rounded-full">{cat.items}</span>
                                    </div>
                                    <h3 className="font-headline-md text-headline-md">{cat.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section className="py-section-gap px-8 bg-surface-container-lowest">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
                            <h2 className="font-headline-lg text-headline-lg">
                                {searchQuery ? `Results for "${searchQuery}"` : "Trending Now"}
                            </h2>
                            <div className="flex gap-8 text-label-bold font-label-bold uppercase tracking-widest text-zinc-400">
                                <button className="text-zinc-900 border-b-2 border-zinc-900 pb-1">All Products</button>
                                <button className="hover:text-zinc-900 transition-colors">New Arrivals</button>
                                <button className="hover:text-zinc-900 transition-colors">Best Sellers</button>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-grid-gutter gap-y-16">
                                {filteredProducts.map((product) => {
                                    const imageUrl = product.images && product.images.length > 0
                                        ? product.images[0].url
                                        : '/snitch_editorial_warm.png';

                                    return (
                                        <div key={product._id} className="group cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                                            <div className="relative aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden mb-6 p-8 flex items-center justify-center hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group-hover:-translate-y-2">
                                                {product.isNew && <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">New</span>}
                                                <img 
                                                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
                                                    alt={product.title} 
                                                    src={imageUrl} 
                                                />
                                                <button className="absolute bottom-6 left-6 right-6 bg-primary text-white py-4 font-label-bold uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                    View Details
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-label-bold text-label-bold text-zinc-500 uppercase tracking-widest">{product.category || 'COLLECTION'}</h4>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-headline-md text-[18px]">{product.title}</h3>
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-bold text-zinc-900">
                                                            {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-24 text-center flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4 text-secondary">No Results</span>
                                <p className="max-w-md mx-auto text-lg leading-relaxed font-headline-md text-zinc-500">
                                    No pieces found for "{searchQuery}".
                                </p>
                            </div>
                        )}

                        <div className="mt-24 text-center">
                            <button className="border-b-2 border-primary pb-2 font-label-bold text-label-bold uppercase tracking-[0.2em] hover:text-zinc-500 transition-colors">View All Collections</button>
                        </div>
                    </div>
                </section>

                {/* Newsletter / Editorial */}
                <section className="py-section-gap px-8">
                    <div className="max-w-[1440px] mx-auto bg-zinc-900 text-white rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                            <img className="w-full h-full object-cover" alt="Editorial" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQi7lP9CPNKNapJ2jwPvq-NNMwo0TR3vixZuZFl3-7XavIvTkXKyWFJ0eUqUaLaZqOr9rAr8K9pp-oMPHm9DNsrmheosNXC-_rZlO5Nq6Xkm8jznzfYQXX6LNppR6VoJKcwHcPJmjdaKUydSbUCTzOO_m1iZpG9bn57hpVrAAB66ZeuK8oV386hMY5-SoNmnQfSlxpUsbzqF0Smmdx2gPOnHvUwU32a_RjD6Vfp6TdNowMLHdkdB8Oj1HUK1AyQU3aMaxznJsFHSSk" />
                        </div>
                        <div className="flex-1 relative z-10 space-y-8">
                            <h2 className="font-headline-lg text-6xl leading-tight">Join the Inner <br/> Circle of Performance</h2>
                            <p className="text-zinc-400 text-lg max-w-md">Be the first to know about drops, athlete collaborations, and exclusive member-only collections.</p>
                            <form className="flex flex-col sm:flex-row gap-4">
                                <input className="bg-zinc-800 border-none rounded-lg px-6 py-4 flex-1 focus:ring-2 focus:ring-white/20" placeholder="Enter your email" type="email"/>
                                <button className="bg-white text-black px-10 py-4 font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors">Subscribe</button>
                            </form>
                        </div>
                        <div className="flex-1 relative z-10 hidden md:block">
                            <div className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-full flex items-center justify-center p-12">
                                <span className="material-symbols-outlined text-8xl text-white/10">mail</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
;