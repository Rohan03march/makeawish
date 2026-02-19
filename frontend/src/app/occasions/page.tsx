"use client"

import * as React from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Cake, Heart, Briefcase, PartyPopper, Calendar, Star, Sparkles, Gift } from "lucide-react"

const OCCASIONS = [
    {
        id: "birthday",
        title: "Birthdays",
        description: "Make their special day unforgettable with our signature truffle collections.",
        icon: Cake,
        color: "from-pink-500 to-rose-600",
        image: "/occasion-birthday.jpg",
        link: "/shop?category=Birthday"
    },
    {
        id: "anniversary",
        title: "Anniversaries",
        description: "Celebrate your love story with the timeless elegance of fine chocolate.",
        icon: Heart,
        color: "from-red-500 to-rose-700",
        image: "/occasion-anniversary.jpg",
        link: "/shop?category=Anniversary"
    },
    {
        id: "wedding",
        title: "Weddings",
        description: "Exquisite favors and grand displays for your perfect day.",
        icon: Star,
        color: "from-gold-300 to-gold-600",
        image: "/occasion-wedding.jpg",
        link: "/shop?category=Wedding"
    },
    {
        id: "corporate",
        title: "Corporate Gifting",
        description: "Impress clients and colleagues with premium, branded chocolate gifts.",
        icon: Briefcase,
        color: "from-blue-500 to-indigo-700",
        image: "/occasion-corporate.jpg",
        link: "/contact"
    },
    {
        id: "festivals",
        title: "Festivals",
        description: "Share the joy of the season with our limited edition festive hampers.",
        icon: PartyPopper,
        color: "from-orange-500 to-red-600",
        image: "/occasion-festival.jpg",
        link: "/shop?category=Festivals"
    },
    {
        id: "just-because",
        title: "Just Because",
        description: "The best moments are the unexpected ones. Treat yourself or a loved one.",
        icon: Calendar,
        color: "from-emerald-400 to-teal-600",
        image: "/occasion-just-because.jpg",
        link: "/shop"
    }
]

export default function OccasionsPage() {
    const { scrollYProgress } = useScroll()
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])

    // Mouse movement parallax effect
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        mouseX.set((clientX - centerX) / 50)
        mouseY.set((clientY - centerY) / 50)
    }

    return (
        <div
            className="min-h-screen bg-chocolate-950 bg-[url('/noise.png')] text-white font-sans selection:bg-gold-500 selection:text-chocolate-950 overflow-hidden"
            onMouseMove={handleMouseMove}
        >

            {/* Redesigned Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden py-20 lg:py-0">
                {/* Animated Background Gradients */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-gold-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-chocolate-600/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

                <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Typography */}
                    <div className="space-y-8 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-gold-500/20 text-gold-400 text-sm font-medium mb-6">
                                <Sparkles size={16} />
                                <span>Curated for Every Milestone</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight">
                                <span className="block text-white">Celebrate</span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 animate-shimmer bg-[length:200%_100%] pb-2">Every Moment</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-lg md:text-xl text-chocolate-100 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed"
                        >
                            From grand weddings to quiet gestures of appreciation, discover the art of gifting with our handcrafted chocolate collections.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Button size="lg" onClick={() => document.getElementById('occasions-grid')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gold-500 text-chocolate-950 hover:bg-white font-bold rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(198,166,51,0.3)] hover:shadow-[0_0_40px_rgba(198,166,51,0.5)] transition-all">
                                Explore Occasions
                            </Button>
                            <Link href="/contact">
                                <Button size="lg" variant="ghost" className="text-gold-400 hover:text-gold-300 hover:bg-white/5 font-medium rounded-full px-8 py-6 text-lg">
                                    Custom Requests <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Column: Dynamic Visuals */}
                    <motion.div
                        style={{ y: heroY, x: mouseX, rotateY: mouseX }}
                        className="relative h-[600px] w-full hidden lg:block perspective-1000"
                    >
                        {/* This could be a 3D spline or just a nice composition of images */}
                        {/* Abstract Composition using simple divs/gradients for now to simulate floating elements */}

                        {/* Main Central Image/Shape */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-[500px] bg-gradient-to-br from-[#3E2723] to-black rounded-[100px] border border-white/10 overflow-hidden shadow-2xl skew-y-3"
                        >
                            <div className="absolute inset-0 bg-[url('/about-hero-v3.png')] bg-cover bg-center opacity-80 mix-blend-overlay hover:scale-110 transition-transform duration-[3s]" />
                            {/* Glossy Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12" />
                        </motion.div>

                        {/* Floating Element 1 - Top Right */}
                        <motion.div
                            animate={{ y: [-20, 20, -20] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-20 right-10 w-48 h-48 bg-gold-500/20 backdrop-blur-md rounded-full border border-gold-500/30 flex items-center justify-center"
                        >
                            <Gift className="text-gold-400 w-20 h-20 opacity-80" />
                        </motion.div>

                        {/* Floating Element 2 - Bottom Left */}
                        <motion.div
                            animate={{ y: [30, -10, 30] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-20 left-10 w-32 h-32 bg-chocolate-500/30 backdrop-blur-md rounded-3xl border border-white/10 flex items-center justify-center rotate-12"
                        >
                            <Heart className="text-red-400 w-12 h-12 fill-current opacity-80" />
                        </motion.div>

                        {/* Floating Element 3 - Top Left */}
                        <motion.div
                            animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute top-40 left-0 w-24 h-24 bg-white/5 backdrop-blur-sm rounded-full border border-dashed border-white/20 flex items-center justify-center"
                        >
                            <Star className="text-gold-200 w-8 h-8 fill-gold-500/20" />
                        </motion.div>

                    </motion.div>
                </div>

                {/* Mobile specific graphic replacement */}
                <div className="lg:hidden absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="w-full h-full bg-[url('/about-hero-v3.png')] bg-cover bg-center" />
                </div>
            </section>

            {/* Occasions Grid */}
            <section id="occasions-grid" className="py-24 container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {OCCASIONS.map((occasion, index) => {
                        const Icon = occasion.icon
                        return (
                            <motion.div
                                key={occasion.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                            >
                                <Link href={occasion.link} className="block group h-full">
                                    <div className="relative h-96 rounded-[2rem] overflow-hidden bg-chocolate-900 border border-white/5 group-hover:border-gold-500/30 transition-all duration-500 shadow-2xl group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform group-hover:-translate-y-2">

                                        {/* Background Gradient/Image */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${occasion.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

                                        {/* Icon Background */}
                                        <div className="absolute -right-12 -top-12 opacity-5 text-white transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                            <Icon size={200} />
                                        </div>

                                        <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-gold-500 group-hover:text-chocolate-950 transition-colors duration-300">
                                                    <Icon size={20} />
                                                </div>
                                                <h3 className="text-3xl font-serif font-bold text-white mb-2">{occasion.title}</h3>
                                                <p className="text-chocolate-200 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                    {occasion.description}
                                                </p>
                                                <div className="flex items-center text-gold-400 text-sm font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                                    Explore Collection <ArrowRight size={16} className="ml-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-gradient-to-br from-gold-600 to-gold-400 p-1 rounded-[3rem] shadow-[0_0_100px_rgba(198,166,51,0.2)]"
                    >
                        <div className="bg-chocolate-950 rounded-[2.8rem] px-8 py-20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-50" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />

                            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
                                    Something truly unique?
                                </h2>
                                <p className="text-lg text-chocolate-200 font-light">
                                    For those once-in-a-lifetime moments, generic gifts simply won't do. Design a completely custom chocolate experience that reflects the singularity of your occasion.
                                </p>
                                <Link href="/contact" className="inline-block">
                                    <Button size="lg" className="bg-white text-chocolate-950 hover:bg-gold-100 font-bold px-10 py-7 text-lg rounded-full shadow-lg hover:scale-105 transition-transform">
                                        Plan a Custom Celebration
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
