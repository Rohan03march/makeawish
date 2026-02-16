"use client"

import { X, Package, MapPin, CreditCard, Clock, Phone, Mail, User } from "lucide-react"

interface OrderDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    order: any
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
    if (!isOpen || !order) return null

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#1a0f0a] rounded-2xl max-w-4xl w-full border border-gold-500/20 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-white/5 bg-[#1a0f0a] sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="bg-gold-500/10 p-3 rounded-xl border border-gold-500/20">
                            <Package className="w-8 h-8 text-gold-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-serif font-bold text-white">Order Details</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-gold-500/10 text-gold-400 border-gold-500/20'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-chocolate-300 text-sm mt-1 flex items-center gap-2">
                                <span className="font-mono text-white/60">#{order.id.slice(-6).toUpperCase()}</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span>{order.date}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Top Grid: Customer & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Customer Info Card */}
                        <div className="md:col-span-2 bg-white/[0.03] rounded-2xl p-6 border border-white/5">
                            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <User className="w-4 h-4" /> Customer Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <p className="text-xs text-white/40 uppercase mb-1">Full Name</p>
                                    <p className="text-white font-medium text-lg">{order.customer}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 uppercase mb-1">Phone Number</p>
                                    <p className="text-white font-medium font-mono">{order.phone || "N/A"}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-white/40 uppercase mb-1">Email Address</p>
                                    <p className="text-white font-medium break-all">{order.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address Card */}
                        <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 flex flex-col h-full">
                            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Shipping To
                            </h3>
                            <p className="text-white/80 leading-relaxed text-sm flex-1">
                                {order.address || <span className="text-white/30 italic">Address not available</span>}
                            </p>
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-3 text-sm text-white/60">
                                    <CreditCard className="w-4 h-4" />
                                    <span>Payment: <span className="text-white font-medium">Prepaid</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="bg-white/[0.03] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Order Items</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {(order.items || []).map((item: any, idx: number) => (
                                <div key={idx} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="w-16 h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package className="w-8 h-8 text-white/20" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{item.name}</p>
                                        <p className="text-sm text-white/40 mt-1">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>

                                        {/* Custom Builder Details */}
                                        {item.customDetails && (
                                            <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10 text-xs text-chocolate-200">
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                    {item.customDetails.base && <p><span className="text-gold-500/80">Base:</span> {item.customDetails.base}</p>}
                                                    {item.customDetails.filling && <p><span className="text-gold-500/80">Filling:</span> {item.customDetails.filling}</p>}
                                                    {item.customDetails.shape && <p><span className="text-gold-500/80">Shape:</span> {item.customDetails.shape}</p>}
                                                    {item.customDetails.text && <p className="col-span-2 border-t border-white/10 pt-1 mt-1"><span className="text-gold-500/80">Message:</span> "{item.customDetails.text}"</p>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gold-400 font-bold font-mono">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-black/20 p-6 flex justify-end">
                            <div className="text-right space-y-1">
                                <p className="text-sm text-white/40">Total Amount</p>
                                <p className="text-3xl font-serif font-bold text-gold-400">{order.total}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gold-400" /> Order Status
                        </h3>
                        <div className="relative flex justify-between">
                            {/* Connecting Line */}
                            <div className="absolute top-2.5 left-0 w-full h-0.5 bg-white/10">
                                <div
                                    className="h-full bg-gold-500 transition-all duration-500"
                                    style={{
                                        width: order.status === 'Delivered' ? '100%' :
                                            order.status === 'Shipped' ? '66%' :
                                                '33%'
                                    }}
                                />
                            </div>

                            {[
                                { label: "Placed", active: true },
                                { label: "Processing", active: true },
                                { label: "Shipped", active: order.status === 'Shipped' || order.status === 'Delivered' },
                                { label: "Delivered", active: order.status === 'Delivered' }
                            ].map((step, idx) => (
                                <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-[#1a0f0a] transition-all duration-300 ${step.active ? 'border-gold-500 text-gold-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'border-white/20 text-transparent'
                                        }`}>
                                        <div className={`w-2 h-2 rounded-full ${step.active ? 'bg-gold-500' : 'bg-transparent'}`} />
                                    </div>
                                    <span className={`text-xs font-medium uppercase tracking-wider ${step.active ? 'text-white' : 'text-white/30'
                                        }`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#1a0f0a] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    )
}
