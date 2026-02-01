"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, User, MapPin, Package, LogOut, Plus, Edit2, Trash2, XCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { API_URL } from "@/lib/config"

// Types
interface Address {
    street: string
    city: string
    postalCode: string
    country: string
    isDefault: boolean
}

interface Order {
    _id: string
    createdAt: string
    totalPrice: number
    isPaid: boolean
    isDelivered: boolean
    status: string
    orderItems: {
        name: string
        qty: number
        image: string
        price: number
        phone: string
        // ... (other fields)

    }[]
    paymentResult?: {
        id: string
        status: string
        update_time: string
        email_address: string
    }
    shippingAddress: {
        address: string
        city: string
    }
}

interface UserProfile {
    _id: string
    name: string
    email: string
    addresses: Address[]
}

export default function AccountPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile')
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<UserProfile | null>(null)
    const [orders, setOrders] = useState<Order[]>([])

    // Profile Form State
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isEditing, setIsEditing] = useState(false)

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard", {
            style: {
                background: '#3E2723',
                color: '#D4AF37',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            },
            iconTheme: {
                primary: '#D4AF37',
                secondary: '#3E2723',
            },
        })
    }

    // Address Form State
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [newAddress, setNewAddress] = useState<Address>({
        street: "",
        city: "",
        postalCode: "",
        country: "",
        isDefault: false
    })

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab === 'orders' || tab === 'profile') {
            setActiveTab(tab as any)
        }
    }, [searchParams])

    useEffect(() => {
        const fetchUserData = async () => {
            const userInfo = localStorage.getItem('userInfo')
            if (!userInfo) {
                router.push('/login')
                return
            }

            try {
                const { token } = JSON.parse(userInfo)

                // Fetch Profile
                const profileRes = await fetch(`${API_URL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (profileRes.ok) {
                    const profileData = await profileRes.json()
                    setUser(profileData)
                    setName(profileData.name)
                    setEmail(profileData.email)
                }

                // Fetch Orders
                const ordersRes = await fetch(`${API_URL}/api/orders/myorders`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json()
                    setOrders(ordersData)
                }

            } catch (error) {
                console.error("Error loading account data:", error)
                toast.error("Failed to load account data")
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [router])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        try {
            const userInfo = localStorage.getItem('userInfo')
            if (!userInfo) return
            const { token } = JSON.parse(userInfo)

            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, email, password })
            })

            const data = await res.json()
            if (res.ok) {
                toast.success("Profile Updated")
                setUser(prev => prev ? { ...prev, name: data.name, email: data.email } : null)
                // Update local storage
                const updatedUserInfo = { ...JSON.parse(userInfo), name: data.name, email: data.email }
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))
                setIsEditing(false)
                setPassword("")
                setConfirmPassword("")
            } else {
                toast.error(data.message || "Update failed")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        try {
            const userInfo = localStorage.getItem('userInfo')
            if (!userInfo) return
            const { token } = JSON.parse(userInfo)

            const updatedAddresses = [...(user.addresses || []), newAddress]

            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ addresses: updatedAddresses })
            })

            const data = await res.json()
            if (res.ok) {
                toast.success("Address Added")
                setUser(prev => prev ? { ...prev, addresses: data.addresses } : null)
                setShowAddressForm(false)
                setNewAddress({ street: "", city: "", postalCode: "", country: "", isDefault: false })
            }
        } catch (error) {
            toast.error("Failed to add address")
        }
    }

    const handleDeleteAddress = async (index: number) => {
        if (!user || !user.addresses) return
        if (!confirm("Are you sure you want to delete this address?")) return

        try {
            const userInfo = localStorage.getItem('userInfo')
            if (!userInfo) return
            const { token } = JSON.parse(userInfo)

            const updatedAddresses = user.addresses.filter((_, i) => i !== index)

            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ addresses: updatedAddresses })
            })

            const data = await res.json()
            if (res.ok) {
                toast.success("Address Deleted")
                setUser(prev => prev ? { ...prev, addresses: data.addresses } : null)
            }
        } catch (error) {
            toast.error("Failed to delete address")
        }
    }

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to cancel this order?")) return

        try {
            const userInfo = localStorage.getItem('userInfo')
            if (!userInfo) return
            const { token } = JSON.parse(userInfo)

            const res = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()
            if (res.ok) {
                toast.success("Order Cancelled")
                // Update local orders state
                setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'Cancelled' } : order))
            } else {
                toast.error(data.message || "Failed to cancel order")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('userInfo')
        localStorage.removeItem('cartItems')
        router.push('/login')
        toast.success("Logged out successfully")
    }



    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-4 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-gold-500 text-chocolate-950 font-bold' : 'text-chocolate-200 hover:bg-white/5'}`}
                >
                    <User className="w-4 h-4" /> Profile
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-gold-500 text-chocolate-950 font-bold' : 'text-chocolate-200 hover:bg-white/5'}`}
                >
                    <Package className="w-4 h-4" /> Orders
                </button>

                <button
                    onClick={handleLogout}
                    className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-red-400 hover:bg-red-500/10 transition-all font-medium whitespace-nowrap"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'profile' ? (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {/* Personal Info */}
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center justify-between">
                                Personal Information
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-gold-400 hover:text-gold-300"
                                >
                                    {isEditing ? 'Cancel' : <><Edit2 className="w-4 h-4 mr-2" /> Edit</>}
                                </Button>
                            </h3>

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="text-xs text-chocolate-300 uppercase tracking-widest">Full Name</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!isEditing}
                                        className="bg-chocolate-900/50 border-white/10 text-white mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-chocolate-300 uppercase tracking-widest">Email Address</label>
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!isEditing}
                                        className="bg-chocolate-900/50 border-white/10 text-white mt-1"
                                    />
                                </div>

                                {isEditing && (
                                    <div className="pt-4 border-t border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div>
                                            <label className="text-xs text-chocolate-300 uppercase tracking-widest">New Password</label>
                                            <Input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Leave blank to keep current"
                                                className="bg-chocolate-900/50 border-white/10 text-white mt-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-chocolate-300 uppercase tracking-widest">Confirm Password</label>
                                            <Input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                                className="bg-chocolate-900/50 border-white/10 text-white mt-1"
                                            />
                                        </div>
                                        <Button type="submit" className="w-full bg-gold-500 text-chocolate-950 font-bold hover:bg-white hover:text-chocolate-950">
                                            Save Changes
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Addresses */}
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center justify-between">
                                Saved Addresses
                                <Button
                                    size="sm"
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                    className="bg-chocolate-800 text-white hover:bg-gold-500 hover:text-chocolate-950"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add New
                                </Button>
                            </h3>

                            <div className="space-y-4">
                                {showAddressForm && (
                                    <form onSubmit={handleAddAddress} className="bg-chocolate-900/50 p-4 rounded-lg border border-gold-500/30 space-y-3 animate-in fade-in zoom-in-95">
                                        <Input placeholder="Street Address" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="bg-black/20 border-white/10" required />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="bg-black/20 border-white/10" required />
                                            <Input placeholder="Postal Code" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} className="bg-black/20 border-white/10" required />
                                        </div>
                                        <Input placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} className="bg-black/20 border-white/10" required />
                                        <div className="flex justify-end gap-2">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddressForm(false)} className="text-chocolate-300">Cancel</Button>
                                            <Button type="submit" size="sm" className="bg-gold-500 text-chocolate-950 font-bold">Save Address</Button>
                                        </div>
                                    </form>
                                )}

                                {user?.addresses?.length === 0 && !showAddressForm && (
                                    <p className="text-center text-chocolate-400 py-8">No addresses saved yet.</p>
                                )}

                                {user?.addresses?.map((addr, idx) => (
                                    <div key={idx} className="flex items-start justify-between p-4 rounded-lg bg-chocolate-900/30 border border-white/5 group hover:border-gold-500/20 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gold-500 mt-0.5" />
                                            <div>
                                                <p className="text-white font-medium">{addr.street}</p>
                                                <p className="text-sm text-chocolate-300">{addr.city}, {addr.postalCode}</p>
                                                <p className="text-sm text-chocolate-300">{addr.country}</p>
                                                {addr.isDefault && <span className="text-[10px] bg-gold-500/10 text-gold-400 px-2 py-0.5 rounded-full mt-1 inline-block">Default</span>}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteAddress(idx)}
                                            className="text-chocolate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="orders"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {orders.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                                <Package className="w-16 h-16 text-chocolate-400 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-serif text-white mb-2">No orders yet</h3>
                                <p className="text-chocolate-300 mb-6">Start exploring our collection of premium chocolates.</p>
                                <Button onClick={() => router.push('/shop')} className="bg-gold-500 text-chocolate-950 font-bold hover:bg-white">
                                    Browse Shop
                                </Button>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order._id} className="bg-chocolate-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-gold-500/30 transition-colors">
                                    <div className="p-4 sm:p-6 border-b border-white/5 bg-white/5 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex flex-wrap gap-8">
                                            <div>
                                                <p className="text-xs text-chocolate-300 uppercase tracking-wider font-medium">Order Placed</p>
                                                <p className="text-sm text-white font-medium mt-1">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-chocolate-300 uppercase tracking-wider font-medium">Total Amount</p>
                                                <p className="text-sm text-gold-400 font-bold mt-1">₹{order.totalPrice.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                {/* Cancel Button - Only show if processing */}
                                                {(order.status === 'Processing' || (!order.status && !order.isDelivered)) && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/50 h-8 text-xs font-medium transition-all"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5 mr-1.5" />
                                                        Cancel Order
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => copyToClipboard(`ORD-${order._id.slice(-5).toUpperCase()}`)}>
                                                <span className="text-[10px] text-chocolate-400 uppercase tracking-widest font-bold hidden sm:block">Order id:</span>
                                                <p className="text-sm text-white font-mono font-medium">ORD-{order._id.slice(-5).toUpperCase()}</p>
                                                <Copy className="w-3 h-3 text-chocolate-500 group-hover:text-gold-400 transition-colors" />
                                            </div>
                                            {(order.paymentResult?.id) && (
                                                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => copyToClipboard(order.paymentResult!.id)}>
                                                    <span className="text-[10px] text-chocolate-400 uppercase tracking-widest font-bold hidden sm:block">TXN id:</span>
                                                    <p className="text-xs text-chocolate-300 font-mono tracking-wider">{order.paymentResult.id}</p>
                                                    <Copy className="w-3 h-3 text-chocolate-500 group-hover:text-gold-400 transition-colors" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-6 space-y-4">
                                        {order.orderItems.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-white/5 rounded flex items-center justify-center">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                                                        ) : (
                                                            <Package className="w-6 h-6 text-chocolate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{item.name}</p>
                                                        <p className="text-xs text-chocolate-300">Qty: {item.qty}</p>
                                                    </div>
                                                </div>
                                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' :
                                                    order.status === 'Processing' ? 'bg-gold-500/10 text-gold-400' :
                                                        order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' :
                                                            (order.status === 'Delivered' || order.isDelivered) ? 'bg-green-500/10 text-green-400' :
                                                                'bg-gold-500/10 text-gold-400'
                                                    }`}>
                                                    {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}
