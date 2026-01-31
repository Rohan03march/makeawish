"use client"

import { X, Package, MapPin, CreditCard, Clock } from "lucide-react"

interface OrderDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    order: any
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
    if (!isOpen || !order) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-chocolate-900 to-chocolate-950 rounded-2xl max-w-3xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-chocolate-900/95 backdrop-blur-sm">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-white">Order Details</h2>
                        <p className="text-chocolate-300 text-sm mt-1">Order ID: <span className="text-gold-400 font-mono">{order.id}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-chocolate-300 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-chocolate-800/30 rounded-xl p-5 border border-white/5">
                        <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-gold-400" />
                            Customer Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-chocolate-400">Name</p>
                                <p className="text-white font-semibold">{order.customer}</p>
                            </div>
                            <div>
                                <p className="text-sm text-chocolate-400">Email</p>
                                <p className="text-white font-semibold">{order.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-chocolate-800/30 rounded-xl p-5 border border-white/5">
                        <h3 className="text-lg font-serif font-bold text-white mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {(order.items || [
                                { name: "Dark Chocolate Truffles", quantity: 2, price: 1200 },
                                { name: "Gold Leaf Collection", quantity: 1, price: 2000 }
                            ]).map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-chocolate-900/40 rounded-lg">
                                    <div>
                                        <p className="text-white font-semibold">{item.name}</p>
                                        <p className="text-sm text-chocolate-400">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="text-gold-400 font-bold">₹{item.price.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-chocolate-800/30 rounded-xl p-5 border border-white/5">
                        <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gold-400" />
                            Shipping Address
                        </h3>
                        <p className="text-white leading-relaxed">
                            {order.address || "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001, India"}
                        </p>
                    </div>

                    {/* Payment & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-chocolate-800/30 rounded-xl p-5 border border-white/5">
                            <h3 className="text-sm font-semibold text-chocolate-400 mb-2 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payment Status
                            </h3>
                            <p className="text-white font-bold">Paid</p>
                            <p className="text-2xl font-bold text-gold-400 mt-2">{order.total}</p>
                        </div>
                        <div className="bg-chocolate-800/30 rounded-xl p-5 border border-white/5">
                            <h3 className="text-sm font-semibold text-chocolate-400 mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Order Status
                            </h3>
                            <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                    order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                        'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                                }`}>
                                {order.status}
                            </span>
                            <p className="text-sm text-chocolate-400 mt-2">{order.date}</p>
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="bg-chocolate-800/30 rounded-xl p-5 border border-white/5">
                        <h3 className="text-lg font-serif font-bold text-white mb-4">Order Timeline</h3>
                        <div className="space-y-3">
                            {[
                                { status: "Order Placed", date: order.date, completed: true },
                                { status: "Processing", date: "In progress", completed: order.status !== "Processing" },
                                { status: "Shipped", date: order.status === "Shipped" || order.status === "Delivered" ? "Yesterday" : "Pending", completed: order.status === "Shipped" || order.status === "Delivered" },
                                { status: "Delivered", date: order.status === "Delivered" ? "Today" : "Pending", completed: order.status === "Delivered" }
                            ].map((step, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${step.completed ? 'bg-green-400' : 'bg-chocolate-600'}`} />
                                    <div className="flex-1">
                                        <p className={`font-semibold ${step.completed ? 'text-white' : 'text-chocolate-400'}`}>
                                            {step.status}
                                        </p>
                                        <p className="text-sm text-chocolate-400">{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 bg-chocolate-900/50">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-chocolate-950 rounded-lg transition-all font-bold shadow-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
