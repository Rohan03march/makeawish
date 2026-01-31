"use client"

import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CheckoutPage() {
    const { items, isCartOpen, setIsCartOpen } = useCart()
    const router = useRouter()

    // Close cart sidebar if open when entering checkout
    useEffect(() => {
        if (isCartOpen) {
            setIsCartOpen(false)
        }
    }, [isCartOpen, setIsCartOpen])

    // Redirect to shop if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            // We allow viewing the page even if empty to show the empty state message in OrderSummary, 
            // or we could redirect. Let's redirect for better UX if they hit /checkout directly.
            // But OrderSummary handles empty state nicely. Let's keep it.
        }
    }, [items, router])

    return (
        <div className="min-h-screen bg-chocolate-950/20 bg-[url('/pattern-dark.png')] bg-fixed">
            {/* Professional Checkout Header */}
            <header className="sticky top-0 z-40 bg-chocolate-950/95 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Brand/Logo Area */}
                        <div className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                            Make A Wish
                        </div>
                        <div className="h-6 w-px bg-white/20 mx-2" />
                        <div className="flex items-center gap-2 text-gold-100/80">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            <span className="text-sm font-medium tracking-wide uppercase">Secure Checkout</span>
                        </div>
                    </div>

                    {/* Progress Steps (Desktop) */}
                    <div className="hidden md:flex items-center gap-4 text-sm font-medium">
                        <div className="flex items-center gap-2 text-green-500">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <span>Cart</span>
                        </div>
                        <div className="w-8 h-px bg-white/10" />
                        <div className="flex items-center gap-2 text-gold-500">
                            <div className="w-6 h-6 rounded-full bg-gold-500 text-chocolate-950 flex items-center justify-center font-bold">
                                2
                            </div>
                            <span>Details & Payment</span>
                        </div>
                        <div className="w-8 h-px bg-white/10" />
                        <div className="flex items-center gap-2 text-white/30">
                            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center">
                                3
                            </div>
                            <span>Confirmation</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    {/* Main Form Area */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-chocolate-900/40 p-1 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm">
                            <div className="bg-chocolate-950/50 rounded-xl p-6 sm:p-8">
                                <div className="mb-8 border-b border-white/10 pb-6">
                                    <h1 className="text-3xl font-serif font-bold text-white">Shipping & Payment</h1>
                                    <p className="text-chocolate-200 mt-2">Please enter your details to complete your order.</p>
                                </div>
                                <CheckoutForm />
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 opacity-60">
                            <div className="flex flex-col items-center gap-2 text-center p-4">
                                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className="text-xs text-chocolate-200">Official Product</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center p-4">
                                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                <span className="text-xs text-chocolate-200">Secure Payment</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center p-4">
                                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-xs text-chocolate-200">Quality Guarantee</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Order Summary */}
                    <div className="lg:col-span-4 sticky top-28 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-md">
                            <OrderSummary />
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-chocolate-300">
                                Need help? <a href="#" className="text-gold-400 hover:text-gold-300 underline">Contact Support</a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
