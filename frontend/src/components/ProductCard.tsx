"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Product {
    _id: string
    name: string
    image: string
    description: string
    brand: string
    category: string
    price: number
    countInStock: number
    rating: number
    numReviews: number
    isBestseller?: boolean
    originalPrice?: number
}

interface ProductCardProps {
    product: Product
    isFavorite: boolean
    onToggleFavorite: (e: React.MouseEvent, productId: string) => void
    onAddToCart: (product: any, qty: number) => void
}

export function ProductCard({ product, isFavorite, onToggleFavorite, onAddToCart }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="group h-full"
        >
            {/* V3 Clean Luxury Card */}
            <div className="relative h-full flex flex-col bg-gradient-to-br from-white/10 to-chocolate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gold-500/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] group-hover:-translate-y-1">

                {/* Image Section - Reduced padding on mobile */}
                <div className="relative aspect-square w-full p-4 md:p-6 bg-gradient-to-b from-white/5 to-transparent">
                    <Link href={`/product/${product._id}`} className="absolute inset-0 z-0" />

                    {/* Product Image */}
                    <motion.div
                        className="relative w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                    >
                        {product.image.startsWith('http') || product.image.startsWith('/') ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain drop-shadow-2xl"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">🍫</div>
                        )}
                    </motion.div>

                    {/* Top Actions */}
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
                        <button
                            onClick={(e) => onToggleFavorite(e, product._id)}
                            className={cn(
                                "p-2 md:p-2.5 rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 shadow-lg",
                                isFavorite
                                    ? "text-red-500 bg-red-500/10 border-red-500/20"
                                    : "text-chocolate-200 bg-black/20 hover:text-gold-400 hover:bg-black/40 hover:border-gold-500/30"
                            )}
                        >
                            <Heart className={cn("w-4 h-4 md:w-5 md:h-5", isFavorite && "fill-current")} />
                        </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 z-20 flex flex-col gap-1.5 md:gap-2">
                        {product.isBestseller && (
                            <div className="bg-gradient-to-r from-gold-600 to-gold-400 text-chocolate-950 text-[9px] md:text-[10px] font-bold px-2 py-1 md:px-2.5 rounded-full uppercase tracking-wider shadow-lg shadow-gold-500/20 flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>Bestseller</span>
                            </div>
                        )}
                        {product.countInStock <= 5 && product.countInStock > 0 && (
                            <span className="bg-red-500/90 backdrop-blur-md text-white text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-red-500/20 border border-white/10">
                                Low Stock
                            </span>
                        )}
                    </div>
                </div>

                {/* Content Section - Adjusted padding and text sizes */}
                <div className="p-4 md:p-6 flex-1 flex flex-col gap-2 relative bg-gradient-to-t from-chocolate-950/80 to-transparent">
                    <div className="flex items-center justify-between text-[10px] md:text-xs">
                        <span className="text-gold-400 font-medium tracking-[0.1em] uppercase opacity-90 truncate max-w-[60%]">{product.category}</span>
                        <div className="flex items-center gap-1.5 text-chocolate-200 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                            <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                            <span className="font-medium">{product.rating || 0}</span>
                        </div>
                    </div>

                    <Link href={`/product/${product._id}`} className="group-hover:text-gold-400 transition-colors duration-300 mb-1 md:mb-2">
                        <h3 className="font-serif text-lg md:text-xl font-medium text-white leading-snug line-clamp-2 tracking-wide">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="mt-auto pt-3 md:pt-4 border-t border-white/10 flex items-end justify-between gap-3">
                        <div className="flex flex-col">
                            {(product.originalPrice || 0) > product.price && (
                                <span className="text-[10px] md:text-xs text-chocolate-400 line-through leading-none font-medium">
                                    ₹{(product.originalPrice || 0).toLocaleString()}
                                </span>
                            )}
                            <span className="text-xl md:text-2xl font-serif text-gold-100 leading-none mt-1 group-hover:text-gold-400 transition-colors">
                                ₹{product.price.toLocaleString()}
                            </span>
                        </div>

                        {product.countInStock === 0 ? (
                            <span className="text-[10px] md:text-xs font-bold text-red-400 uppercase tracking-wider mb-2 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                                Sold Out
                            </span>
                        ) : (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onAddToCart({ ...product, qty: 1 }, 1);
                                }}
                                className="bg-white/10 text-white hover:bg-gold-500 hover:text-chocolate-950 transition-all duration-300 rounded-lg px-4 h-10 md:px-5 text-xs md:text-sm font-medium border border-white/10 hover:border-gold-500 shadow-lg shadow-black/20 hover:shadow-gold-500/20"
                            >
                                <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
                                Add to Cart
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
