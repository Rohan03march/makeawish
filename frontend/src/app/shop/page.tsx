"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ProductCard } from "@/components/ProductCard" // Import ProductCard
import { useCart } from "@/context/CartContext"
import Image from "next/image"
import { API_URL } from "@/lib/config"

// Mock Data removed
// Real data fetching logic will be added inside the component


export default function ShopPage() {
    const [products, setProducts] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const { addToCart } = useCart() // Updated to addToCart to match context
    const [selectedCategory, setSelectedCategory] = React.useState("All")
    const [sortOption, setSortOption] = React.useState("featured")

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

    const filteredProducts = React.useMemo(() => {
        let result = selectedCategory === "All"
            ? [...products]
            : products.filter(p => p.category === selectedCategory || (selectedCategory === "Gifts" && p.category === "Gifts"))

        switch (sortOption) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price)
                break
            case "price-desc":
                result.sort((a, b) => b.price - a.price)
                break
            case "newest":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
            case "featured":
            default:
                // Featured could be bestseller first, or just default order
                result.sort((a, b) => (b.isBestseller === a.isBestseller) ? 0 : b.isBestseller ? 1 : -1)
                break
        }
        return result
    }, [products, selectedCategory, sortOption])

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

                <div className="flex flex-col gap-8">
                    {isLoading && (
                        <div className="w-full flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {!isLoading && (
                        <>

                            {/* Filter & Sort Toolbar */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-chocolate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                {/* Categories */}
                                <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 no-scrollbar mask-gradient-right px-1">
                                    {['All', 'Chocolates', 'Bars', 'Gifts', 'Seasonal'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap mb-1 ${selectedCategory === cat
                                                ? 'bg-gold-500 text-chocolate-950 font-bold scale-105'
                                                : 'bg-chocolate-800/30 text-chocolate-200 border border-white/10 hover:border-gold-500/50 hover:text-white hover:bg-chocolate-800/80'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Sort By */}
                                <div className="flex items-center gap-3 w-full md:w-auto min-w-[200px]">
                                    <span className="text-sm text-chocolate-300 whitespace-nowrap hidden md:inline">Sort by:</span>
                                    <Select value={sortOption} onValueChange={setSortOption}>
                                        <SelectTrigger className="w-full md:w-[180px] bg-chocolate-800/50 border-white/10 text-white focus:ring-gold-500/50">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-chocolate-900 border-white/10 text-white">
                                            <SelectItem value="featured" className="focus:bg-gold-500 focus:text-chocolate-950 cursor-pointer">Featured</SelectItem>
                                            <SelectItem value="price-asc" className="focus:bg-gold-500 focus:text-chocolate-950 cursor-pointer">Price: Low to High</SelectItem>
                                            <SelectItem value="price-desc" className="focus:bg-gold-500 focus:text-chocolate-950 cursor-pointer">Price: High to Low</SelectItem>
                                            <SelectItem value="newest" className="focus:bg-gold-500 focus:text-chocolate-950 cursor-pointer">Newest Arrivals</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Product Grid */}
                            <div className="flex-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                                    {filteredProducts.map((product) => (
                                        <div key={product._id} className="h-full">
                                            <ProductCard
                                                product={product}
                                                isFavorite={favoriteIds.includes(product._id)}
                                                onToggleFavorite={toggleFavorite}
                                                onAddToCart={addToCart}
                                            />
                                        </div>
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
