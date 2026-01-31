"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, User, MapPin, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { name: "My Orders", href: "/account/orders", icon: Package },
    { name: "Profile", href: "/account/profile", icon: User },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
]

export function AccountSidebar() {
    const pathname = usePathname()

    return (
        <div className="bg-chocolate-900/40 border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-white/5 bg-chocolate-950/30">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gold-500 flex items-center justify-center text-chocolate-950 font-bold text-xl">
                        JD
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-white">John Doe</h3>
                        <p className="text-sm text-chocolate-300">john@example.com</p>
                    </div>
                </div>
            </div>

            <nav className="p-2 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-gold-500/10 text-gold-400 font-medium"
                                    : "text-chocolate-300 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className={cn("w-4 h-4", isActive ? "text-gold-400" : "text-chocolate-400 group-hover:text-gold-400")} />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}

                <div className="my-2 border-t border-white/5" />

                <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </nav>
        </div>
    )
}
