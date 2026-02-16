"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith('/admin')
    const isAuthRoute = pathname === '/login' || pathname === '/signup'

    if (isAdminRoute || isAuthRoute) {
        return <>{children}</>
    }

    return (
        <>
            <Header />
            <main className="flex-1 overflow-x-hidden">{children}</main>
            {(!pathname?.startsWith('/order-success') && pathname !== '/shop') && <Footer />}
        </>
    )
}
