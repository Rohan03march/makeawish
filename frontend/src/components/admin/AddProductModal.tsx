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
        images: editProduct?.images || (editProduct?.image ? [editProduct.image] : []),
        originalPrice: editProduct?.originalPrice || ""
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
                images: editProduct?.images || (editProduct?.image ? [editProduct.image] : []),
                originalPrice: editProduct?.originalPrice || ""
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
                originalPrice: parseFloat(formData.originalPrice) || 0,
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
            <div className="fixed inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative bg-gradient-to-br from-[#2A1812] to-[#1B0F0B] w-full max-w-5xl rounded-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(198,166,51,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-8 border-b border-white/5 bg-white/5 backdrop-blur-md">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F0E0AA] via-[#C6A633] to-[#7A6218]">
                            {editProduct ? 'Edit Masterpiece' : 'Craft New Creation'}
                        </h2>
                        <p className="text-[#A87B6B] text-sm mt-2 font-medium tracking-wide">
                            {editProduct ? 'Refine the details of your exquisite product.' : 'Add a new delight to your premium collection.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="group p-2 rounded-full hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/10"
                    >
                        <X className="w-6 h-6 text-[#C29F91] group-hover:text-red-400 transition-colors" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Column: Media & Description */}
                        <div className="lg:col-span-5 space-y-8">
                            {/* Improved Image Upload Area */}
                            <div className="space-y-4">
                                <label className="flex items-center justify-between text-sm font-bold text-[#DBC055] uppercase tracking-widest">
                                    <span>Visual Assets</span>
                                    <span className="text-[10px] bg-[#C6A633]/10 px-2 py-1 rounded text-[#C6A633]">{formData.images.length} Images</span>
                                </label>

                                <div className="p-1 bg-[#3E241C]/30 rounded-xl border border-white/5 flex gap-1">
                                    {["file", "url"].map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setUploadMethod(method as "file" | "url")}
                                            className={cn(
                                                "flex-1 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300",
                                                uploadMethod === method
                                                    ? "bg-gradient-to-r from-[#C6A633] to-[#9F8323] text-[#1B0F0B] shadow-lg"
                                                    : "text-[#A87B6B] hover:text-[#F7F5F3] hover:bg-white/5"
                                            )}
                                        >
                                            {method === "file" ? "Upload File" : "Image URL"}
                                        </button>
                                    ))}
                                </div>

                                {uploadMethod === "file" ? (
                                    <div
                                        className={cn(
                                            "relative group h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden bg-[url('/noise.png')]",
                                            dragActive
                                                ? "border-[#C6A633] bg-[#C6A633]/5 scale-[1.02]"
                                                : "border-white/10 bg-[#3E241C]/20 hover:border-[#C6A633]/50 hover:bg-[#3E241C]/40"
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative z-10 flex flex-col items-center gap-3 transform group-hover:-translate-y-1 transition-transform duration-300">
                                            <div className="p-4 rounded-full bg-[#2A1812] border border-white/10 group-hover:border-[#C6A633] group-hover:shadow-[0_0_20px_-5px_rgba(198,166,51,0.3)] transition-all duration-300">
                                                <Upload className="w-8 h-8 text-[#A87B6B] group-hover:text-[#C6A633] transition-colors" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[#F7F5F3] font-medium">Click or Drag Image</p>
                                                <p className="text-xs text-[#A87B6B] mt-1">Supports: JPG, PNG, WEBP</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            className="flex-1 px-5 py-3.5 bg-[#1B0F0B] border border-white/10 rounded-xl text-white placeholder-[#573328] focus:outline-none focus:border-[#C6A633] focus:ring-1 focus:ring-[#C6A633]/20 transition-all font-mono text-sm"
                                            placeholder="https://..."
                                        />
                                        <button
                                            type="button"
                                            onClick={addUrlImage}
                                            className="px-6 bg-[#C6A633] hover:bg-[#DBC055] text-[#1B0F0B] rounded-xl font-bold transition-all shadow-lg hover:shadow-[#C6A633]/20 active:scale-95"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                {/* Image Grid */}
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3 pt-2">
                                        {formData.images.map((img: string, idx: number) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:z-10 bg-[#1B0F0B]">
                                                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                                        className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all transform hover:rotate-90"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {idx === 0 && (
                                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#C6A633] text-[#1B0F0B] text-[10px] font-bold rounded uppercase tracking-wider shadow-lg">
                                                        Main
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 pt-4 border-t border-white/5">
                                <div className="group">
                                    <label className="block text-sm font-bold text-[#DBC055] mb-3 uppercase tracking-wider group-focus-within:text-[#F0E0AA] transition-colors">Experience Description</label>
                                    <textarea
                                        rows={5}
                                        value={formData.description ?? ""}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-5 py-4 bg-[#1B0F0B] border border-white/10 rounded-2xl text-[#EADFD8] placeholder-[#573328] focus:outline-none focus:border-[#C6A633]/50 focus:ring-1 focus:ring-[#C6A633]/20 transition-all resize-none shadow-inner"
                                        placeholder="Describe the tasting notes, texture, and origin..."
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-bold text-[#DBC055] mb-3 uppercase tracking-wider group-focus-within:text-[#F0E0AA] transition-colors">Ingredients List</label>
                                    <textarea
                                        rows={3}
                                        value={formData.ingredients ?? ""}
                                        onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                                        className="w-full px-5 py-4 bg-[#1B0F0B] border border-white/10 rounded-2xl text-[#EADFD8] placeholder-[#573328] focus:outline-none focus:border-[#C6A633]/50 focus:ring-1 focus:ring-[#C6A633]/20 transition-all resize-none shadow-inner"
                                        placeholder="E.g. Venezuelan Cocoa (72%), Madagascar Vanilla..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Product Details */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group md:col-span-2 space-y-1">
                                    <label className="block text-sm font-bold text-[#DBC055] uppercase tracking-wider">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name ?? ""}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-6 py-4 bg-[#1B0F0B] border border-white/10 rounded-2xl text-2xl font-serif text-[#F7F5F3] placeholder-[#573328] focus:outline-none focus:border-[#C6A633]/50 focus:ring-1 focus:ring-[#C6A633]/20 transition-all"
                                        placeholder="Golden Hazelnut Truffle"
                                    />
                                </div>

                                <div className="group space-y-2">
                                    <label className="block text-sm font-bold text-[#DBC055] uppercase tracking-wider">Category</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={formData.category ?? "Chocolates"}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-5 py-4 bg-[#1B0F0B] border border-white/10 rounded-2xl text-[#EADFD8] focus:outline-none focus:border-[#C6A633]/50 focus:ring-1 focus:ring-[#C6A633]/20 transition-all appearance-none cursor-pointer hover:bg-[#2A1812]"
                                        >
                                            <option value="Chocolates">Chocolates</option>
                                            <option value="Gift Boxes">Gift Boxes</option>
                                            <option value="Truffles">Truffles</option>
                                            <option value="Bars">Bars</option>
                                            <option value="Seasonal">Seasonal</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#C6A633]">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="group space-y-2">
                                    <label className="block text-sm font-bold text-[#DBC055] uppercase tracking-wider">Rating</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            value={formData.rating ?? ""}
                                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                            className="w-full px-5 py-4 bg-[#1B0F0B] border border-white/10 rounded-2xl text-[#EADFD8] placeholder-[#573328] focus:outline-none focus:border-[#C6A633]/50 focus:ring-1 focus:ring-[#C6A633]/20 transition-all"
                                            placeholder="4.8"
                                        />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#DBC055]">★</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-serif font-bold text-[#F0E0AA] flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-[#C6A633]"></span> Pricing & Inventory
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Sale Price Card */}
                                    <div className="bg-[#1B0F0B]/80 p-4 rounded-2xl border border-white/5 hover:border-[#C6A633]/30 transition-all group shadow-lg shadow-black/20">
                                        <label className="block text-[10px] font-bold text-[#A87B6B] uppercase tracking-wider mb-2 group-hover:text-[#C6A633] transition-colors">Sale Price</label>
                                        <div className="relative flex items-baseline">
                                            <span className="text-[#573328] font-serif text-lg mr-1 group-focus-within:text-[#C6A633] transition-colors">₹</span>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={formData.price ?? ""}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full bg-transparent text-2xl font-bold text-[#F7F5F3] placeholder-[#3E241C] focus:outline-none focus:placeholder-[#573328] transition-all p-0 border-none"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Original Price Card */}
                                    <div className="bg-[#1B0F0B]/80 p-4 rounded-2xl border border-white/5 hover:border-[#C6A633]/30 transition-all group shadow-lg shadow-black/20">
                                        <label className="block text-[10px] font-bold text-[#A87B6B] uppercase tracking-wider mb-2 group-hover:text-[#C6A633] transition-colors">Original Price</label>
                                        <div className="relative flex items-baseline">
                                            <span className="text-[#573328] font-serif text-lg mr-1 transition-colors">₹</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.originalPrice ?? ""}
                                                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                                className="w-full bg-transparent text-xl font-medium text-[#A87B6B] placeholder-[#3E241C] focus:outline-none transition-all p-0 border-none line-through decoration-[#573328] decoration-2"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Stock Card */}
                                    <div className="bg-[#1B0F0B]/80 p-4 rounded-2xl border border-white/5 hover:border-[#C6A633]/30 transition-all group shadow-lg shadow-black/20">
                                        <label className="block text-[10px] font-bold text-[#A87B6B] uppercase tracking-wider mb-2 flex justify-between group-hover:text-[#C6A633] transition-colors">
                                            <span>Stock Units</span>
                                            {parseInt(formData.stock) < 10 && parseInt(formData.stock) > 0 && <span className="text-red-400 animate-pulse text-[9px]">Low Stock</span>}
                                        </label>
                                        <div className="relative flex items-center">
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                value={formData.stock ?? ""}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                className="w-full bg-transparent text-2xl font-bold text-[#F7F5F3] placeholder-[#3E241C] focus:outline-none focus:placeholder-[#573328] transition-all p-0 border-none"
                                                placeholder="0"
                                            />
                                            <span className="text-xs text-[#573328] uppercase font-bold tracking-wider">Qty</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-gradient-to-r from-[#C6A633]/10 to-transparent p-5 rounded-2xl border border-[#C6A633]/20">
                                <div>
                                    <h4 className="font-bold text-[#F0E0AA]">Bestseller Status</h4>
                                    <p className="text-xs text-[#A87B6B] mt-1">Highlight this product in trending sections</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.isBestseller}
                                        onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                                    />
                                    <div className="w-14 h-7 bg-[#3E241C] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C6A633]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[#A87B6B] after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#C6A633] peer-checked:after:bg-white"></div>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-6 flex items-center gap-6 mt-auto">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-8 py-4 bg-transparent border border-white/10 hover:bg-white/5 text-[#A87B6B] hover:text-[#F7F5F3] rounded-xl transition-all font-bold tracking-wide uppercase text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="flex-1 py-4 bg-gradient-to-r from-[#C6A633] via-[#DBC055] to-[#9F8323] hover:brightness-110 text-[#1B0F0B] rounded-xl transition-all font-bold text-base shadow-[0_0_30px_-5px_rgba(198,166,51,0.4)] hover:shadow-[0_0_40px_-5px_rgba(198,166,51,0.6)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-[#1B0F0B] border-t-transparent rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span>{editProduct ? 'Update Masterpiece' : 'Launch Product'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
