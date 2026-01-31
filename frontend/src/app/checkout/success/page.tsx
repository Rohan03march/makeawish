"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-chocolate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-gold-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
                <svg
                    className="w-12 h-12 text-chocolate-950"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                    ></path>
                </svg>
            </div>
            <h1 className="text-4xl font-serif font-bold text-white mb-4">Order Placed Successfully!</h1>
            <p className="text-chocolate-200 text-lg max-w-md mb-8">
                Thank you for your purchase. We have received your order and given you a sweet reference ID: <span className="text-gold-500 font-bold">#ORD-{Math.floor(Math.random() * 10000)}</span>.
            </p>
            <div className="flex gap-4">
                <Link href="/shop">
                    <Button className="bg-gold-500 text-chocolate-950 hover:bg-gold-600 font-bold h-12 px-8">
                        Continue Shopping
                    </Button>
                </Link>
                <Link href="/account/orders">
                    <Button variant="outline" className="border-gold-500 text-gold-500 hover:bg-gold-500/10 font-bold h-12 px-8 bg-transparent">
                        View Order
                    </Button>
                </Link>
            </div>
        </div>
    )
}
