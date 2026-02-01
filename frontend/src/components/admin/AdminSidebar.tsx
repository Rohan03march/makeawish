"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Store, Bell, User, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from "react"
import { API_URL } from "@/lib/config"

const navItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard, badge: null },
    { name: "Products", href: "/admin/dashboard/products", icon: Package, badge: null },
    { name: "Orders", href: "/admin/dashboard/orders", icon: ShoppingBag, badge: null },
    { name: "Customers", href: "/admin/dashboard/customers", icon: Users, badge: null },
    { name: "Permissions", href: "/admin/dashboard/permissions", icon: ShieldCheck, badge: "!" },
    { name: "Settings", href: "/admin/dashboard/settings", icon: Settings, badge: null },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const [userInfo, setUserInfo] = React.useState<any>(null)
    const [pendingCount, setPendingCount] = React.useState(0)
    const [orderCount, setOrderCount] = React.useState(0)

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem('userInfo')
            if (userStr) {
                const user = JSON.parse(userStr)
                setUserInfo(user)

                if (user.isAdmin) {
                    // Fetch Pending Users
                    fetch(`${API_URL}/api/auth/pending-users`, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (Array.isArray(data)) setPendingCount(data.length)
                        })
                        .catch(err => console.error("Failed to fetch pending users", err))

                    // Fetch Orders Count
                    fetch(`${API_URL}/api/orders`, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (Array.isArray(data)) setOrderCount(data.length)
                        })
                        .catch(err => console.error("Failed to fetch orders", err))
                }
            }
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('userInfo')
        window.location.href = '/admin'
    }

    return (
        <aside className="w-64 bg-gradient-to-b from-chocolate-950 to-chocolate-950/95 backdrop-blur-xl border-r border-white/10 h-screen flex flex-col fixed left-0 top-0 z-50 shadow-2xl">
            {/* User Profile Section - Moved to top since Logo is removed */}
            <div className="p-4 border-b border-white/10 mt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-chocolate-900/40 hover:bg-chocolate-900/60 transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-chocolate-950 font-bold shadow-lg">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-white font-semibold text-sm truncate">{userInfo?.name || "Admin User"}</p>
                        <p className="text-chocolate-400 text-xs truncate" title={userInfo?.email}>{userInfo?.email || "loading..."}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    // Dynamic Badge Logic
                    let badgeDisplay = item.badge
                    if (item.name === "Permissions") {
                        badgeDisplay = pendingCount > 0 ? pendingCount.toString() : null
                    }
                    if (item.name === "Orders") {
                        badgeDisplay = orderCount > 0 ? orderCount.toString() : null
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-gold-500 to-gold-600 text-chocolate-950 font-bold shadow-lg shadow-gold-500/30"
                                    : "text-chocolate-300 hover:bg-chocolate-900/40 hover:text-white"
                            )}
                        >
                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-chocolate-950 rounded-r-full" />
                            )}

                            <Icon className={cn(
                                "w-5 h-5 transition-all duration-200",
                                isActive
                                    ? "text-chocolate-950"
                                    : "text-chocolate-400 group-hover:text-gold-400 group-hover:scale-110"
                            )} />

                            <span className="flex-1">{item.name}</span>

                            {/* Notification Badge */}
                            {badgeDisplay && (
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-bold",
                                    isActive
                                        ? "bg-chocolate-950/20 text-chocolate-950"
                                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                                )}>
                                    {badgeDisplay}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                    href="/shop"
                    className="flex items-center gap-3 px-4 py-3 text-chocolate-300 hover:text-white hover:bg-chocolate-900/40 rounded-xl transition-all group"
                >
                    <Store className="w-5 h-5 text-gold-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">View Store</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group border border-transparent hover:border-red-500/30">
                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    )
}
