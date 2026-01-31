"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Users, TrendingUp, UserPlus } from "lucide-react"
import { Pagination } from "@/components/admin/Pagination"

// Mock Customers Data
const MOCK_CUSTOMERS = Array.from({ length: 50 }, (_, i) => ({
    id: `CUST-${String(i + 1).padStart(3, '0')}`,
    name: ["Alice Freeman", "Josef Miller", "Sarah Smith", "Mike Johnson", "Emma Davis", "John Doe", "Jane Smith", "Robert Brown", "Lisa Anderson", "David Wilson"][i % 10],
    email: ["alice@example.com", "josef@example.com", "sarah@example.com", "mike@example.com", "emma@example.com", "john@example.com", "jane@example.com", "robert@example.com", "lisa@example.com", "david@example.com"][i % 10],
    orders: Math.floor(Math.random() * 20) + 1,
    totalSpent: Math.floor(Math.random() * 50000) + 5000,
    joinDate: `${Math.floor(Math.random() * 28) + 1} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][Math.floor(Math.random() * 6)]} ${2023 + Math.floor(Math.random() * 2)}`
}))

export default function CustomersPage() {
    const [customers] = useState(MOCK_CUSTOMERS)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20

    // Filter customers
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Pagination
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

    // Stats
    const totalCustomers = customers.length
    const activeCustomers = customers.filter(c => c.orders > 5).length
    const newThisMonth = customers.filter(c => c.joinDate.includes("Jan 2024")).length

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
                                    <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="p-4 text-gold-400 font-mono font-bold">{customer.id}</td>
                                        <td className="p-4 text-white font-semibold">{customer.name}</td>
                                        <td className="p-4 text-chocolate-300">{customer.email}</td>
                                        <td className="p-4 text-white">{customer.orders}</td>
                                        <td className="p-4 text-white font-bold">₹{customer.totalSpent.toLocaleString()}</td>
                                        <td className="p-4 text-chocolate-400">{customer.joinDate}</td>
                                    </tr>
                                ))}
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
