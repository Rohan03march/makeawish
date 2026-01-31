"use client"

import { useState } from "react"
import { X, Upload, Image as ImageIcon } from "lucide-react"

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (product: any) => void
    editProduct?: any
}

export function AddProductModal({ isOpen, onClose, onSave, editProduct }: AddProductModalProps) {
    const [formData, setFormData] = useState({
        name: editProduct?.name || "",
        description: editProduct?.description || "",
        category: editProduct?.category || "Chocolates",
        price: editProduct?.price || "",
        stock: editProduct?.stock || "",
        image: editProduct?.image || ""
    })

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            ...formData,
            id: editProduct?.id || `PRD-${Date.now()}`,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock)
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-chocolate-900 to-chocolate-950 rounded-2xl max-w-2xl w-full border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-2xl font-serif font-bold text-white">
                        {editProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-chocolate-300 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white placeholder-chocolate-400 focus:outline-none focus:border-gold-500/50 transition-colors"
                                placeholder="Enter product name"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Category *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                            >
                                <option value="Chocolates">Chocolates</option>
                                <option value="Gift Boxes">Gift Boxes</option>
                                <option value="Truffles">Truffles</option>
                                <option value="Bars">Bars</option>
                                <option value="Seasonal">Seasonal</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white placeholder-chocolate-400 focus:outline-none focus:border-gold-500/50 transition-colors"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white placeholder-chocolate-400 focus:outline-none focus:border-gold-500/50 transition-colors"
                                placeholder="0"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Image URL
                            </label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white placeholder-chocolate-400 focus:outline-none focus:border-gold-500/50 transition-colors"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-chocolate-300 mb-2">
                                Description
                            </label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white placeholder-chocolate-400 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                                placeholder="Enter product description"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-chocolate-800/50 hover:bg-chocolate-800 text-white rounded-lg transition-all font-semibold border border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-chocolate-950 rounded-lg transition-all font-bold shadow-lg shadow-gold-500/20"
                        >
                            {editProduct ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
