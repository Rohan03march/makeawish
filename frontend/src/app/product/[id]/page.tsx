"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { Minus, Plus, Star, Truck, ShieldCheck, Heart, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { API_URL } from "@/lib/config"

export default function ProductPage() {
    const params = useParams()
    const { addToCart } = useCart()
    const [quantity, setQuantity] = React.useState(1)
    const [activeImage, setActiveImage] = React.useState(0)
    const [product, setProduct] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    const [isFavorite, setIsFavorite] = React.useState(false)

    const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false)

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/${params?.id}`)
                if (res.ok) {
                    const data = await res.json()
                    // Adapter for compatibility with existing UI
                    setProduct({
                        ...data,
                        id: data._id,
                        // Use images array if available and non-empty, otherwise fallback to single image wrapped in array
                        images: (data.images && data.images.length > 0) ? data.images : [data.image || '/images/sample.jpg'],
                        ingredients: data.ingredients || "No ingredients listed."
                    })
                    checkIfFavorite(data._id)
                }
            } catch (error) {
                console.error("Error fetching product", error)
            } finally {
                setLoading(false)
            }
        }

        if (params?.id) {
            fetchProduct()
        }
    }, [params?.id])

    const checkIfFavorite = async (productId: string) => {
        const userInfo = localStorage.getItem('userInfo')
        if (!userInfo) return

        try {
            const { token } = JSON.parse(userInfo)
            const res = await fetch(`${API_URL}/api/auth/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const favorites = await res.json()
                setIsFavorite(favorites.some((fav: any) => fav._id === productId || fav === productId))
            }
        } catch (error) {
            console.error("Error checking favorite status:", error)
        }
    }

    const toggleFavorite = async () => {
        const userInfo = localStorage.getItem('userInfo')
        if (!userInfo) {
            alert("Please login to manage favorites")
            return
        }

        try {
            const { token } = JSON.parse(userInfo)
            const res = await fetch(`${API_URL}/api/auth/favorites/${product.id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                setIsFavorite(!isFavorite)
            }
        } catch (error) {
            console.error("Error toggling favorite:", error)
        }
    }

    const handleAddToCart = () => {
        if (product) {
            addToCart({ ...product, qty: quantity }, quantity)
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-chocolate-950 text-gold-500">Loading...</div>

    if (!product) return <div className="min-h-screen flex items-center justify-center bg-chocolate-950 text-white">Product not found</div>

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
                                {product.images[activeImage].startsWith('http') ? (
                                    <Image
                                        src={product.images[activeImage]}
                                        alt={product.name}
                                        fill
                                        className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <Image
                                        src={product.images[activeImage]}
                                        alt={product.name}
                                        fill
                                        className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-700"
                                    />
                                )}
                            </div>

                            <div className="absolute top-6 right-6 z-20 flex flex-col gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleFavorite}
                                    className={`rounded-full bg-white/10 hover:bg-gold-500 hover:text-chocolate-950 backdrop-blur-md transition-all ${isFavorite ? 'text-red-500 hover:text-red-600' : ''}`}
                                >
                                    <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-gold-500 hover:text-chocolate-950 backdrop-blur-md transition-all">
                                    <Share2 className="h-6 w-6" />
                                </Button>
                            </div>
                        </motion.div>

                        <div className="flex justify-center gap-4 py-2 overflow-x-auto">
                            {product.images.map((img: string, idx: number) => (
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
                            <p className="whitespace-pre-wrap">
                                {isDescriptionExpanded ? product.description : `${product.description.substring(0, 150)}${product.description.length > 150 ? '...' : ''}`}
                            </p>
                            {product.description.length > 150 && (
                                <button
                                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                    className="text-gold-500 hover:text-gold-400 font-bold text-sm mt-2 focus:outline-none"
                                >
                                    {isDescriptionExpanded ? "View Less" : "View More"}
                                </button>
                            )}
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
                                    <span className="text-xs">On orders over ₹1,000</span>
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
                            <p className="text-sm text-chocolate-400 leading-relaxed whitespace-pre-wrap">{product.ingredients}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
