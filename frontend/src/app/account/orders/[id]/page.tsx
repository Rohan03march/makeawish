import Link from "next/link"
import { ChevronLeft, MapPin, CreditCard, Package, Truck, CheckCircle } from "lucide-react"

// Mock Data (matches list mock data somewhat)
const order = {
    id: "ORD-2024-001",
    date: "Jan 15, 2024",
    status: "Delivered",
    paymentMethod: "UPI",
    items: [
        { name: "Signature Truffle Collection", quantity: 1, price: 850, image: "🍫" },
        { name: "Dark Chocolate Hazelnut Bar", quantity: 2, price: 200, image: "🍬" }
    ],
    subtotal: 1250,
    shipping: 0,
    total: 1250,
    shippingAddress: {
        name: "John Doe",
        street: "123 Chocolate Lane",
        city: "Sweet City",
        state: "Maharashtra",
        zip: "400001",
        country: "India",
        phone: "+91 98765 43210"
    }
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    // In a real app, fetch order by params.id

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/account/orders" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-white">Order #{order.id}</h1>
                    <p className="text-chocolate-300 text-sm">Placed on {order.date}</p>
                </div>
            </div>

            {/* Order Status Tracking */}
            <div className="bg-chocolate-900/40 border border-white/5 rounded-xl p-6 sm:p-8">
                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 rounded-full" />
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-green-500/50 -translate-y-1/2 rounded-full" />

                    <div className="relative flex justify-between">
                        {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                            <div key={step} className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-chocolate-950 ${index <= 3 ? 'border-green-500 text-green-500' : 'border-white/10 text-white/20'
                                    }`}>
                                    {index <= 3 ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-white/20" />}
                                </div>
                                <span className={`text-xs font-medium ${index <= 3 ? 'text-green-400' : 'text-chocolate-400'}`}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items List */}
                    <div className="bg-chocolate-900/40 border border-white/5 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/5">
                            <h3 className="font-bold text-white">Items Ordered</h3>
                        </div>
                        <div className="p-4 sm:p-6 space-y-6">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="h-20 w-20 bg-chocolate-800 rounded-lg flex items-center justify-center border border-white/5 text-3xl shrink-0">
                                        {item.image}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-white">{item.name}</h4>
                                                <p className="text-sm text-chocolate-300 mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-gold-400">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Total Mobile (if needed, mainly desktop covers it in sidebar or bottom) */}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Shipping Info */}
                    <div className="bg-chocolate-900/40 border border-white/5 rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3 text-white border-b border-white/5 pb-4">
                            <MapPin className="w-5 h-5 text-gold-500" />
                            <h3 className="font-bold">Shipping Address</h3>
                        </div>
                        <div className="text-sm text-chocolate-200 space-y-1">
                            <p className="font-medium text-white">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                            <p>{order.shippingAddress.country}</p>
                            <p className="mt-2 text-white">{order.shippingAddress.phone}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-chocolate-900/40 border border-white/5 rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3 text-white border-b border-white/5 pb-4">
                            <CreditCard className="w-5 h-5 text-gold-500" />
                            <h3 className="font-bold">Payment Summary</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-chocolate-200">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-chocolate-200">
                                <span>Shipping</span>
                                <span className="text-green-400">Free</span>
                            </div>
                            <div className="pt-3 border-t border-white/5 flex justify-between text-white font-bold">
                                <span>Total</span>
                                <span className="text-gold-400">₹{order.total.toLocaleString()}</span>
                            </div>
                            <div className="mt-4 bg-green-500/10 text-green-400 text-xs px-3 py-2 rounded flex items-center gap-2">
                                <CheckCircle className="w-3 h-3" />
                                Paid via {order.paymentMethod}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
