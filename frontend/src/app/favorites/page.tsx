"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { API_URL } from "@/lib/config"

interface Product {
    _id: string
    name: string
    price: number
    image: string
    images: string[]
    description: string
    rating: number
    countInStock: number
    category: string
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCart()

    useEffect(() => {
        fetchFavorites()
    }, [])

    const fetchFavorites = async () => {
        try {
            const userInfo = localStorage.getItem('userInfo')
            if (!userInfo) {
                setLoading(false)
                return
            }

            const { token } = JSON.parse(userInfo)
            const res = await fetch(`${API_URL}/api/auth/favorites`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json()
            if (res.ok) {
                setFavorites(data)
            }
        } catch (error) {
            console.error("Error fetching favorites:", error)
        } finally {
            setLoading(false)
        }
    }

    const removeFromFavorites = async (id: string) => {
        try {
            const userInfo = localStorage.getItem('userInfo')
            if (!userInfo) return

            const { token } = JSON.parse(userInfo)
            const res = await fetch(`${API_URL}/api/auth/favorites/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.ok) {
                setFavorites(prev => prev.filter(item => item._id !== id))
            }
        } catch (error) {
            console.error("Error removing favorite:", error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1B0F0B] text-white flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#1B0F0B] text-chocolate-50 font-sans selection:bg-gold-500/30">


            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 mb-6 drop-shadow-sm">
                        Your Favorites
                    </h1>
                    <p className="text-chocolate-200 text-lg max-w-2xl mx-auto leading-relaxed">
                        A curated collection of your most loved indulgences.
                    </p>
                </div>

                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm max-w-2xl mx-auto">
                        <div className="w-24 h-24 rounded-full bg-chocolate-900/50 flex items-center justify-center border border-white/5">
                            <Heart className="w-10 h-10 text-chocolate-400 opacity-50" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-serif text-white">No favorites yet</h2>
                            <p className="text-chocolate-300">Heart items as you shop to save them here.</p>
                        </div>
                        <Link href="/shop">
                            <Button className="bg-gradient-to-r from-gold-500 to-gold-600 text-chocolate-950 hover:from-gold-400 hover:to-gold-500 font-bold px-8 py-6 rounded-xl shadow-lg shadow-gold-900/20 text-lg transition-all hover:scale-[1.02]">
                                Browse Collection <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {favorites.map((product) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative bg-[#2A1B15] rounded-xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-square overflow-hidden bg-[#221510]">
                                    <Link href={`/product/${product._id}`}>
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-6 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                    </Link>

                                    <button
                                        onClick={() => removeFromFavorites(product._id)}
                                        className="absolute top-3 right-3 p-2.5 rounded-full bg-black/20 backdrop-blur-md text-red-500 hover:bg-black/40 transition-all duration-300 z-10 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                                        title="Remove from favorites"
                                    >
                                        <Heart className="w-5 h-5 fill-current" />
                                    </button>

                                    {product.countInStock === 0 && (
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-chocolate-950/90 backdrop-blur-md text-white/90 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10 shadow-lg">
                                            Sold Out
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1 bg-white/[0.02] backdrop-blur-sm">
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[10px] font-bold text-gold-500/80 uppercase tracking-[0.2em]">{product.category}</p>
                                            <div className="flex items-center gap-1">
                                                <svg
                                                    className="w-3 h-3 text-gold-500 fill-current"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                                <span className="text-xs font-medium text-chocolate-200">{product.rating}</span>
                                            </div>
                                        </div>

                                        <Link href={`/product/${product._id}`}>
                                            <h3 className="font-serif text-lg font-medium text-white group-hover:text-gold-400 transition-colors leading-snug line-clamp-2 min-h-[3rem]">
                                                {product.name}
                                            </h3>
                                        </Link>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-chocolate-400 mb-0.5">Price</span>
                                            <span className="font-serif text-xl font-medium text-white">₹{product.price.toLocaleString()}</span>
                                        </div>
                                        <Button
                                            onClick={() => addToCart({ ...product, qty: 1 }, 1)}
                                            disabled={product.countInStock === 0}
                                            variant="ghost"
                                            className="h-10 w-10 p-0 rounded-full bg-gold-500 text-chocolate-950 hover:bg-white hover:text-chocolate-950 transition-all shadow-lg shadow-gold-900/10 hover:shadow-gold-500/20 disabled:opacity-50 disabled:hover:bg-gold-500 disabled:hover:text-chocolate-950"
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>


        </div>
    )
}
