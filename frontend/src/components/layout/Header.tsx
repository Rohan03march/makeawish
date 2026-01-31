"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, User, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Custom Builder", href: "/builder" },
    { name: "Gifts", href: "/gifts" },
    { name: "Occasions", href: "/occasions" },
]

import { useCart } from "@/context/CartContext"

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const pathname = usePathname()
    const { cartCount, setIsCartOpen } = useCart()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled
                    ? "glass border-b border-white/5 py-2"
                    : "bg-transparent border-transparent py-4"
            )}
        >
            <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="mr-6 flex items-center group">
                    <span className="text-2xl md:text-3xl font-bold font-serif tracking-tighter text-gold-gradient group-hover:scale-105 transition-transform duration-300">
                        Luxe Chocolates
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative transition-colors hover:text-gold-400 py-1",
                                pathname === item.href ? "text-gold-400" : "text-chocolate-100"
                            )}
                        >
                            {item.name}
                            {pathname === item.href && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-gold-400"
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-chocolate-100 hover:text-gold-400 hover:bg-white/5 hidden md:flex transition-colors">
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                    <Link href="/login">
                        <Button variant="ghost" size="icon" className="text-chocolate-100 hover:text-gold-400 hover:bg-white/5 transition-colors">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Account</span>
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-chocolate-100 hover:text-gold-400 hover:bg-white/5 relative transition-colors"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold-500 text-[11px] font-bold text-chocolate-950 flex items-center justify-center animate-bounce shadow-lg ring-2 ring-chocolate-950">
                                {cartCount}
                            </span>
                        )}
                        <span className="sr-only">Cart</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-chocolate-100 md:hidden hover:bg-white/5"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-white/5 overflow-hidden"
                    >
                        <div className="container py-6 px-4 space-y-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "block py-3 text-lg font-serif transition-colors hover:text-gold-400 border-b border-white/5",
                                        pathname === item.href ? "text-gold-400" : "text-chocolate-100"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <Button className="w-full bg-gold-500 text-chocolate-950 hover:bg-gold-600 font-bold tracking-wide">
                                    Search Collection
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
