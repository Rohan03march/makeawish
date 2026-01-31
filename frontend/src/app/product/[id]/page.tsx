"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { Minus, Plus, Star, Truck, ShieldCheck, Heart, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

// Mock Data
const PRODUCTS = {
    1: {
        id: 1,
        name: "Midnight Hazelnut Truffle",
        price: 2400,
        description: "Experience the depth of 70% dark chocolate combined with the crunch of roasted hazelnuts. A perfect balance of bitter and sweet, finished with a dusting of cocoa powder.",
        ingredients: "Cocoa mass, sugar, cocoa butter, hazelnuts, emulsifier (soy lecithin), natural vanilla flavouring.",
        images: ["/dark-truffle.png", "/gift-box.png", "/milk-swirl.png"],
        reviews: 42,
        rating: 4.8
    },
    2: {
        id: 2,
        name: "Velvet Caramel Swirl",
        price: 2750,
        description: "Silky smooth milk chocolate filled with a gooey salted caramel center. A classic indulgence redefined with premium Swiss cocoa.",
        ingredients: "Sugar, cocoa butter, whole milk powder, cocoa mass, cream, butter, sea salt.",
        images: ["/milk-swirl.png", "/dark-truffle.png", "/gift-box.png"],
        reviews: 35,
        rating: 4.7
    },
    3: {
        id: 3,
        name: "Royal Selection Gift Box",
        price: 7200,
        description: "The ultimate gesture of luxury. 24 hand-picked truffles, pralines, and ganaches in our signature gold-embossed box.",
        ingredients: "Various artisan ingredients. Contains nuts, dairy, soy.",
        images: ["/gift-box.png", "/dark-truffle.png", "/milk-swirl.png"],
        reviews: 215,
        rating: 5.0
    }
}

export default function ProductPage() {
    const params = useParams()
    const { addItem } = useCart()
    const [quantity, setQuantity] = React.useState(1)
    const [activeImage, setActiveImage] = React.useState(0)

    const productId = params?.id ? Number(params.id) : 1
    const product = PRODUCTS[productId as keyof typeof PRODUCTS] || PRODUCTS[1]

    const handleAddToCart = () => {
        addItem({ ...product, quantity, image: product.images[0] })
    }

    return (
        <div className="min-h-screen bg-chocolate-950 text-white">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Gallery */}
                    <div className="space-y-6">
                        <motion.div
                            key={activeImage}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="aspect-square bg-gradient-to-br from-chocolate-800/30 to-chocolate-900/30 rounded-3xl flex items-center justify-center relative overflow-hidden group border border-white/5"
                        >
                            <div className="absolute inset-0 bg-gold-500/10 blur-[100px] rounded-full transform scale-75 animate-pulse" />

                            <div className="relative z-10 w-4/5 h-4/5">
                                <Image
                                    src={product.images[activeImage]}
                                    alt={product.name}
                                    fill
                                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-700"
                                />
                            </div>

                            <div className="absolute top-6 right-6 z-20 flex flex-col gap-4">
                                <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-gold-500 hover:text-chocolate-950 backdrop-blur-md transition-all">
                                    <Heart className="h-6 w-6" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-gold-500 hover:text-chocolate-950 backdrop-blur-md transition-all">
                                    <Share2 className="h-6 w-6" />
                                </Button>
                            </div>
                        </motion.div>

                        <div className="flex justify-center gap-4 py-2 overflow-x-auto">
                            {product.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-24 h-24 rounded-2xl flex-shrink-0 cursor-pointer border-2 transition-all overflow-hidden bg-chocolate-900/50 ${activeImage === idx ? 'border-gold-500 ring-4 ring-gold-500/10 scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                                >
                                    <Image src={img} alt="Thumbnail" fill className="object-contain p-2" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div>
                            <div className="flex items-center gap-2 text-gold-500 mb-4 bg-gold-500/10 w-fit px-3 py-1 rounded-full border border-gold-500/20">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-chocolate-600'}`} />
                                    ))}
                                </div>
                                <span className="text-xs font-bold tracking-wider text-gold-400 uppercase">{product.reviews} Reviews</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">{product.name}</h1>
                            <div className="flex items-baseline gap-4">
                                <p className="text-4xl font-light text-gold-500">₹{product.price.toLocaleString()}</p>
                                <span className="text-chocolate-400 line-through text-lg">₹3,000</span>
                            </div>
                        </div>

                        <div className="prose prose-lg prose-invert text-chocolate-200 leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        {/* Quantity & Add */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <span className="font-serif text-lg text-white">Quantity</span>
                                <div className="flex items-center bg-chocolate-900 rounded-full border border-chocolate-700">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="p-3 hover:text-gold-500 transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-white text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="p-3 hover:text-gold-500 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                className="w-full h-16 text-lg bg-gold-500 text-chocolate-950 hover:bg-white hover:text-chocolate-950 font-bold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1"
                            >
                                Add to Cart - ₹{(product.price * quantity).toLocaleString()}
                            </Button>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-chocolate-300">
                            <div className="flex items-center gap-3 bg-chocolate-900/30 p-4 rounded-xl border border-white/5">
                                <Truck className="h-6 w-6 text-gold-500" />
                                <div>
                                    <span className="block font-bold text-white">Free Shipping</span>
                                    <span className="text-xs">On orders over $50</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-chocolate-900/30 p-4 rounded-xl border border-white/5">
                                <ShieldCheck className="h-6 w-6 text-gold-500" />
                                <div>
                                    <span className="block font-bold text-white">Freshness Guaranteed</span>
                                    <span className="text-xs">Direct from Zurich</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <h3 className="font-serif font-bold text-gold-400 mb-2 uppercase tracking-widest text-sm">Ingredients</h3>
                            <p className="text-sm text-chocolate-400 leading-relaxed">{product.ingredients}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
