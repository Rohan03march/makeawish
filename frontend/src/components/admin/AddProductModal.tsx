"use client"

import { useState, useRef, useEffect } from "react"
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { API_URL } from "@/lib/config"

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
        rating: editProduct?.rating || "",
        isBestseller: editProduct?.isBestseller || false,
        ingredients: editProduct?.ingredients || "",
        images: editProduct?.images || (editProduct?.image ? [editProduct.image] : [])
    })

    const [dragActive, setDragActive] = useState(false)
    // We don't rely on single previewUrl anymore, we use formData.images
    const [lastUploaded, setLastUploaded] = useState<string | null>(null)
    const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [urlInput, setUrlInput] = useState("")
    const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map())
    const [isUploading, setIsUploading] = useState(false)

    // Reset state when modal opens/closes or product changes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: editProduct?.name || "",
                description: editProduct?.description || "",
                category: editProduct?.category || "Chocolates",
                price: editProduct?.price || "",
                stock: editProduct?.stock || "",
                rating: editProduct?.rating || "",
                isBestseller: editProduct?.isBestseller || false,
                ingredients: editProduct?.ingredients || "",
                images: editProduct?.images || (editProduct?.image ? [editProduct.image] : [])
            })
            setUrlInput("")
            setPendingFiles(new Map())
        }
    }, [isOpen, editProduct])

    if (!isOpen) return null

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = (file: File) => {
        const url = URL.createObjectURL(file)
        setPendingFiles(prev => new Map(prev).set(url, file))
        setFormData(prev => ({ ...prev, images: [...prev.images, url] }))
    }

    const addUrlImage = () => {
        if (urlInput) {
            setFormData(prev => ({ ...prev, images: [...prev.images, urlInput] }))
            setUrlInput("")
        }
    }

    const removeImage = (index: number) => {
        const imageToRemove = formData.images[index];
        setPendingFiles(prev => {
            const next = new Map(prev);
            next.delete(imageToRemove);
            return next;
        });
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_: string, i: number) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUploading(true)

        try {
            const updatedImages = await Promise.all(formData.images.map(async (img: string) => {
                const file = pendingFiles.get(img);
                if (file) {
                    const uploadFormData = new FormData();
                    uploadFormData.append('image', file);

                    const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
                    const token = user?.token

                    const res = await fetch(`${API_URL}/api/upload`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: uploadFormData
                    });

                    if (res.ok) {
                        const secureUrl = await res.json();
                        return secureUrl;
                    } else {
                        console.error("Upload failed");
                        throw new Error("Image upload failed");
                    }
                }
                return img;
            }));

            onSave({
                ...formData,
                images: updatedImages,
                id: editProduct?.id || `PRD-${Date.now()}`,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                rating: parseFloat(formData.rating) || 0,
                isBestseller: formData.isBestseller,
                // Ensure main image is set for backward compatibility
                image: updatedImages.length > 0 ? updatedImages[0] : ""
            })
            onClose()
        } catch (error) {
            console.error("Error submitting product", error)
            alert("Failed to upload images or save product. Please try again.")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-gradient-to-br from-chocolate-900 to-chocolate-950 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col border border-gold-500/20 shadow-2xl animate-in zoom-in-95 duration-300">

                <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/10 bg-white/5 rounded-t-2xl">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">
                            {editProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-chocolate-300 text-sm mt-1">Fill in the details to expand your catalog.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-chocolate-300 hover:text-red-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto p-8 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            {/* Images Section */}
                            <div>
                                <label className="block text-sm font-bold text-gold-400 mb-4 uppercase tracking-wider">Product Images</label>

                                <div className="flex bg-chocolate-800/50 p-1 rounded-lg border border-white/10 mb-4">
                                    <button type="button" onClick={() => setUploadMethod("file")} className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all", uploadMethod === "file" ? "bg-gold-500 text-chocolate-950 shadow-lg" : "text-chocolate-300 hover:text-white hover:bg-white/5")}>
                                        <Upload className="w-4 h-4" /> Upload
                                    </button>
                                    <button type="button" onClick={() => setUploadMethod("url")} className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all", uploadMethod === "url" ? "bg-gold-500 text-chocolate-950 shadow-lg" : "text-chocolate-300 hover:text-white hover:bg-white/5")}>
                                        <LinkIcon className="w-4 h-4" /> URL
                                    </button>
                                </div>

                                <div className="mb-4">
                                    {uploadMethod === "file" ? (
                                        <div
                                            className={cn(
                                                "relative h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden group",
                                                dragActive ? "border-gold-500 bg-gold-500/10" : "border-white/20 bg-chocolate-800/30 hover:border-gold-400/50 hover:bg-chocolate-800/50"
                                            )}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input
                                                key="file-input"
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileSelect}
                                            />
                                            <div className="text-center p-4">
                                                <ImageIcon className="w-8 h-8 text-chocolate-300 mx-auto mb-2" />
                                                <p className="text-sm text-chocolate-300">Click to add image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={urlInput}
                                                onChange={(e) => setUrlInput(e.target.value)}
                                                className="flex-1 px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-xl text-white placeholder-chocolate-500 focus:outline-none focus:border-gold-500/50"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            <button type="button" onClick={addUrlImage} className="px-4 bg-gold-500 text-chocolate-950 rounded-xl font-bold hover:bg-white transition-all">Add</button>
                                        </div>
                                    )}
                                </div>

                                {/* Image Preview List */}
                                <div className="grid grid-cols-3 gap-2">
                                    {formData.images.map((img: string, idx: number) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                                            <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gold-400 mb-2 uppercase tracking-wider">Description</label>
                                <textarea
                                    rows={4}
                                    value={formData.description ?? ""}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-xl text-white placeholder-chocolate-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all resize-none"
                                    placeholder="Describe the flavors..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gold-400 mb-2 uppercase tracking-wider">Ingredients</label>
                                <textarea
                                    rows={3}
                                    value={formData.ingredients ?? ""}
                                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                                    className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-xl text-white placeholder-chocolate-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all resize-none"
                                    placeholder="Cocoa mass, sugar, hazelnuts..."
                                />
                            </div>
                        </div>

                        {/* Right Column: Product Details */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gold-400 mb-2 uppercase tracking-wider">Product Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name ?? ""}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-xl text-white placeholder-chocolate-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all font-serif text-lg"
                                    placeholder="e.g. Midnight Truffle"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gold-400 mb-2 uppercase tracking-wider">Category *</label>
                                <select
                                    required
                                    value={formData.category ?? "Chocolates"}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all cursor-pointer"
                                >
                                    <option value="Chocolates">Chocolates</option>
                                    <option value="Gift Boxes">Gift Boxes</option>
                                    <option value="Truffles">Truffles</option>
                                    <option value="Bars">Bars</option>
                                    <option value="Seasonal">Seasonal</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gold-400 mb-2 uppercase tracking-wider">Price (₹) *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-400">₹</span>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.price ?? ""}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full pl-8 pr-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-xl text-white placeholder-chocolate-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gold-400 mb-2 uppercase tracking-wider">Stock *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.stock ?? ""}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-xl text-white placeholder-chocolate-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gold-400 mb-2 uppercase tracking-wider">Rating (0-5)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={formData.rating ?? ""}
                                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                    className="w-full px-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-xl text-white placeholder-chocolate-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all"
                                    placeholder="0.0"
                                />
                            </div>

                            <div className="flex items-center gap-3 bg-chocolate-800/50 p-4 rounded-xl border border-white/10">
                                <input
                                    type="checkbox"
                                    id="isBestseller"
                                    checked={formData.isBestseller}
                                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                                    className="w-5 h-5 rounded border-gold-500 text-gold-500 focus:ring-gold-500/50 cursor-pointer accent-gold-500"
                                />
                                <label htmlFor="isBestseller" className="text-sm font-bold text-gold-400 uppercase tracking-wider cursor-pointer select-none">
                                    Mark as Bestseller
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-8 flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-transparent border border-white/10 hover:bg-white/5 text-chocolate-200 rounded-xl transition-all font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-chocolate-950 rounded-xl transition-all font-bold shadow-xl shadow-gold-500/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    {editProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl z-20">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gold-400 font-bold">Uploading Images...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
