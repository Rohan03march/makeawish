"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function PageLoader() {
    const [isMelting, setIsMelting] = useState(false)

    useEffect(() => {
        // Trigger melting animation after a brief pause
        const timer = setTimeout(() => setIsMelting(true), 800)
        return () => clearTimeout(timer)
    }, [])

    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{
                y: "100%",
                transition: {
                    duration: 1.2,
                    ease: [0.7, 0, 0.3, 1], // Custom liquid ease
                    delay: 0.8
                }
            }}
            className="fixed inset-0 z-[100] pointer-events-none flex flex-col"
        >
            {/* Main Chocolate Block */}
            <div className="flex-1 bg-[#2A1A15] relative flex items-center justify-center">
                {/* Loading Logo - Fades out before melt */}
                <motion.div
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{
                        opacity: 0,
                        scale: 0.95,
                        transition: { duration: 0.5, delay: 0.3 }
                    }}
                    className="text-gold-500 font-serif text-4xl md:text-6xl font-bold tracking-widest z-10"
                >
                    Luxe.
                </motion.div>

                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />
            </div>

            {/* Dripping/Melting Edge (SVG Wave) */}
            <div className="h-24 md:h-48 w-full bg-[#2A1A15] relative -mt-1 overflow-visible">
                <svg className="absolute bottom-0 left-0 w-full h-full text-[#2A1A15] fill-current transform translate-y-1/2" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                </svg>
            </div>
        </motion.div>
    )
}
