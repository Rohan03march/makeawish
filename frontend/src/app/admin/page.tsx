"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Package, Search, Eye, Edit, Trash2, Plus, RefreshCw, Calendar, BarChart3, Activity } from "lucide-react"
import { AddProductModal } from "@/components/admin/AddProductModal"
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal"
import { Pagination } from "@/components/admin/Pagination"

// Mock Data
const STATS = [
    { label: "Total Revenue", value: "₹12,45,000", change: "+12.5%", trend: "up", icon: DollarSign, sparkline: [40, 45, 42, 48, 50, 55, 52] },
    { label: "Total Orders", value: "1,245", change: "+8.2%", trend: "up", icon: ShoppingBag, sparkline: [30, 35, 38, 40, 42, 45, 48] },
    { label: "Active Customers", value: "892", change: "+15.3%", trend: "up", icon: Users, sparkline: [20, 22, 25, 28, 30, 35, 38] },
    { label: "Avg. Order Value", value: "₹2,850", change: "-2.1%", trend: "down", icon: TrendingUp, sparkline: [50, 48, 45, 44, 42, 40, 38] },
]

const INITIAL_ORDERS = [
    { id: "ORD-001", customer: "Alice Freeman", email: "alice@example.com", total: "₹4,200", status: "Processing", date: "2 mins ago" },
    { id: "ORD-002", customer: "Josef Miller", email: "josef@example.com", total: "₹8,500", status: "Shipped", date: "1 hour ago" },
    { id: "ORD-003", customer: "Sarah Smith", email: "sarah@example.com", total: "₹2,100", status: "Delivered", date: "5 hours ago" },
    { id: "ORD-004", customer: "Mike Johnson", email: "mike@example.com", total: "₹12,000", status: "Processing", date: "Yesterday" },
    { id: "ORD-005", customer: "Emma Davis", email: "emma@example.com", total: "₹5,600", status: "Shipped", date: "Yesterday" },
    { id: "ORD-006", customer: "Robert Brown", email: "robert@example.com", total: "₹3,400", status: "Delivered", date: "2 days ago" },
    { id: "ORD-007", customer: "Lisa Anderson", email: "lisa@example.com", total: "₹7,800", status: "Processing", date: "2 days ago" },
    { id: "ORD-008", customer: "David Wilson", email: "david@example.com", total: "₹6,200", status: "Shipped", date: "3 days ago" },
]

const REVENUE_DATA = [
    { day: "Mon", revenue: 8500 },
    { day: "Tue", revenue: 12000 },
    { day: "Wed", revenue: 9800 },
    { day: "Thu", revenue: 15200 },
    { day: "Fri", revenue: 18500 },
    { day: "Sat", revenue: 22000 },
    { day: "Sun", revenue: 19500 },
]

export default function AdminDashboard() {
    const router = useRouter()
    const [orders, setOrders] = useState(INITIAL_ORDERS)
    const [searchQuery, setSearchQuery] = useState("")
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.revenue))

    const filteredOrders = orders.filter(order =>
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

    const handleAddProduct = (product: any) => {
        alert(`Product "${product.name}" added successfully!`)
        setIsProductModalOpen(false)
        // In a real app, this would save to database
    }

    const handleViewOrder = (order: any) => {
        setSelectedOrder(order)
        setIsOrderModalOpen(true)
    }

    const handleDeleteOrder = (id: string) => {
        if (confirm("Are you sure you want to delete this order?")) {
            setOrders(orders.filter(o => o.id !== id))
        }
    }

    const handleViewAnalytics = () => {
        router.push("/admin/orders")
    }

    return (
        <div className="space-y-8">
            {/* Header with Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-white mb-2 bg-gradient-to-r from-white to-chocolate-300 bg-clip-text text-transparent">Dashboard Overview</h1>
                    <p className="text-chocolate-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                        Welcome back, Admin. Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-chocolate-800/50 hover:bg-chocolate-800 text-chocolate-200 rounded-lg transition-all border border-white/5">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Last 7 days</span>
                    </button>
                    <button className="p-2 bg-chocolate-800/50 hover:bg-chocolate-800 text-chocolate-200 rounded-lg transition-all border border-white/5 hover:rotate-180 duration-500">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats Grid with Enhanced Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <Card key={i} className="group bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10 backdrop-blur-sm hover:border-gold-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/10 cursor-pointer overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Icon className="w-6 h-6 text-gold-400 group-hover:text-gold-300" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full shadow-lg ${stat.trend === 'up' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                        {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {stat.change}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-gold-300 transition-colors">{stat.value}</h3>
                                <p className="text-sm text-chocolate-300 mb-3">{stat.label}</p>

                                {/* Sparkline */}
                                <div className="flex items-end gap-1 h-8 mt-4">
                                    {stat.sparkline.map((value, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex-1 rounded-t transition-all duration-300 ${stat.trend === 'up' ? 'bg-green-500/30 group-hover:bg-green-400/50' : 'bg-red-500/30 group-hover:bg-red-400/50'}`}
                                            style={{ height: `${(value / 60) * 100}%` }}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Revenue Chart */}
            <Card className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-serif text-white flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-gold-400" />
                            Weekly Revenue
                        </CardTitle>
                        <p className="text-sm text-chocolate-300 mt-1">Revenue trends for the last 7 days</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between gap-4 h-64 px-4">
                        {REVENUE_DATA.map((data, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                                <div className="relative w-full flex items-end justify-center h-full">
                                    <div
                                        className="w-full bg-gradient-to-t from-gold-500 to-gold-400 rounded-t-lg transition-all duration-500 hover:from-gold-400 hover:to-gold-300 cursor-pointer shadow-lg hover:shadow-gold-500/50 relative group"
                                        style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-chocolate-950 text-gold-300 px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            ₹{data.revenue.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-chocolate-400 font-medium">{data.day}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders with Search and Pagination */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <CardTitle className="text-2xl font-serif text-white">Recent Orders</CardTitle>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chocolate-400" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-chocolate-800/50 border border-white/10 rounded-lg text-white placeholder-chocolate-400 focus:outline-none focus:border-gold-500/50 transition-colors text-sm"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-chocolate-400 text-sm">
                                        <th className="pb-4 font-semibold pl-4">Order ID</th>
                                        <th className="pb-4 font-semibold">Customer</th>
                                        <th className="pb-4 font-semibold">Status</th>
                                        <th className="pb-4 font-semibold">Total</th>
                                        <th className="pb-4 font-semibold">Time</th>
                                        <th className="pb-4 font-semibold text-right pr-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {paginatedOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-all duration-200 group">
                                            <td className="py-4 pl-4 text-gold-400 font-mono font-bold">{order.id}</td>
                                            <td className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-semibold">{order.customer}</span>
                                                    <span className="text-chocolate-400 text-xs">{order.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                                    order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                                        'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-400' :
                                                        order.status === 'Shipped' ? 'bg-blue-400' : 'bg-gold-400'
                                                        }`} />
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-white font-bold text-base">{order.total}</td>
                                            <td className="py-4 text-chocolate-400">{order.date}</td>
                                            <td className="py-4 pr-4">
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
                                                        onClick={() => handleViewOrder(order)}
                                                        className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOrder(order.id)}
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
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={filteredOrders.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions & Alerts */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-gold-500 via-gold-500 to-gold-600 border-0 text-chocolate-950 shadow-2xl shadow-gold-500/20 hover:shadow-gold-500/40 transition-all duration-300 hover:scale-105">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-chocolate-950/20 rounded-lg">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold">Quick Actions</h3>
                            </div>
                            <p className="mb-6 opacity-90 font-medium leading-relaxed">Streamline your workflow with these shortcuts</p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setIsProductModalOpen(true)}
                                    className="w-full bg-chocolate-950 text-gold-400 py-3 rounded-xl font-bold hover:bg-chocolate-900 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add New Product
                                </button>
                                <button
                                    onClick={handleViewAnalytics}
                                    className="w-full bg-chocolate-950/80 text-gold-400 py-3 rounded-xl font-bold hover:bg-chocolate-900 transition-all flex items-center justify-center gap-2"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    View Analytics
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-serif text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-red-400" />
                                Inventory Alerts
                                <span className="ml-auto bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full font-bold">2</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { name: "70% Dark Cocoa", stock: "Low (12kg)", priority: "medium" },
                                { name: "Gold Leaf Sheets", stock: "Critical (2 packs)", priority: "high" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all duration-200 group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${item.priority === 'high' ? 'bg-red-500/30' : 'bg-red-500/20'}`}>
                                            <Package className="w-4 h-4 text-red-300" />
                                        </div>
                                        <div>
                                            <span className="text-white text-sm font-semibold block">{item.name}</span>
                                            <span className="text-xs text-red-300 font-bold">{item.stock}</span>
                                        </div>
                                    </div>
                                    <button className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-bold transition-colors">
                                        Reorder
                                    </button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modals */}
            <AddProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSave={handleAddProduct}
            />

            <OrderDetailsModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    )
}
