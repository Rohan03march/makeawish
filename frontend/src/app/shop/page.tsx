"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ChevronDown, Star, Heart, X } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import Image from "next/image"
import { API_URL } from "@/lib/config"

// Mock Data removed
// Real data fetching logic will be added inside the component


export default function ShopPage() {
    const [products, setProducts] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const { addToCart } = useCart() // Updated to addToCart to match context
    const [selectedCategory, setSelectedCategory] = React.useState("All")
    const [isDesktop, setIsDesktop] = React.useState(true)

    const [favoriteIds, setFavoriteIds] = React.useState<string[]>([])

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`)
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data)
                }
            } catch (error) {
                console.error("Failed to fetch products", error)
            } finally {
                setIsLoading(false)
            }
        }

        const fetchFavorites = async () => {
            const userInfo = localStorage.getItem('userInfo')
            if (!userInfo) return

            try {
                const { token } = JSON.parse(userInfo)
                const res = await fetch(`${API_URL}/api/auth/favorites`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    // Store only IDs
                    setFavoriteIds(data.map((item: any) => item._id || item))
                }
            } catch (error) {
                console.error("Failed to fetch favorites", error)
            }
        }

        fetchProducts()
        fetchFavorites()

        const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const toggleFavorite = async (e: React.MouseEvent, productId: string) => {
        e.preventDefault() // Prevent navigation
        e.stopPropagation()

        const userInfo = localStorage.getItem('userInfo')
        if (!userInfo) {
            alert("Please login to manage favorites")
            return
        }

        try {
            const { token } = JSON.parse(userInfo)
            const res = await fetch(`${API_URL}/api/auth/favorites/${productId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                setFavoriteIds(prev =>
                    prev.includes(productId)
                        ? prev.filter(id => id !== productId)
                        : [...prev, productId]
                )
            }
        } catch (error) {
            console.error("Error toggling favorite:", error)
        }
    }

    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(p => p.category === selectedCategory || (selectedCategory === "Gifts" && p.category === "Gifts"))

    return (
        <div className="min-h-screen bg-chocolate-950/95">
            <div className="container mx-auto px-4 md:px-6 py-12">
                {/* Page Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-2">Our Collection</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto" />
                    <p className="text-chocolate-200 text-lg max-w-2xl mx-auto">
                        Explore our range of award-winning chocolates, handcrafted with passion and precision.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {isLoading && (
                        <div className="w-full flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {!isLoading && (
                        <>

                            {/* Mobile Filter Toggle */}
                            <div className="lg:hidden mb-6">
                                <Button onClick={() => setIsFilterOpen(!isFilterOpen)} variant="outline" className="w-full border-chocolate-700 text-chocolate-100 flex justify-between h-12">
                                    <span className="flex items-center"><Filter className="mr-2 h-4 w-4" /> Filter & Sort</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                                </Button>
                            </div>

                            {/* Sidebar Filters */}
                            <AnimatePresence>
                                {(isFilterOpen || isDesktop) && (
                                    <motion.aside
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`w-full lg:w-72 space-y-8 lg:block overflow-hidden lg:overflow-visible`}
                                    >
                                        <div className="glass p-6 rounded-xl border border-white/5 space-y-8">
                                            <div>
                                                <h3 className="text-xl font-serif font-bold text-gold-400 mb-6">Categories</h3>
                                                <div className="space-y-3">
                                                    {['All', 'Dark', 'Milk', 'White', 'Fruit', 'Gifts'].map((cat) => (
                                                        <div
                                                            key={cat}
                                                            className="flex items-center group cursor-pointer"
                                                            onClick={() => setSelectedCategory(cat)}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border border-gold-500 mr-3 flex items-center justify-center transition-all ${selectedCategory === cat ? 'bg-gold-500' : 'bg-transparent'}`}>
                                                                {selectedCategory === cat && <div className="w-2 h-2 rounded-full bg-chocolate-950" />}
                                                            </div>
                                                            <span className={`text-sm transition-colors ${selectedCategory === cat ? 'text-white font-bold' : 'text-chocolate-200 group-hover:text-gold-400'}`}>{cat}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-serif font-bold text-gold-400 mb-6">Price Range</h3>
                                                <div className="space-y-4">
                                                    <input type="range" min="0" max="15000" className="w-full accent-gold-500 h-1 bg-chocolate-700 rounded-lg appearance-none cursor-pointer" />
                                                    <div className="flex justify-between text-xs text-chocolate-300 font-mono">
                                                        <span>₹0</span>
                                                        <span>₹15,000+</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.aside>
                                )}
                            </AnimatePresence>

                            {/* Product Grid */}
                            <div className="flex-1">
                                {/* Sort Bar (Desktop) */}
                                <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                    <span className="text-chocolate-300">{filteredProducts.length} Products Found</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-chocolate-300">Sort by:</span>
                                        <select className="bg-transparent border border-chocolate-700 text-white text-sm rounded-md px-4 py-2 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none">
                                            <option className="bg-chocolate-900">Featured</option>
                                            <option className="bg-chocolate-900">Price: Low to High</option>
                                            <option className="bg-chocolate-900">Price: High to Low</option>
                                            <option className="bg-chocolate-900">Newest Arrivals</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredProducts.map((product) => (
                                        <motion.div
                                            key={product._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -8 }}
                                            transition={{ duration: 0.3 }}
                                            className="group"
                                        >
                                            <Card className="bg-chocolate-900/40 border-white/5 text-white overflow-hidden backdrop-blur-sm h-full flex flex-col hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:border-gold-500/30 transition-all duration-500">
                                                <div className="relative aspect-square p-8 flex items-center justify-center bg-gradient-to-b from-white/5 to-transparent group-hover:from-white/10 transition-colors duration-500">
                                                    <Link href={`/product/${product._id}`} className="absolute inset-0 z-0" />

                                                    <motion.div
                                                        className="relative w-full h-full"
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        {product.image.startsWith('http') || product.image.startsWith('/') ? (
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                fill
                                                                className="object-contain drop-shadow-2xl"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-6xl">🍫</div>
                                                        )}

                                                    </motion.div>

                                                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <Button
                                                            size="icon"
                                                            variant="secondary"
                                                            className={`rounded-full bg-white/10 hover:bg-gold-500 hover:text-chocolate-950 text-white backdrop-blur-md ${favoriteIds.includes(product._id) ? 'text-red-500 hover:text-red-600' : ''}`}
                                                            onClick={(e) => toggleFavorite(e, product._id)}
                                                        >
                                                            <Heart className={`h-5 w-5 ${favoriteIds.includes(product._id) ? 'fill-current' : ''}`} />
                                                        </Button>
                                                    </div>

                                                    {(product.rating || 0) >= 4.9 && (
                                                        <div className="absolute top-4 left-4 z-10">
                                                            <span className="bg-gold-500 text-chocolate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Bestseller</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <CardContent className="p-6 flex-1 flex flex-col relative z-20 bg-chocolate-900/60">
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <div className="flex text-gold-400 gap-1">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            <span className="text-xs font-bold pt-0.5">{product.rating || 0}</span>

                                                        </div>
                                                        <span className="text-xs text-chocolate-400">{product.category}</span>
                                                    </div>

                                                    <Link href={`/product/${product._id}`} className="group-hover:text-gold-400 transition-colors">
                                                        <h3 className="text-xl font-bold font-serif mb-2 leading-tight">{product.name}</h3>
                                                    </Link>

                                                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                                                        <span className="text-2xl font-bold text-white font-serif">₹{product.price.toLocaleString()}</span>
                                                        <Button
                                                            size="sm"
                                                            disabled={product.countInStock === 0}
                                                            className="bg-gold-500 text-chocolate-950 hover:bg-white hover:text-chocolate-950 rounded-full px-6 font-bold shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() => addToCart({ ...product, qty: 1 }, 1)}
                                                        >
                                                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}


                </div >
            </div >
        </div >
    )
}
