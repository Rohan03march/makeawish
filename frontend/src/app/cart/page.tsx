"use client"

import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react"

export default function CartPage() {
    const { cartItems, removeFromCart, updateQty, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart()
    const router = useRouter()

    const checkoutHandler = () => {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
        if (!user.token) {
            router.push('/login?redirect=checkout')
        } else {
            router.push('/checkout')
        }
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-chocolate-800/20 rounded-full flex items-center justify-center mb-6">
                    <Trash2 className="w-10 h-10 text-chocolate-400" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Your Cart is Empty</h1>
                <p className="text-chocolate-300 mb-8 max-w-md">Looks like you haven't added any sweets to your cart yet.</p>
                <button
                    onClick={() => router.push('/shop')}
                    className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-chocolate-950 font-bold rounded-lg hover:shadow-lg hover:shadow-gold-500/20 transition-all"
                >
                    Start Shopping
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-serif font-bold text-white mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex gap-6 p-6 bg-chocolate-900/40 border border-white/5 rounded-2xl hover:border-gold-500/20 transition-all group">
                            <div className="relative w-24 h-24 bg-chocolate-800 rounded-xl overflow-hidden flex-shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gold-400 transition-colors">{item.name}</h3>
                                        <p className="text-chocolate-400 text-sm">₹{item.price}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="p-2 hover:bg-red-500/10 text-chocolate-400 hover:text-red-400 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 bg-chocolate-950/50 rounded-lg p-1 border border-white/5">
                                        <button
                                            onClick={() => updateQty(item._id, item.qty - 1)}
                                            disabled={item.qty <= 1}
                                            className="p-1 hover:bg-white/10 rounded disabled:opacity-50 text-white"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-white font-mono w-4 text-center">{item.qty}</span>
                                        <button
                                            onClick={() => updateQty(item._id, item.qty + 1)}
                                            disabled={item.qty >= item.countInStock}
                                            className="p-1 hover:bg-white/10 rounded disabled:opacity-50 text-white"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="ml-auto">
                                        <p className="text-lg font-bold text-gold-400">₹{(item.price * item.qty).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-chocolate-900/60 border border-white/10 rounded-2xl p-8 sticky top-24">
                        <h2 className="text-2xl font-serif font-bold text-white mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-chocolate-300">
                                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                <span className="text-white">₹{itemsPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-chocolate-300">
                                <span>Shipping</span>
                                <span className="text-white">{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span>
                            </div>
                            <div className="flex justify-between text-chocolate-300">
                                <span>Tax (18%)</span>
                                <span className="text-white">₹{taxPrice.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-white/10 pt-4 mt-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-white">Total</span>
                                    <span className="text-2xl font-serif font-bold text-gold-400">₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-chocolate-400 mt-1 text-right">Includes all taxes</p>
                            </div>
                        </div>

                        <button
                            onClick={checkoutHandler}
                            className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-chocolate-950 font-bold rounded-xl hover:shadow-lg hover:shadow-gold-500/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            Proceed to Checkout
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
