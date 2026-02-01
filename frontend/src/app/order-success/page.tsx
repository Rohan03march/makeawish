"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag, ArrowRight, Copy } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import toast from "react-hot-toast"
import { API_URL } from "@/lib/config"

export default function OrderSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const orderId = searchParams.get('orderId')
    const paymentId = searchParams.get('paymentId')
    const [mounted, setMounted] = useState(false)
    const [order, setOrder] = useState<any>(null)

    useEffect(() => {
        setMounted(true)
        // Fire confetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 0,
            colors: ['#D4AF37', '#5D4037', '#8B4513', '#FFF8E7', '#C19A6B'] // Gold, Dark Choc, Brown, Cream, Camel
        };

        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // Fetch order details
        const fetchOrder = async () => {
            if (!orderId) return;
            try {
                const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
                if (user?.token) {
                    const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    })
                    if (res.ok) {
                        const data = await res.json()
                        setOrder(data)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch order", error)
            }
        }
        fetchOrder()

        return () => clearInterval(interval)
    }, [orderId])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    if (!mounted) return null

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 bg-[url('/noise.png')] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-gold-500/10 to-transparent rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-chocolate-600/20 to-transparent rounded-full blur-[150px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] text-center space-y-6 relative overflow-hidden shadow-2xl shadow-black/50"
            >
                {/* Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 mb-5 border-4 border-chocolate-950/50"
                    >
                        <CheckCircle className="w-10 h-10 text-white stroke-[3] drop-shadow-md" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-100 to-gold-300 mb-2 tracking-tight"
                    >
                        Order Confirmed
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-chocolate-200 text-sm font-light leading-relaxed max-w-xs mx-auto"
                    >
                        Thank you for your exquisite taste.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3 relative z-10"
                >
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors group cursor-pointer" onClick={() => orderId && copyToClipboard(`ORD-${orderId.slice(-5).toUpperCase()}`)}>
                        <p className="text-[10px] text-chocolate-400 uppercase tracking-widest font-bold">Order id</p>
                        <div className="flex items-center gap-2">
                            <p className="text-base font-mono text-gold-400 font-medium tracking-wide">
                                {orderId ? `ORD-${orderId.slice(-5).toUpperCase()}` : "..."}
                            </p>
                            <Copy className="w-3 h-3 text-chocolate-500 group-hover:text-gold-400 transition-colors" />
                        </div>
                    </div>

                    {(paymentId || order?.paymentResult?.id) && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors group cursor-pointer" onClick={() => copyToClipboard(paymentId || order?.paymentResult?.id)}>
                            <p className="text-[10px] text-chocolate-400 uppercase tracking-widest font-bold">Transaction ID</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-mono text-white/70 tracking-wide truncate max-w-[150px]">{paymentId || order?.paymentResult?.id}</p>
                                <Copy className="w-3 h-3 text-chocolate-500 group-hover:text-gold-400 transition-colors" />
                            </div>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col gap-3 relative z-10 pt-2"
                >
                    <Link href="/account?tab=orders" className="w-full">
                        <Button className="w-full h-12 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-chocolate-950 font-bold rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-gold-500/20 text-sm uppercase tracking-wide">
                            View Order Details
                        </Button>
                    </Link>
                    <Link href="/shop" className="w-full">
                        <Button variant="ghost" className="w-full h-10 text-chocolate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs font-medium tracking-wide">
                            Continue Shopping <ArrowRight className="w-3 h-3 ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}
