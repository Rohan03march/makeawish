"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, User, Search, Menu, X, LogOut, Package, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Custom Builder", href: "/builder" },
    { name: "Hampers & Gifts", href: "/gifts" },
    { name: "Occasions", href: "/occasions" },
    { name: "Contact", href: "/contact" },
]

import { useCart } from "@/context/CartContext"

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [userInfo, setUserInfo] = React.useState<any>(null)
    const pathname = usePathname()
    const { cartCount, setIsCartOpen, clearCart } = useCart()

    React.useEffect(() => {
        // user login check
        const user = localStorage.getItem('userInfo')
        if (user) {
            setUserInfo(JSON.parse(user))
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('userInfo')
        clearCart()
        setUserInfo(null)
        window.location.href = '/'
    }

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
                <Link href="/" className="mr-6 flex flex-col items-center group">
                    <span className="text-3xl md:text-5xl font-bold font-script tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform duration-300">
                        Make a wish
                    </span>
                    <span className="text-[10px] md:text-xs font-serif italic text-gold-400/90 tracking-[0.2em] uppercase mt-0 font-medium">
                        A box full of love
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
                <div className="flex items-center space-x-1 md:space-x-2">


                    {userInfo ? (
                        <>
                            <div className="relative group hidden lg:block">
                                <Link href="/account">
                                    <Button variant="ghost" className="text-sm font-bold text-gold-400 hover:text-gold-300 hover:bg-white/5 transition-colors gap-2">
                                        <User className="h-4 w-4" />
                                        Hi, {userInfo.name.split(' ')[0]}
                                    </Button>
                                </Link>

                                {/* Dropdown */}
                                <div className="absolute top-full right-0 mt-2 w-48 bg-[#1B0F0B] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50 overflow-hidden">
                                    <div className="p-2 space-y-1">
                                        <Link href="/account?tab=profile">
                                            <div className="flex items-center gap-3 px-4 py-2 text-sm text-chocolate-100 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                                <User className="h-4 w-4 text-gold-400" />
                                                My Account
                                            </div>
                                        </Link>
                                        <Link href="/account?tab=orders">
                                            <div className="flex items-center gap-3 px-4 py-2 text-sm text-chocolate-100 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                                <Package className="h-4 w-4 text-gold-400" />
                                                My Orders
                                            </div>
                                        </Link>
                                        <div className="h-px bg-white/10 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer text-left"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile User Icon */}
                            <Link href="/account" className="lg:hidden">
                                <Button variant="ghost" size="icon" className="text-chocolate-100 hover:text-gold-400 hover:bg-white/5 transition-colors">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>

                            {/* Cart */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-chocolate-100 hover:text-gold-400 hover:bg-white/5 relative transition-colors"
                                onClick={() => setIsCartOpen(true)}
                                title="Cart"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold-500 text-[11px] font-bold text-chocolate-950 flex items-center justify-center animate-bounce shadow-lg ring-2 ring-chocolate-950">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>

                            {/* Favorites (Desktop Only) */}
                            <Link href="/favorites" className="hidden lg:flex">
                                <Button variant="ghost" size="icon" className="text-chocolate-100 hover:text-gold-400 hover:bg-white/5 transition-colors" title="Favorites">
                                    <Heart className="h-5 w-5" />
                                </Button>
                            </Link>


                        </>
                    ) : (
                        <>
                            {/* Cart (Visible when logged out too) */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-chocolate-100 hover:text-gold-400 hover:bg-white/5 relative transition-colors"
                                onClick={() => setIsCartOpen(true)}
                                title="Cart"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold-500 text-[11px] font-bold text-chocolate-950 flex items-center justify-center animate-bounce shadow-lg ring-2 ring-chocolate-950">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>

                            <Link href="/login">
                                <Button variant="ghost" size="icon" className="text-chocolate-100 hover:text-gold-400 hover:bg-white/5 transition-colors">
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">Login</span>
                                </Button>
                            </Link>
                        </>
                    )}

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
                            {/* Mobile Favorites Link */}
                            {userInfo && (
                                <Link
                                    href="/favorites"
                                    className={cn(
                                        "block py-3 text-lg font-serif transition-colors hover:text-gold-400 border-b border-white/5 flex items-center gap-2",
                                        pathname === "/favorites" ? "text-gold-400" : "text-chocolate-100"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Heart className="h-5 w-5" />
                                    Favorites
                                </Link>
                            )}
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
