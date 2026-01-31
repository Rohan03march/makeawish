"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ComingSoonPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-chocolate-950 text-center px-4">
            <h1 className="text-5xl font-serif font-bold text-gold-500 mb-6">Coming Soon</h1>
            <p className="text-chocolate-200 text-xl max-w-md mb-8">
                We are currently crafting this experience. Please check back later.
            </p>
            <Link href="/shop">
                <Button className="bg-gold-500 text-chocolate-950 hover:bg-white font-bold h-12 px-8">
                    Browse Collection
                </Button>
            </Link>
        </div>
    )
}
