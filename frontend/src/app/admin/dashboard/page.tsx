"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Package, Search, Eye, Edit, Trash2, Plus, RefreshCw, Calendar, BarChart3, Activity } from "lucide-react"
import { AddProductModal } from "@/components/admin/AddProductModal"
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal"
import { Pagination } from "@/components/admin/Pagination"
import { API_URL } from "@/lib/config"

// Mock Data

export default function AdminDashboard() {
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [products, setProducts] = useState([])
    const [stats, setStats] = useState([
        { label: "Total Revenue", value: "₹0", change: "+0%", trend: "up", icon: DollarSign, sparkline: [0, 0, 0, 0, 0, 0, 0] },
        { label: "Total Orders", value: "0", change: "+0%", trend: "up", icon: ShoppingBag, sparkline: [0, 0, 0, 0, 0, 0, 0] },
        { label: "Active Customers", value: "0", change: "+0%", trend: "up", icon: Users, sparkline: [0, 0, 0, 0, 0, 0, 0] },
        { label: "Avg. Order Value", value: "₹0", change: "0%", trend: "up", icon: TrendingUp, sparkline: [0, 0, 0, 0, 0, 0, 0] },
    ])
    const [searchQuery, setSearchQuery] = useState("")
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const fetchDashboardData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
            const token = user?.token
            const headers = { 'Authorization': `Bearer ${token}` }

            // Parallel fetching
            const [ordersRes, productsRes, usersRes] = await Promise.all([
                fetch(`${API_URL}/api/orders`, { headers }),
                fetch(`${API_URL}/api/products`, { headers }), // Public usually, but ok
                fetch(`${API_URL}/api/auth/users`, { headers })
            ])

            const ordersData = ordersRes.ok ? await ordersRes.json() : []
            const productsData = productsRes.ok ? await productsRes.json() : []
            const usersData = usersRes.ok ? await usersRes.json() : []

            setOrders(ordersData)
            setProducts(productsData)

            // Calculate Stats
            const totalRevenue = ordersData.reduce((acc: number, order: any) => acc + (order.totalPrice || 0), 0)
            const totalOrders = ordersData.length
            const activeCustomers = usersData.filter((u: any) => (u.orderCount || 0) > 0).length
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

            setStats([
                { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+0%", trend: "up", icon: DollarSign, sparkline: [40, 45, 42, 48, 50, 55, 52] },
                { label: "Total Orders", value: totalOrders.toString(), change: "+0%", trend: "up", icon: ShoppingBag, sparkline: [30, 35, 38, 40, 42, 45, 48] },
                { label: "Active Customers", value: activeCustomers.toString(), change: "+0%", trend: "up", icon: Users, sparkline: [20, 22, 25, 28, 30, 35, 38] },
                { label: "Avg. Order Value", value: `₹${avgOrderValue.toFixed(0)}`, change: "0%", trend: "up", icon: TrendingUp, sparkline: [50, 48, 45, 44, 42, 40, 38] },
            ])

        } catch (error) {
            console.error("Dashboard fetch error:", error)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])



    const filteredOrders = orders.filter((order: any) => {
        const customerName = order.user?.name || "Unknown"
        const orderId = order._id.toUpperCase()
        const paymentId = order.paymentResult?.id?.toLowerCase() || ""

        return customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            orderId.includes(searchQuery.toUpperCase()) ||
            paymentId.includes(searchQuery.toLowerCase())
    })

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
        const mappedOrder = {
            ...order,
            id: order._id,
            customer: order.user?.name,
            email: order.user?.email,
            phone: order.shippingAddress?.phone || "N/A",
            address: order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city} - ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}` : "Address not available",
            items: order.orderItems?.map((item: any) => ({
                ...item,
                quantity: item.qty
            })) || [],
            total: `₹${(order.totalPrice || 0).toLocaleString()}`,
            date: new Date(order.createdAt).toLocaleDateString()
        }
        setSelectedOrder(mappedOrder)
        setIsOrderModalOpen(true)
    }

    const handleDeleteOrder = (id: string) => {
        if (confirm("Are you sure you want to delete this order?")) {
            // Add API call here
            setOrders(orders.filter((o: any) => o._id !== id))
        }
    }

    const handleViewAnalytics = () => {
        router.push("/admin/dashboard/orders")
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
                {stats.map((stat, i) => {
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

            {/* Quick Actions & Alerts - Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        {products
                            .filter((p: any) => p.countInStock <= 15)
                            .slice(0, 3) // Show top 3 alerts
                            .map((item: any, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all duration-200 group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${item.countInStock === 0 ? 'bg-red-500/30' : 'bg-red-500/20'}`}>
                                            <Package className="w-4 h-4 text-red-300" />
                                        </div>
                                        <div>
                                            <span className="text-white text-sm font-semibold block">{item.name}</span>
                                            <span className="text-xs text-red-300 font-bold">Stock: {item.countInStock}</span>
                                        </div>
                                    </div>
                                    <button className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-bold transition-colors">
                                        Reorder
                                    </button>
                                </div>
                            ))}
                    </CardContent>
                </Card>
            </div> */}


            {/* Recent Orders - Full Width */}
            <Card className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10 backdrop-blur-sm">
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
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-chocolate-400 text-sm bg-white/5">
                                    <th className="py-4 px-6 font-semibold whitespace-nowrap">Order ID</th>
                                    <th className="py-4 px-6 font-semibold whitespace-nowrap">Payment ID</th>
                                    <th className="py-4 px-6 font-semibold whitespace-nowrap">Customer</th>
                                    <th className="py-4 px-6 font-semibold whitespace-nowrap">Status</th>
                                    <th className="py-4 px-6 font-semibold whitespace-nowrap">Total</th>
                                    <th className="py-4 px-6 font-semibold whitespace-nowrap">Time</th>
                                    <th className="py-4 px-6 font-semibold text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {paginatedOrders.map((order: any) => (
                                    <tr key={order._id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-all duration-200 group">
                                        <td className="py-4 px-6 text-gold-400 font-mono font-bold whitespace-nowrap">ORD-{order._id.substring(order._id.length - 5).toUpperCase()}</td>
                                        <td className="py-4 px-6 font-mono text-xs text-white/70 whitespace-nowrap">
                                            {order.paymentResult?.id ? (
                                                <span className="bg-white/5 px-2 py-1 rounded border border-white/10">{order.paymentResult.id}</span>
                                            ) : (
                                                <span className="text-white/30">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-white font-semibold">{order.user?.name || "Unknown"}</span>
                                                <span className="text-chocolate-400 text-xs">{order.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
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
                                        <td className="py-4 px-6 text-white font-bold text-base whitespace-nowrap">₹{(order.totalPrice || 0).toLocaleString()}</td>
                                        <td className="py-4 px-6 text-chocolate-400 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value
                                                        setOrders(orders.map((o: any) =>
                                                            o._id === order._id ? { ...o, status: newStatus } : o
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
                                                    onClick={() => handleDeleteOrder(order._id)}
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
