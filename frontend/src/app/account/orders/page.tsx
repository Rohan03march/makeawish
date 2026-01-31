import { Package, ChevronRight, MapPin, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"

// Mock data for orders
const orders = [
    {
        id: "ORD-2024-001",
        date: "Jan 15, 2024",
        status: "Delivered",
        total: 1250,
        items: [
            { name: "Signature Truffle Collection", quantity: 1 },
            { name: "Dark Chocolate Hazelnut Bar", quantity: 2 }
        ],
        shippingAddress: "123 Chocolate Lane, Sweet City"
    },
    {
        id: "ORD-2024-002",
        date: "Feb 02, 2024",
        status: "Processing",
        total: 850,
        items: [
            { name: "Assorted Pralines box", quantity: 1 }
        ],
        shippingAddress: "456 Cocoa Ave, Dessert Town"
    }
]

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-white">Order History</h2>
            </div>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-chocolate-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-gold-500/30 transition-colors">
                        {/* Order Header */}
                        <div className="p-4 sm:p-6 border-b border-white/5 bg-white/5 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-4 sm:gap-8">
                                <div>
                                    <p className="text-xs text-chocolate-300 uppercase tracking-wider font-medium">Order Placed</p>
                                    <p className="text-sm text-white font-medium mt-1">{order.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-chocolate-300 uppercase tracking-wider font-medium">Total Amount</p>
                                    <p className="text-sm text-gold-400 font-bold mt-1">₹{order.total.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-chocolate-300 uppercase tracking-wider font-medium">Ship To</p>
                                    <div className="flex items-center gap-1 text-sm text-white mt-1 group cursor-help relative">
                                        <span className="truncate max-w-[150px]">John Doe</span>
                                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-max bg-black text-xs p-2 rounded z-10">
                                            {order.shippingAddress}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400' :
                                        order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400' :
                                            'bg-yellow-500/10 text-yellow-400'
                                    }`}>
                                    {order.status}
                                </span>
                                <p className="text-sm text-chocolate-400 font-mono hidden sm:block">#{order.id}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 sm:p-6">
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-chocolate-800 rounded-lg flex items-center justify-center border border-white/5">
                                                <Package className="w-6 h-6 text-chocolate-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-serif font-bold text-white">{item.name}</h4>
                                                <p className="text-sm text-chocolate-300">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {/* Price could go here if item level price is available */}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                                <Link href={`/account/orders/${order.id}`} className="flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 font-medium group">
                                    View Order Details
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
