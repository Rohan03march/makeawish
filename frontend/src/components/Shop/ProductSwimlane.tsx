import * as React from "react"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface ProductSwimlaneProps {
    title: string
    products: any[]
    id: string
    onViewAll?: () => void
    viewAllLink?: string
    favoriteIds: string[]
    onToggleFavorite: (e: React.MouseEvent, productId: string) => void
    onAddToCart: (product: any, qty: number) => void
}

export function ProductSwimlane({
    title,
    products,
    id,
    onViewAll,
    favoriteIds,
    onToggleFavorite,
    onAddToCart
}: ProductSwimlaneProps) {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)

    if (!products || products.length === 0) return null

    return (
        <section id={id} className="py-8 scroll-mt-24 border-b border-white/5 last:border-0">
            <div className="flex items-center justify-between mb-6 px-4 md:px-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-gold-500 rounded-full" />
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">
                        {title}
                    </h2>
                </div>
                {onViewAll && (
                    <Button
                        variant="ghost"
                        onClick={onViewAll}
                        className="text-gold-400 hover:text-white hover:bg-white/5 gap-2 text-sm font-medium tracking-wide uppercase transition-colors"
                    >
                        See All <ChevronRight className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-4 px-4 md:px-0 pb-8 snap-x snap-mandatory no-scrollbar md:gap-6 -mx-4 md:mx-0"
                style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
            >
                {products.slice(0, 10).map((product) => (
                    <div
                        key={product._id}
                        className="flex-none w-[260px] md:w-[300px] snap-center h-full first:pl-4 md:first:pl-0 last:pr-4 md:last:pr-0"
                    >
                        <ProductCard
                            product={product}
                            isFavorite={favoriteIds.includes(product._id)}
                            onToggleFavorite={onToggleFavorite}
                            onAddToCart={onAddToCart}
                        />
                    </div>
                ))}

                {products.length > 10 && onViewAll && (
                    <div className="flex-none w-[160px] md:w-[200px] snap-center h-full flex items-center justify-center p-4 last:pr-4 md:last:pr-0">
                        <Button
                            variant="outline"
                            onClick={onViewAll}
                            className="w-full h-full min-h-[200px] border-2 border-dashed border-white/10 hover:border-gold-500/50 bg-white/5 hover:bg-gold-500/10 text-chocolate-200 hover:text-gold-400 flex flex-col gap-3 rounded-2xl transition-all group"
                        >
                            <span className="p-3 rounded-full bg-white/5 group-hover:bg-gold-500/20 transition-colors">
                                <ChevronRight className="w-6 h-6" />
                            </span>
                            <span className="font-serif text-lg">View All {products.length} Items</span>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}
