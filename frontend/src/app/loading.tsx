import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] bg-[#1A110D] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                {/* Pulsing Glow */}
                <div className="absolute inset-0 bg-gold-500/20 blur-xl rounded-full animate-pulse" />

                {/* Brand Logo */}
                <h1 className="relative z-10 text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600 tracking-widest animate-pulse">
                    Luxe.
                </h1>
            </div>

            {/* Subtle Spinner */}
            <Loader2 className="h-6 w-6 text-gold-500/50 animate-spin" />

            <span className="sr-only">Loading...</span>
        </div>
    )
}
