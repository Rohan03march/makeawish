"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react"
import * as React from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/config"

export default function AdminSignupPage() {
    const { register, handleSubmit } = useForm()
    const [showPassword, setShowPassword] = React.useState(false)

    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const onSubmit = async (data: any) => {
        setIsLoading(true)
        setError("")
        const fullName = `${data.firstName} ${data.lastName}`

        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fullName,
                    email: data.email,
                    password: data.password,
                    isAdminRequest: true
                })
            })
            const result = await res.json()

            if (!res.ok) throw new Error(result.message || 'Registration failed')

            // Success state
            setSuccess(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
                <div className="hidden lg:block bg-chocolate-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gold-400/10 mix-blend-overlay z-10" />
                    <Image src="/dark-truffle.png" alt="Admin" fill className="object-cover grayscale-[30%]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 via-chocolate-950/50 to-transparent z-20" />
                </div>
                <div className="flex items-center justify-center p-8 bg-chocolate-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-md w-full text-center space-y-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-chocolate-950">Request Submitted</h1>
                        <p className="text-chocolate-600 leading-relaxed">
                            Your request for admin access has been securely transmitted. A Super Admin will review your credentials and approve your access shortly.
                        </p>
                        <div className="pt-6">
                            <Link href="/admin">
                                <Button className="w-full h-12 bg-chocolate-900 text-white hover:bg-gold-500 hover:text-chocolate-950 font-bold transition-all">
                                    Return to Login
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Image (Reusing Admin Style) */}
            <div className="relative hidden lg:block h-full w-full overflow-hidden bg-chocolate-950">
                <div className="absolute inset-0 bg-gold-400/10 mix-blend-overlay z-10" />
                <Image
                    src="/dark-truffle.png"
                    alt="Luxury Chocolate"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-[20s] grayscale-[30%]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 via-chocolate-950/50 to-transparent z-20" />
                <div className="absolute bottom-20 left-12 z-30 max-w-md">
                    <div className="flex items-center gap-3 mb-4 text-gold-400">
                        <ShieldCheck className="w-8 h-8" />
                        <span className="text-sm font-bold tracking-widest uppercase">Admin Portal</span>
                    </div>
                    <h2 className="text-5xl font-serif text-white font-bold mb-4">Join the Leadership.</h2>
                    <p className="text-xl text-chocolate-100 font-light">
                        Apply for administrative access and manage the platform.
                    </p>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center p-8 bg-chocolate-50 relative">
                <Link href="/admin" className="absolute top-8 left-8 text-chocolate-600 hover:text-gold-600 flex items-center gap-2 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center">
                        <h1 className="text-4xl font-serif font-bold text-chocolate-950 mb-2">Request Access</h1>
                        <p className="text-chocolate-500">Submit your details for admin approval.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-chocolate-900">First Name</label>
                                <Input {...register("firstName")} className="h-12 bg-white border-chocolate-200 text-chocolate-900 focus-visible:ring-gold-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-chocolate-900">Last Name</label>
                                <Input {...register("lastName")} className="h-12 bg-white border-chocolate-200 text-chocolate-900 focus-visible:ring-gold-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-chocolate-900">Email Address</label>
                            <Input
                                {...register("email")}
                                type="email"
                                className="h-12 bg-white border-chocolate-200 text-chocolate-900 focus-visible:ring-gold-500"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-chocolate-900">Password</label>
                            <div className="relative">
                                <Input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    className="h-12 bg-white border-chocolate-200 text-chocolate-900 focus-visible:ring-gold-500 pr-10"
                                    placeholder="Create a strong password"
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
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Request"}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
