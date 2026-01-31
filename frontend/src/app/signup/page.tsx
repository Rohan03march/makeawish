"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

export default function SignupPage() {
    const { register, handleSubmit } = useForm()

    const onSubmit = (data: any) => {
        console.log(data)
        window.location.href = '/'
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Form */}
            <div className="flex items-center justify-center p-8 bg-chocolate-50 relative order-2 lg:order-1">
                <Link href="/" className="absolute top-8 left-8 text-chocolate-600 hover:text-gold-600 flex items-center gap-2 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center">
                        <h1 className="text-4xl font-serif font-bold text-chocolate-950 mb-2">Join the Club</h1>
                        <p className="text-chocolate-500">Create an account to unlock exclusive benefits.</p>
                    </div>

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
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-chocolate-900">Password</label>
                            <Input
                                {...register("password")}
                                type="password"
                                className="h-12 bg-white border-chocolate-200 text-chocolate-900 focus-visible:ring-gold-500"
                                placeholder="Create a strong password"
                            />
                        </div>

                        <Button className="w-full h-12 bg-chocolate-900 text-white hover:bg-gold-500 hover:text-chocolate-950 font-bold transition-all shadow-lg text-lg">
                            Create Account
                        </Button>

                        <div className="text-center text-sm text-chocolate-500 pt-4">
                            Already a member? <Link href="/login" className="text-gold-600 hover:text-chocolate-900 font-bold transition-colors">Sign In</Link>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Right: Image */}
            <div className="relative hidden lg:block h-full w-full overflow-hidden bg-chocolate-950 order-1 lg:order-2">
                <div className="absolute inset-0 bg-gold-600/10 mix-blend-overlay z-10" />
                <Image
                    src="/milk-swirl.png"
                    alt="Artisan Process"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-[20s]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 via-transparent to-transparent z-20" />
                <div className="absolute bottom-20 right-12 z-30 max-w-md text-right">
                    <h2 className="text-5xl font-serif text-white font-bold mb-4">Handcrafted Perfection.</h2>
                    <p className="text-xl text-chocolate-100 font-light">
                        Join over 10,000 connoisseurs who have discovered the art of fine chocolate.
                    </p>
                </div>
            </div>
        </div>
    )
}
