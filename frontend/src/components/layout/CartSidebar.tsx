"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

export function CartSidebar() {
    const { isCartOpen, setIsCartOpen, cartItems, updateQty, removeFromCart, totalPrice } = useCart()

    React.useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isCartOpen])

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#1B0F0B] border-l border-white/10 z-[100] flex flex-col shadow-2xl"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-chocolate-900/50">
                            <h2 className="text-2xl font-serif font-bold text-white flex items-center">
                                <ShoppingBag className="mr-3 h-6 w-6 text-gold-500" />
                                Your Cart
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="text-chocolate-200 hover:text-white hover:bg-white/5 rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-24 h-24 rounded-full bg-chocolate-900/50 flex items-center justify-center">
                                        <ShoppingBag className="h-10 w-10 text-chocolate-400 opacity-50" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-white text-xl font-serif font-medium">Your cart is empty</p>
                                        <p className="text-chocolate-300">Looks like you haven't added any sweets yet.</p>
                                    </div>
                                    <Button onClick={() => setIsCartOpen(false)} className="bg-gold-500 text-chocolate-950 hover:bg-gold-600 font-semibold px-8 h-12 rounded-full">
                                        Start Shopping
                                    </Button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item._id} className="group flex gap-4 bg-chocolate-900/40 p-3 rounded-xl border border-white/5 hover:border-gold-500/30 transition-colors">
                                        <div className="h-24 w-24 relative shrink-0 rounded-lg bg-chocolate-800 flex items-center justify-center text-3xl border border-white/5 overflow-hidden">
                                            {item.image.startsWith('http') || item.image.startsWith('/') ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <span>{item.image}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-medium text-white line-clamp-2 leading-tight">{item.name}</h3>
                                                    <button onClick={() => removeFromCart(item._id)} className="text-chocolate-400 hover:text-red-400 transition-colors p-1 -mr-2 -mt-2">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <p className="text-gold-400 font-bold">₹{item.price.toLocaleString()}</p>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center gap-3 bg-chocolate-950/50 rounded-lg p-1 border border-white/10">
                                                    <button
                                                        onClick={() => updateQty(item._id, item.qty - 1)}
                                                        className="p-1.5 rounded-md hover:bg-white/10 text-chocolate-200 hover:text-white transition-colors"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-sm w-4 text-center text-white font-medium">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateQty(item._id, item.qty + 1)}
                                                        className="p-1.5 rounded-md hover:bg-white/10 text-chocolate-200 hover:text-white transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-white/10 space-y-4 bg-chocolate-900/80 backdrop-blur-lg">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-chocolate-200 text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-2xl font-serif font-bold text-white">
                                        <span>Total</span>
                                        <span>₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-chocolate-400 text-center pt-2">Shipping & taxes calculated at checkout</p>
                                </div>
                                <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="block">
                                    <Button className="w-full h-14 text-lg bg-gradient-to-r from-gold-500 to-gold-600 text-chocolate-950 hover:from-gold-400 hover:to-gold-500 font-bold shadow-lg shadow-gold-900/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
