"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Package, Filter } from "lucide-react"
import { AddProductModal } from "@/components/admin/AddProductModal"
import { Pagination } from "@/components/admin/Pagination"

// Mock Products Data
const MOCK_PRODUCTS = [
    { id: "PRD-001", name: "Dark Chocolate Truffles", category: "Truffles", price: 1200, stock: 45, image: "/products/truffle.jpg", status: "In Stock" },
    { id: "PRD-002", name: "Gold Leaf Collection", category: "Gift Boxes", price: 2500, stock: 12, image: "/products/gold.jpg", status: "Low Stock" },
    { id: "PRD-003", name: "Milk Chocolate Bar", category: "Bars", price: 350, stock: 0, image: "/products/bar.jpg", status: "Out of Stock" },
    { id: "PRD-004", name: "Hazelnut Pralines", category: "Chocolates", price: 1500, stock: 30, image: "/products/praline.jpg", status: "In Stock" },
    { id: "PRD-005", name: "Valentine's Special Box", category: "Seasonal", price: 3000, stock: 25, image: "/products/valentine.jpg", status: "In Stock" },
    { id: "PRD-006", name: "White Chocolate Hearts", category: "Chocolates", price: 800, stock: 8, image: "/products/hearts.jpg", status: "Low Stock" },
    { id: "PRD-007", name: "Assorted Bonbons", category: "Gift Boxes", price: 1800, stock: 40, image: "/products/bonbons.jpg", status: "In Stock" },
    { id: "PRD-008", name: "Caramel Delights", category: "Chocolates", price: 950, stock: 35, image: "/products/caramel.jpg", status: "In Stock" },
    { id: "PRD-009", name: "Premium Dark 70%", category: "Bars", price: 450, stock: 60, image: "/products/dark70.jpg", status: "In Stock" },
    { id: "PRD-010", name: "Luxury Gift Hamper", category: "Gift Boxes", price: 5000, stock: 5, image: "/products/hamper.jpg", status: "Low Stock" },
    { id: "PRD-011", name: "Mint Chocolate Thins", category: "Chocolates", price: 600, stock: 50, image: "/products/mint.jpg", status: "In Stock" },
    { id: "PRD-012", name: "Ruby Chocolate Bar", category: "Bars", price: 550, stock: 28, image: "/products/ruby.jpg", status: "In Stock" },
]

export default function ProductsPage() {
    const [products, setProducts] = useState(MOCK_PRODUCTS)
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editProduct, setEditProduct] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === "All" || product.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

    const handleAddProduct = (product: any) => {
        if (editProduct) {
            setProducts(products.map(p => p.id === product.id ? product : p))
        } else {
            setProducts([product, ...products])
        }
        setEditProduct(null)
    }

    const handleEdit = (product: any) => {
        setEditProduct(product)
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter(p => p.id !== id))
        }
    }

    const getStockBadge = (status: string) => {
        const styles = {
            "In Stock": "bg-green-500/20 text-green-300 border-green-500/30",
            "Low Stock": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
            "Out of Stock": "bg-red-500/20 text-red-300 border-red-500/30"
        }
        return styles[status as keyof typeof styles] || styles["In Stock"]
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">Products</h1>
                    <p className="text-chocolate-300">Manage your product inventory</p>
                </div>
                <button
                    onClick={() => {
                        setEditProduct(null)
                        setIsModalOpen(true)
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-chocolate-950 rounded-lg transition-all font-bold shadow-lg shadow-gold-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Add New Product
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Products", value: products.length, icon: Package, color: "gold" },
                    { label: "In Stock", value: products.filter(p => p.status === "In Stock").length, icon: Package, color: "green" },
                    { label: "Low Stock", value: products.filter(p => p.status === "Low Stock").length, icon: Package, color: "yellow" },
                    { label: "Out of Stock", value: products.filter(p => p.status === "Out of Stock").length, icon: Package, color: "red" },
                ].map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <Card key={i} className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-chocolate-300">{stat.label}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Filters */}
            <Card className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chocolate-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white placeholder-chocolate-400 focus:outline-none focus:border-gold-500/50 transition-colors"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chocolate-400" />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500/50 transition-colors min-w-[200px]"
                            >
                                <option value="All">All Categories</option>
                                <option value="Chocolates">Chocolates</option>
                                <option value="Gift Boxes">Gift Boxes</option>
                                <option value="Truffles">Truffles</option>
                                <option value="Bars">Bars</option>
                                <option value="Seasonal">Seasonal</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-chocolate-400 text-sm">
                                    <th className="text-left p-4 font-semibold">Product ID</th>
                                    <th className="text-left p-4 font-semibold">Name</th>
                                    <th className="text-left p-4 font-semibold">Category</th>
                                    <th className="text-left p-4 font-semibold">Price</th>
                                    <th className="text-left p-4 font-semibold">Stock</th>
                                    <th className="text-left p-4 font-semibold">Status</th>
                                    <th className="text-right p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="p-4 text-gold-400 font-mono font-bold">{product.id}</td>
                                        <td className="p-4">
                                            <p className="text-white font-semibold">{product.name}</p>
                                        </td>
                                        <td className="p-4 text-chocolate-300">{product.category}</td>
                                        <td className="p-4 text-white font-bold">₹{product.price.toLocaleString()}</td>
                                        <td className="p-4 text-white">{product.stock}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStockBadge(product.status)}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 hover:bg-gold-500/10 text-gold-400 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredProducts.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </CardContent>
            </Card>

            {/* Add/Edit Product Modal */}
            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditProduct(null)
                }}
                onSave={handleAddProduct}
                editProduct={editProduct}
            />
        </div>
    )
}
