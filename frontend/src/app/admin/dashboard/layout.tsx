"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo")
        if (!userInfo) {
            router.push("/admin")
            return
        }

        try {
            const user = JSON.parse(userInfo)
            if (!user.isAdmin) {
                router.push("/shop")
                return
            }
            setIsLoading(false)
        } catch (error) {
            localStorage.removeItem("userInfo")
            router.push("/admin")
        }
    }, [router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-chocolate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-chocolate-950 bg-[url('/noise.png')] text-white flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    )
}
