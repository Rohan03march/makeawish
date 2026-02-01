"use client"

import { Button } from "@/components/ui/button"
import { XCircle, ArrowRight, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function OrderFailurePage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white/5 backdrop-blur-lg border border-white/10 p-8 md:p-12 rounded-3xl text-center space-y-8 relative overflow-hidden"
            >
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 mb-6"
                    >
                        <XCircle className="w-12 h-12 text-white stroke-[3]" />
                    </motion.div>

                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Order Failed</h1>
                    <p className="text-chocolate-200">We couldn't process your payment. Please try again or use a different payment method.</p>
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                    <Link href="/checkout" className="w-full">
                        <Button className="w-full h-12 bg-gold-500 hover:bg-gold-600 text-chocolate-950 font-bold rounded-xl transition-all hover:scale-[1.02]">
                            <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
                        </Button>
                    </Link>
                    <Link href="/contact" className="w-full">
                        <Button variant="outline" className="w-full h-12 border-white/20 hover:bg-white/10 text-chocolate-100 hover:text-white rounded-xl transition-all">
                            Contact Support
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
