"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Eye, Edit, Trash2, Download, Filter } from "lucide-react"
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal"
import { Pagination } from "@/components/admin/Pagination"

// Mock Orders Data
const MOCK_ORDERS = Array.from({ length: 45 }, (_, i) => ({
    id: `ORD-${String(i + 1).padStart(3, '0')}`,
    customer: ["Alice Freeman", "Josef Miller", "Sarah Smith", "Mike Johnson", "Emma Davis", "John Doe", "Jane Smith"][i % 7],
    email: ["alice@example.com", "josef@example.com", "sarah@example.com", "mike@example.com", "emma@example.com", "john@example.com", "jane@example.com"][i % 7],
    items: Math.floor(Math.random() * 5) + 1,
    total: `₹${(Math.random() * 10000 + 1000).toFixed(0).toLocaleString()}`,
    status: ["Processing", "Shipped", "Delivered", "Cancelled"][Math.floor(Math.random() * 4)],
    date: `${Math.floor(Math.random() * 30) + 1} ${["Jan", "Feb", "Mar"][Math.floor(Math.random() * 3)]} 2024`
}))

export default function OrdersPage() {
    const [orders, setOrders] = useState(MOCK_ORDERS)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 15

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "All" || order.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

    const handleView = (order: any) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this order?")) {
            setOrders(orders.filter(o => o.id !== id))
        }
    }

    const handleExport = () => {
        alert("Exporting orders to CSV...")
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            "Processing": "bg-gold-500/20 text-gold-300 border-gold-500/30",
            "Shipped": "bg-blue-500/20 text-blue-300 border-blue-500/30",
            "Delivered": "bg-green-500/20 text-green-300 border-green-500/30",
            "Cancelled": "bg-red-500/20 text-red-300 border-red-500/30"
        }
        return styles[status as keyof typeof styles] || styles["Processing"]
    }

    const statusCounts = {
        All: orders.length,
        Processing: orders.filter(o => o.status === "Processing").length,
        Shipped: orders.filter(o => o.status === "Shipped").length,
        Delivered: orders.filter(o => o.status === "Delivered").length,
        Cancelled: orders.filter(o => o.status === "Cancelled").length,
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">Orders</h1>
                    <p className="text-chocolate-300">Manage and track all orders</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-6 py-3 bg-chocolate-800/50 hover:bg-chocolate-800 text-white rounded-lg transition-all font-semibold border border-white/10"
                >
                    <Download className="w-5 h-5" />
                    Export CSV
                </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${statusFilter === status
                            ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-chocolate-950 shadow-lg'
                            : 'bg-chocolate-800/50 text-chocolate-300 hover:bg-chocolate-800 border border-white/10'
                            }`}
                    >
                        {status} ({count})
                    </button>
                ))}
            </div>

            {/* Search */}
            <Card className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10">
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chocolate-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID or customer name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white placeholder-chocolate-400 focus:outline-none focus:border-gold-500/50 transition-colors"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-chocolate-400 text-sm">
                                    <th className="text-left p-4 font-semibold">Order ID</th>
                                    <th className="text-left p-4 font-semibold">Customer</th>
                                    <th className="text-left p-4 font-semibold">Items</th>
                                    <th className="text-left p-4 font-semibold">Total</th>
                                    <th className="text-left p-4 font-semibold">Status</th>
                                    <th className="text-left p-4 font-semibold">Date</th>
                                    <th className="text-right p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="p-4 text-gold-400 font-mono font-bold">{order.id}</td>
                                        <td className="p-4">
                                            <div>
                                                <p className="text-white font-semibold">{order.customer}</p>
                                                <p className="text-chocolate-400 text-xs">{order.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-white">{order.items} items</td>
                                        <td className="p-4 text-white font-bold text-base">{order.total}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${getStatusBadge(order.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-400' :
                                                    order.status === 'Shipped' ? 'bg-blue-400' :
                                                        order.status === 'Cancelled' ? 'bg-red-400' : 'bg-gold-400'
                                                    }`} />
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-chocolate-400">{order.date}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value
                                                        setOrders(orders.map(o =>
                                                            o.id === order.id ? { ...o, status: newStatus } : o
                                                        ))
                                                    }}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 transition-all cursor-pointer border ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-300 border-green-500/30 focus:ring-green-500/50' :
                                                        order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 focus:ring-blue-500/50' :
                                                            order.status === 'Cancelled' ? 'bg-red-500/20 text-red-300 border-red-500/30 focus:ring-red-500/50' :
                                                                'bg-gold-500/20 text-gold-300 border-gold-500/30 focus:ring-gold-500/50'
                                                        }`}
                                                    title="Change Status"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="Processing" className="bg-chocolate-900 text-gold-300">Processing</option>
                                                    <option value="Shipped" className="bg-chocolate-900 text-blue-300">Shipped</option>
                                                    <option value="Delivered" className="bg-chocolate-900 text-green-300">Delivered</option>
                                                    <option value="Cancelled" className="bg-chocolate-900 text-red-300">Cancelled</option>
                                                </select>
                                                <button
                                                    onClick={() => handleView(order)}
                                                    className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
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
                        totalItems={filteredOrders.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </CardContent>
            </Card>

            {/* Order Details Modal */}
            <OrderDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    )
}
