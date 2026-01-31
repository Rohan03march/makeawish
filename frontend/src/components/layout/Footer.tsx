"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-chocolate-50 pt-16 pb-12 relative overflow-hidden">
            {/* Background Pattern - Subtle */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* 1. The Floating 'Chocolate Bar' Newsletter Card */}
                <div className="bg-gradient-to-br from-chocolate-900 to-chocolate-950 rounded-[2.5rem] p-8 md:p-16 text-white shadow-2xl mb-24 relative overflow-hidden">
                    {/* Glossy Effect */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
                        <div className="max-w-xl space-y-4 text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                                Unlock the <span className="text-gold-400">Secret Menu</span>
                            </h2>
                            <p className="text-chocolate-200 text-lg">
                                Subscribe to our newsletter and be the first to taste limited releases, member-only truffles, and seasonal diffusions.
                            </p>
                        </div>

                        <div className="w-full lg:w-auto min-w-[350px] bg-white/5 p-2 rounded-full border border-white/10 flex flex-col sm:flex-row gap-2 backdrop-blur-sm">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="border-none bg-transparent text-white placeholder:text-chocolate-300 h-14 px-6 focus-visible:ring-0 rounded-full text-base w-full"
                            />
                            <Button className="h-14 rounded-full px-8 bg-gold-500 text-chocolate-950 hover:bg-white hover:text-chocolate-950 font-bold text-base transition-all shrink-0 shadow-lg">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. The Clean Link Grid (Bottom Section) */}
                <div className="grid grid-cols-2 md:grid-cols-12 gap-12 text-chocolate-900 border-t border-chocolate-200 pt-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="font-serif text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-chocolate-900 to-chocolate-700">Luxe.</span>
                        </Link>
                        <p className="text-chocolate-600/80 text-sm leading-relaxed max-w-xs">
                            Handcrafted in Zurich using ethically sourced cacao. Experience the art of Swiss chocolate making.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                <Link key={i} href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-chocolate-100 hover:bg-gold-500 hover:text-white transition-all text-chocolate-700">
                                    <Icon className="h-4 w-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Spacer for Desktop */}
                    <div className="hidden md:block md:col-span-2" />

                    {/* Columns */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-bold mb-6 text-chocolate-950">Collections</h4>
                        <ul className="space-y-4 text-sm text-chocolate-600 font-medium">
                            {['Dark Origin', 'Milk Velvet', 'Truffles', 'Gift Boxes'].map(item => (
                                <li key={item}><Link href="/shop" className="hover:text-gold-600 transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-bold mb-6 text-chocolate-950">Company</h4>
                        <ul className="space-y-4 text-sm text-chocolate-600 font-medium">
                            {['Our Story', 'Sustainability', 'Careers', 'Contact'].map(item => (
                                <li key={item}><Link href="/about" className="hover:text-gold-600 transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-bold mb-6 text-chocolate-950">Legal</h4>
                        <ul className="space-y-4 text-sm text-chocolate-600 font-medium">
                            {['Privacy Policy', 'Terms of Service', 'Cookies', 'Imprint'].map(item => (
                                <li key={item}><Link href="/privacy" className="hover:text-gold-600 transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-16 text-center text-xs text-chocolate-400 font-medium uppercase tracking-wider">
                    &copy; {currentYear} Luxe Chocolates AG. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
