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
            <div className="relative h-full flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-gold-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20">

                {/* Image Section */}
                <div className="relative aspect-square w-fullbg-gradient-to-b from-white/5 to-transparent p-6">
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
                                className="object-contain drop-shadow-xl"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">🍫</div>
                        )}
                    </motion.div>

                    {/* Top Actions */}
                    <div className="absolute top-3 right-3 z-20">
                        <button
                            onClick={(e) => onToggleFavorite(e, product._id)}
                            className={cn(
                                "p-2 rounded-full transition-all duration-300",
                                isFavorite
                                    ? "text-red-500 bg-red-500/10"
                                    : "text-chocolate-200 hover:text-white hover:bg-white/10"
                            )}
                        >
                            <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                        </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                        {product.isBestseller && (
                            <span className="bg-gold-500 text-chocolate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                Bestseller
                            </span>
                        )}
                        {product.countInStock <= 5 && product.countInStock > 0 && (
                            <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                Low Stock
                            </span>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-gold-400 font-medium tracking-wider uppercase opacity-80">{product.category}</span>
                        <div className="flex items-center gap-1 text-chocolate-200">
                            <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                            <span>{product.rating || 0}</span>
                        </div>
                    </div>

                    <Link href={`/product/${product._id}`} className="group-hover:text-gold-400 transition-colors duration-300 mb-3">
                        <h3 className="font-serif text-lg font-medium text-white leading-snug line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xl font-serif text-white">
                            ₹{product.price.toLocaleString()}
                        </span>

                        {product.countInStock === 0 ? (
                            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                                Sold Out
                            </span>
                        ) : (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onAddToCart({ ...product, qty: 1 }, 1)}
                                className="bg-white/10 text-white hover:bg-gold-500 hover:text-chocolate-950 transition-all duration-300 rounded-lg px-4 h-9"
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Add
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
