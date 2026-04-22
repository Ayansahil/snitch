import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../cart/hooks/useCart';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../../../components/common/Footer';

const ProductDetail = () => {
    const { productId } = useParams();
    const [ product, setProduct ] = useState(null);
    const [ selectedImage, setSelectedImage ] = useState(0);
    const [ selectedAttributes, setSelectedAttributes ] = useState({});
    const [ cartFeedback, setCartFeedback ] = useState('');
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const { handleAddItem } = useCart();
    const user = useSelector(state => state.auth.user);

    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [ productId ]);

    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedAttributes(product.variants[ 0 ].attributes || {});
        }
    }, [ product ]);

    const activeVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return null;
        return product.variants.find(v => {
            if (!v.attributes) return false;
            const vKeys = Object.keys(v.attributes);
            const sKeys = Object.keys(selectedAttributes);
            const isMatch = vKeys.every(k => v.attributes[ k ] === selectedAttributes[ k ]);
            return vKeys.length === sKeys.length && isMatch;
        });
    }, [ product, selectedAttributes ]);

    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};
        const attrs = {};
        product.variants.forEach(variant => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([ key, value ]) => {
                    if (!attrs[ key ]) attrs[ key ] = new Set();
                    attrs[ key ].add(value);
                });
            }
        });
        Object.keys(attrs).forEach(key => {
            attrs[ key ] = Array.from(attrs[ key ]);
        });
        return attrs;
    }, [ product ]);

    useEffect(() => {
        setSelectedImage(0);
    }, [ activeVariant ]);

    const handleAttributeChange = (attrName, value) => {
        const newAttrs = { ...selectedAttributes, [ attrName ]: value };
        const exactMatch = product.variants.find(v => {
            const vAttrs = v.attributes || {};
            return Object.keys(newAttrs).every(k => newAttrs[ k ] === vAttrs[ k ]) &&
                Object.keys(vAttrs).every(k => newAttrs[ k ] === vAttrs[ k ]);
        });

        if (exactMatch) {
            setSelectedAttributes(exactMatch.attributes);
        } else {
            const fallbackVariant = product.variants.find(v => v.attributes && v.attributes[ attrName ] === value);
            if (fallbackVariant) {
                setSelectedAttributes(fallbackVariant.attributes);
            } else {
                setSelectedAttributes(newAttrs);
            }
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse text-zinc-400">
                    Retrieving piece...
                </p>
            </div>
        );
    }

    const displayImages = (activeVariant?.images && activeVariant.images.length > 0)
        ? activeVariant.images
        : (product.images && product.images.length > 0 ? product.images : [ { url: '/snitch_editorial_warm.png' } ]);

    const displayPrice = activeVariant?.price?.amount
        ? activeVariant.price
        : product.price;

    return (
        <div className="bg-background text-on-background font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen pb-24">
            <Navbar />

            <main className="pt-24 max-w-[1200px] mx-auto px-6 md:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Media Gallery */}
                    <div className="flex-1 flex flex-col md:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[600px]">
                            {displayImages.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-16 h-20 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === idx ? 'border-primary' : 'border-transparent'}`}
                                >
                                    <img className="w-full h-full object-cover" src={img.url} alt={`Thumbnail ${idx}`} />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 order-1 md:order-2">
                            <div className="aspect-[4/5] max-h-[700px] bg-surface-container rounded-[1.5rem] overflow-hidden relative group mx-auto">
                                <img 
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                                    src={displayImages[selectedImage]?.url} 
                                    alt={product.title} 
                                />
                                <button className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}>
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                </button>
                                <button className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="w-full lg:w-[400px] space-y-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[10px] font-label-bold text-secondary tracking-widest uppercase">
                                <span>{product.category || 'Collection'}</span>
                                <span className="w-6 h-[1px] bg-secondary"></span>
                                <span>{product.isNew ? 'New' : 'Limited'}</span>
                            </div>
                            <h1 className="font-headline-lg text-4xl leading-tight">{product.title}</h1>
                            <div className="flex items-baseline gap-3">
                                <span className="font-headline-md text-2xl">
                                    {displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
                                </span>
                                {displayPrice?.oldAmount && (
                                    <span className="text-zinc-400 line-through text-base">
                                        {displayPrice?.currency} {displayPrice?.oldAmount?.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Attributes Selector */}
                        <div className="space-y-8">
                            {Object.entries(availableAttributes).map(([ attrName, values ]) => (
                                <div key={attrName} className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-label-bold text-sm uppercase tracking-widest">{attrName}</h3>
                                        <button className="text-xs text-zinc-400 underline underline-offset-4">Size Guide</button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {values.map(val => {
                                            const isSelected = selectedAttributes[ attrName ] === val;
                                            return (
                                                <button
                                                    key={val}
                                                    onClick={() => handleAttributeChange(attrName, val)}
                                                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 border-2 ${isSelected ? 'border-primary bg-primary text-white shadow-lg scale-105' : 'border-zinc-100 hover:border-zinc-300'}`}
                                                >
                                                    {val}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="font-label-bold text-sm uppercase tracking-widest">Description</h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-6">
                            <button
                                onClick={async () => {
                                    try {
                                        await handleAddItem({
                                            productId: product._id,
                                            variantId: activeVariant?._id || "default"
                                        });
                                        setCartFeedback('Added to Bag');
                                        setTimeout(() => setCartFeedback(''), 2000);
                                    } catch {
                                        setCartFeedback('Failed to add');
                                        setTimeout(() => setCartFeedback(''), 2000);
                                    }
                                }}
                                className="w-full bg-primary text-on-primary py-6 rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50"
                                disabled={activeVariant && activeVariant.stock === 0}
                            >
                                {cartFeedback || (activeVariant && activeVariant.stock === 0 ? 'Out of Stock' : 'Add to Bag')}
                            </button>
                            <button className="w-full border-2 border-primary py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all">
                                Buy Now
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 pt-12 border-t border-zinc-100">
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                                <span className="material-symbols-outlined text-lg">local_shipping</span>
                                <span>Complimentary Shipping</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                                <span className="material-symbols-outlined text-lg">workspace_premium</span>
                                <span>Authenticity Guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetail;