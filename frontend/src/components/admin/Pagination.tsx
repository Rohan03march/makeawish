"use client"

import { X } from "lucide-react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            }
        }
        return pages
    }

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <div className="text-sm text-chocolate-300">
                Showing <span className="font-semibold text-white">{startItem}</span> to{' '}
                <span className="font-semibold text-white">{endItem}</span> of{' '}
                <span className="font-semibold text-white">{totalItems}</span> results
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-chocolate-800/50 hover:bg-chocolate-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 font-medium"
                >
                    Previous
                </button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => (
                        typeof page === 'number' ? (
                            <button
                                key={idx}
                                onClick={() => onPageChange(page)}
                                className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === page
                                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-chocolate-950 shadow-lg'
                                        : 'bg-chocolate-800/50 hover:bg-chocolate-800 text-white border border-white/10'
                                    }`}
                            >
                                {page}
                            </button>
                        ) : (
                            <span key={idx} className="px-2 text-chocolate-400">
                                {page}
                            </span>
                        )
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-chocolate-800/50 hover:bg-chocolate-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 font-medium"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
