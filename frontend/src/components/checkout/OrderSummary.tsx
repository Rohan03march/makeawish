"use client"

import { useCart } from "@/context/CartContext"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"

export function OrderSummary() {
    const { items, cartTotal, updateQuantity, removeItem } = useCart()
    const shipping: number = 0 // Explicit type
    const total = cartTotal + shipping

    if (items.length === 0) {
        return (
            <div className="bg-chocolate-900/50 p-6 rounded-lg border border-white/10">
                <p className="text-chocolate-200">Your cart is empty.</p>
            </div>
        )
    }

    return (
        <div className="bg-chocolate-900/50 p-6 rounded-lg border border-white/10 space-y-6">
            <h2 className="text-xl font-serif font-bold text-white">Order Summary</h2>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                        <div className="h-20 w-20 relative shrink-0 rounded-md bg-chocolate-800 flex items-center justify-center text-2xl border border-white/5 overflow-hidden">
                            {/* Fallback to emoji if no image url or just text */}
                            {item.image.startsWith('http') || item.image.startsWith('/') ? (
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            ) : (
                                <span>{item.image}</span>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="text-sm font-medium text-white line-clamp-2 pr-2">{item.name}</h3>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-chocolate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    aria-label="Remove item"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex justify-between items-end mt-2">
                                <div className="flex items-center gap-2 bg-chocolate-950/50 rounded-lg p-1 border border-white/10">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 rounded hover:bg-white/10 text-chocolate-200 hover:text-white transition-colors"
                                        type="button"
                                    >
                                        <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="text-xs w-4 text-center text-white font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 rounded hover:bg-white/10 text-chocolate-200 hover:text-white transition-colors"
                                        type="button"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>
                                <p className="text-sm text-gold-400 font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-px bg-white/10 my-4" />

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-chocolate-200">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-chocolate-200">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}</span>
                </div>
            </div>

            <div className="h-px bg-white/10 my-4" />

            <div className="flex justify-between items-center text-lg font-bold text-white">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
            </div>
        </div>
    )
}
