"use client"

import * as React from "react"
import { useCart } from "@/context/CartContext"
import { API_URL } from "@/lib/config"
import { ProductSwimlane } from "@/components/Shop/ProductSwimlane"
import { ProductCard } from "@/components/ProductCard"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"

export default function ShopPage() {
    const [products, setProducts] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const { addToCart } = useCart()
    const [favoriteIds, setFavoriteIds] = React.useState<string[]>([])
    const [activeSection, setActiveSection] = React.useState("Overview")

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
        e.preventDefault()
        e.stopPropagation()

        const userInfo = localStorage.getItem('userInfo')
        if (!userInfo) {
            toast.error("Please login to manage favorites")
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
                toast.success(favoriteIds.includes(productId) ? "Removed from favorites" : "Added to favorites")
            }
        } catch (error) {
            console.error("Error toggling favorite:", error)
        }
    }

    const sections = React.useMemo(() => {
        if (!products.length) return []

        const bestsellers = products.filter(p => p.isBestseller)
        const newArrivals = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20)

        // Group remaining by category
        const categories = Array.from(new Set(products.map(p => p.category)))
        const categorySections = categories.map(cat => ({
            id: cat,
            title: cat,
            products: products.filter(p => p.category === cat)
        }))

        return [
            { id: "Bestsellers", title: "Bestsellers", products: bestsellers },
            { id: "New Arrivals", title: "New Arrivals", products: newArrivals },
            ...categorySections
        ].filter(section => section.products.length > 0)
    }, [products])

    const scrollToSection = (id: string) => {
        setActiveSection(id)
        if (id === "Overview") {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    // Filter products based on active section for the grid view
    const displayedProducts = React.useMemo(() => {
        if (activeSection === "Overview") return []
        const section = sections.find(s => s.id === activeSection)
        return section ? section.products : []
    }, [activeSection, sections])

    return (
        <div className="min-h-screen bg-chocolate-950">
            {/* Header */}
            <div className="relative pt-24 pb-12 px-4 md:px-6 bg-gradient-to-b from-chocolate-900 to-chocolate-950">
                <div className="container mx-auto text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2">Our Collection</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto" />
                    <p className="text-chocolate-200 text-lg max-w-2xl mx-auto">
                        Discover our curated selection of fine chocolates and gifts.
                    </p>
                </div>
            </div>

            {/* Sticky Navigation */}
            <div className="sticky top-[72px] z-40 bg-chocolate-950/95 backdrop-blur-md border-b border-white/5 py-4 shadow-lg mb-4">
                <div className="container mx-auto px-4 md:px-6 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => scrollToSection("Overview")}
                            className={cn(
                                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                                activeSection === "Overview"
                                    ? "bg-gold-500 text-chocolate-950 font-bold shadow-gold-500/20 shadow-lg"
                                    : "bg-white/5 text-chocolate-200 hover:bg-white/10 hover:text-white border border-white/5"
                            )}
                        >
                            Overview
                        </button>
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                                    activeSection === section.id
                                        ? "bg-gold-500 text-chocolate-950 font-bold shadow-gold-500/20 shadow-lg"
                                        : "bg-white/5 text-chocolate-200 hover:bg-white/10 hover:text-white border border-white/5"
                                )}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto pb-20 space-y-4 px-4 md:px-6">
                {isLoading ? (
                    <div className="w-full flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    activeSection === "Overview" ? (
                        // Overview Mode: Swimlanes
                        sections.map((section) => (
                            <ProductSwimlane
                                key={section.id}
                                id={section.id}
                                title={section.title}
                                products={section.products}
                                favoriteIds={favoriteIds}
                                onToggleFavorite={toggleFavorite}
                                onAddToCart={addToCart}
                                onViewAll={section.products.length > 10 ? () => scrollToSection(section.id) : undefined}
                            />
                        ))
                    ) : (
                        // Category Grid View
                        <div className="animate-fade-in-up">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">{activeSection}</h2>
                                <span className="text-chocolate-300">{displayedProducts.length} Products</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {displayedProducts.map(product => (
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
                    )
                )}
            </div>
        </div>
    )
}
