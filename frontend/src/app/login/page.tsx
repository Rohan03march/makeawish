"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

import { useRouter } from "next/navigation"
import * as React from "react"
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { API_URL } from "@/lib/config"

export default function LoginPage() {
    const { register, handleSubmit } = useForm()

    const [error, setError] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const router = useRouter()

    const onSubmit = async (data: any) => {
        setIsLoading(true)
        setError("")
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            const result = await res.json()

            if (!res.ok) throw new Error(result.message || 'Login failed')

            // Store Auth Data
            localStorage.setItem('userInfo', JSON.stringify(result))

            // Redirect based on role
            // Since we only allow login if approved, we can assume access is granted.
            if (result.isAdmin) {
                window.location.href = '/admin/dashboard' // Corrected redirect for admin
            } else {
                window.location.href = '/shop'
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Image */}
            <div className="relative hidden lg:block h-full w-full overflow-hidden bg-chocolate-950">
                <div className="absolute inset-0 bg-gold-400/20 mix-blend-overlay z-10" />
                <Image
                    src="/dark-truffle.png"
                    alt="Luxury Chocolate"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-[20s]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 via-transparent to-transparent z-20" />
                <div className="absolute bottom-20 left-12 z-30 max-w-md">
                    <h2 className="text-5xl font-serif text-white font-bold mb-4">Pure Indulgence.</h2>
                    <p className="text-xl text-chocolate-100 font-light">
                        "The only true currency in this bankrupt world is what you share with someone else when you're uncool."
                    </p>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center p-8 bg-chocolate-50 relative">
                <Link href="/" className="absolute top-8 left-8 text-chocolate-600 hover:text-gold-600 flex items-center gap-2 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center">
                        <h1 className="text-4xl font-serif font-bold text-chocolate-950 mb-2">Welcome Back</h1>
                        <p className="text-chocolate-500">Sign in to access your curated collection.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-chocolate-900">Email Address</label>
                            <Input
                                {...register("email")}
                                type="email"
                                className="h-12 bg-white border-chocolate-200 text-chocolate-900 focus-visible:ring-gold-500"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-chocolate-900">Password</label>
                                <Link href="#" className="text-xs text-gold-600 hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    className="h-12 bg-white border-chocolate-200 text-chocolate-900 focus-visible:ring-gold-500 pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate-400 hover:text-chocolate-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <Eye className="h-5 w-5" />
                                    ) : (
                                        <EyeOff className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button disabled={isLoading} className="w-full h-12 bg-chocolate-900 text-white hover:bg-gold-500 hover:text-chocolate-950 font-bold transition-all shadow-lg text-lg">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                        </Button>

                        <div className="text-center text-sm text-chocolate-500 pt-4">
                            Don't have an account? <Link href="/signup" className="text-gold-600 hover:text-chocolate-900 font-bold transition-colors">Apply for Membership</Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
