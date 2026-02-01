"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Eye, Edit, Trash2, Download, Filter, Loader2 } from "lucide-react"
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal"
import { Pagination } from "@/components/admin/Pagination"
import { API_URL } from "@/lib/config"

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    interface Order {
        _id: string;
        user?: { name: string; email: string };
        orderItems: any[];
        totalPrice: number;
        status: string;
        createdAt: string;
        paymentResult?: { id: string; status: string; update_time: string; email_address: string };
    }

    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 15

    const fetchOrders = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
            const token = user?.token

            const res = await fetch(`${API_URL}/api/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setOrders(data)
            }
        } catch (error) {
            console.error("Failed to fetch orders", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    // Filter orders
    const filteredOrders = orders.filter((order: Order) => {
        const customerName = order.user?.name || "Unknown"
        const orderId = order._id.toUpperCase()

        const paymentId = order.paymentResult?.id?.toLowerCase() || ""
        const formattedOrderId = `ORD-${order._id.slice(-5).toUpperCase()}`

        const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            orderId.includes(searchQuery.toUpperCase()) ||
            formattedOrderId.includes(searchQuery.toUpperCase()) ||
            paymentId.includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "All" || order.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

    const handleView = (order: any) => {
        // Map backend order structure to what modal expects if different
        // Currently modal might expect 'id', 'customer', etc.
        // We'll pass the full object and let the modal handle or map it briefly here
        const mappedOrder = {
            ...order,
            id: order._id, // Modal might use 'id'
            customer: order.user?.name,
            email: order.user?.email,
            phone: order.shippingAddress?.phone || "N/A",
            address: order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city} - ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}` : "N/A",
            items: order.orderItems.map((item: any) => ({
                ...item,
                quantity: item.qty
            })),
            total: `₹${order.totalPrice.toLocaleString()}`,
            date: new Date(order.createdAt).toLocaleDateString()
        }
        setSelectedOrder(mappedOrder)
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this order?")) {
            // Implement delete API call here
            setOrders(orders.filter((o: Order) => o._id !== id))
        }
    }

    const handleExport = () => {
        alert("Exporting orders to CSV...")
    }

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
            const token = user?.token

            const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (res.ok) {
                setOrders(orders.map((o: Order) =>
                    o._id === id ? { ...o, status: newStatus } : o
                ))
            }
        } catch (error) {
            console.error("Failed to update status", error)
        }
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            "Placed": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
            "Processing": "bg-gold-500/20 text-gold-300 border-gold-500/30",
            "Shipped": "bg-blue-500/20 text-blue-300 border-blue-500/30",
            "Delivered": "bg-green-500/20 text-green-300 border-green-500/30",
            "Cancelled": "bg-red-500/20 text-red-300 border-red-500/30"
        }
        return styles[status as keyof typeof styles] || styles["Processing"]
    }

    const statusCounts = {
        All: orders.length,
        Placed: orders.filter((o: Order) => o.status === "Placed").length,
        Processing: orders.filter((o: Order) => o.status === "Processing").length,
        Shipped: orders.filter((o: Order) => o.status === "Shipped").length,
        Delivered: orders.filter((o: Order) => o.status === "Delivered").length,
        Cancelled: orders.filter((o: Order) => o.status === "Cancelled").length,
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
            </div>
        )
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
                                    <th className="text-left p-4 font-semibold">Payment ID</th>
                                    <th className="text-left p-4 font-semibold">Customer</th>
                                    <th className="text-left p-4 font-semibold">Items</th>
                                    <th className="text-left p-4 font-semibold">Total</th>
                                    <th className="text-left p-4 font-semibold">Status</th>
                                    <th className="text-left p-4 font-semibold">Date</th>
                                    <th className="text-right p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOrders.map((order: any) => (
                                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="p-4 text-gold-400 font-mono font-bold">ORD-{order._id.substring(order._id.length - 5).toUpperCase()}</td>
                                        <td className="p-4 font-mono text-xs text-white/70 whitespace-nowrap">
                                            {order.paymentResult?.id ? (
                                                <span className="bg-white/5 px-2 py-1 rounded border border-white/10">{order.paymentResult.id}</span>
                                            ) : (
                                                <span className="text-white/30">-</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <p className="text-white font-semibold">{order.user?.name || "Unknown"}</p>
                                                <p className="text-chocolate-400 text-xs">{order.user?.email || "No Email"}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-white">{order.orderItems.length} items</td>
                                        <td className="p-4 text-white font-bold text-base">₹{order.totalPrice.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${getStatusBadge(order.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-400' :
                                                    order.status === 'Shipped' ? 'bg-blue-400' :
                                                        order.status === 'Placed' ? 'bg-indigo-400' :
                                                            order.status === 'Cancelled' ? 'bg-red-400' : 'bg-gold-400'
                                                    }`} />
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-chocolate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 transition-all cursor-pointer border ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-300 border-green-500/30 focus:ring-green-500/50' :
                                                        order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 focus:ring-blue-500/50' :
                                                            order.status === 'Placed' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 focus:ring-indigo-500/50' :
                                                                order.status === 'Cancelled' ? 'bg-red-500/20 text-red-300 border-red-500/30 focus:ring-red-500/50' :
                                                                    'bg-gold-500/20 text-gold-300 border-gold-500/30 focus:ring-gold-500/50'
                                                        }`}
                                                    title="Change Status"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="Placed" className="bg-chocolate-900 text-indigo-300">Placed</option>
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
                                                    onClick={() => handleDelete(order._id)}
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
