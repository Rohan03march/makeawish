"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Users, TrendingUp, UserPlus, Loader2 } from "lucide-react"
import { Pagination } from "@/components/admin/Pagination"
import { API_URL } from "@/lib/config"

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20

    const fetchCustomers = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
            const token = user?.token

            const res = await fetch(`${API_URL}/api/auth/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                // Transform data if necessary, or just use as is
                // Assuming data has _id, name, email, createdAt
                setCustomers(data)
            }
        } catch (error) {
            console.error("Failed to fetch customers", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    // Filter customers
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer._id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Pagination
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

    // Stats
    const totalCustomers = customers.length
    const activeCustomers = customers.filter(c => (c.orderCount || 0) > 0).length
    const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' })
    const newThisMonth = customers.filter(c => {
        const joinDate = new Date(c.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' })
        return joinDate === currentMonth
    }).length

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
            <div>
                <h1 className="text-4xl font-serif font-bold text-white mb-2">Customers</h1>
                <p className="text-chocolate-300">Manage your customer base</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Customers", value: totalCustomers, icon: Users, color: "gold" },
                    { label: "Active Customers", value: activeCustomers, icon: TrendingUp, color: "green" },
                    { label: "New This Month", value: newThisMonth, icon: UserPlus, color: "blue" },
                ].map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <Card key={i} className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10 hover:border-gold-500/30 transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 bg-${stat.color}-500/20 rounded-xl`}>
                                        <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-chocolate-300">{stat.label}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Search */}
            <Card className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10">
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chocolate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or customer ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-chocolate-800/50 border border-white/10 rounded-lg text-white placeholder-chocolate-400 focus:outline-none focus:border-gold-500/50 transition-colors"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Customers Table */}
            <Card className="bg-gradient-to-br from-chocolate-900/60 to-chocolate-900/40 border-white/10">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-chocolate-400 text-sm">
                                    <th className="text-left p-4 font-semibold">Customer ID</th>
                                    <th className="text-left p-4 font-semibold">Name</th>
                                    <th className="text-left p-4 font-semibold">Email</th>
                                    <th className="text-left p-4 font-semibold">Orders</th>
                                    <th className="text-left p-4 font-semibold">Total Spent</th>
                                    <th className="text-left p-4 font-semibold">Join Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCustomers.map((customer) => (
                                    <tr key={customer._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="p-4 text-gold-400 font-mono font-bold text-xs">CID-{customer._id.substring(customer._id.length - 6).toUpperCase()}</td>
                                        <td className="p-4 text-white font-semibold">{customer.name}</td>
                                        <td className="p-4 text-chocolate-300">{customer.email}</td>
                                        <td className="p-4 text-white">{customer.orderCount || 0}</td>
                                        <td className="p-4 text-white font-bold">₹{(customer.totalSpent || 0).toLocaleString()}</td>
                                        <td className="p-4 text-chocolate-400">{new Date(customer.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {paginatedCustomers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-chocolate-400">
                                            No customers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredCustomers.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
