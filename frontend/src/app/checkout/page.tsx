"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { Loader2, ShieldCheck, MapPin, Truck, CreditCard, Check } from "lucide-react"
import Script from "next/script"
import { API_URL } from "@/lib/config"

export default function CheckoutPage() {
    const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart()
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ shouldUnregister: false })
    const [savedAddresses, setSavedAddresses] = useState<any[]>([])
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)

    const [showManualForm, setShowManualForm] = useState(false)

    // Fetch saved addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            // ... existing code ...
            try {
                const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
                if (user?.token) {
                    const res = await fetch(`${API_URL}/api/auth/profile`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    })
                    if (res.ok) {
                        const data = await res.json()
                        const addresses = data.addresses || []
                        setSavedAddresses(addresses)

                        // If no addresses, show manual form
                        if (addresses.length === 0) {
                            setShowManualForm(true)
                        } else {
                            // Auto-select default address if available
                            const defaultIndex = addresses.findIndex((a: any) => a.isDefault)
                            if (defaultIndex !== -1) {
                                fillAddressForm(addresses[defaultIndex], defaultIndex)
                            } else {
                                // Or select the first one
                                fillAddressForm(addresses[0], 0)
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch addresses", error)
            }
        }
        fetchAddresses()
    }, [])

    const fillAddressForm = (addr: any, index: number) => {
        setValue("address", addr.street)
        setValue("city", addr.city)
        setValue("postalCode", addr.postalCode)
        setValue("country", addr.country)
        setValue("phone", addr.phone || "")
        setSelectedAddressIndex(index)
        setShowManualForm(false) // Hide manual form when filling from saved
    }

    // Handle empty cart redirect
    useEffect(() => {
        if (!isSuccess && cartItems.length === 0) {
            router.push('/cart')
        }
    }, [cartItems, router, isSuccess])

    if (cartItems.length === 0) {
        return null
    }

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }

    const onSubmit = async (data: any) => {
        setIsProcessing(true)
        try {
            const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
            const token = user?.token

            if (!token) {
                router.push('/login?redirect=checkout')
                return
            }

            // 1. Create Order in Database (Pending Payment)
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: (item.customDetails || item._id.startsWith('custom-')) ? null : item._id,
                    customDetails: item.customDetails
                })),
                shippingAddress: {
                    address: data.address,
                    city: data.city,
                    postalCode: data.postalCode,
                    country: data.country,
                    phone: data.phone
                },
                paymentMethod: data.paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            }

            const res = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            })

            const order = await res.json()

            if (!res.ok) {
                throw new Error(order.message || "Order creation failed")
            }

            // 2. Handle Payment
            if (data.paymentMethod === 'Razorpay') {
                const resLoaded = await loadRazorpayScript()

                if (!resLoaded) {
                    alert('Razorpay SDK failed to load. Are you online?')
                    return
                }

                // Fetch Key ID
                // Fetch Key ID
                const { keyId } = await (await fetch(`${API_URL}/api/config/razorpay`)).json();


                // Create Razorpay Order
                const rpOrderRes = await fetch(`${API_URL}/api/orders/razorpay`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ amount: totalPrice })
                })
                const rpOrder = await rpOrderRes.json()

                const options = {
                    key: keyId,
                    amount: rpOrder.amount,
                    currency: rpOrder.currency,
                    name: "Make a wish",
                    description: "Order Payment",
                    order_id: rpOrder.id,
                    handler: async function (response: any) {
                        // Payment Success
                        // Update Order to Paid
                        const payRes = await fetch(`${API_URL}/api/orders/${order._id}/pay`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                id: response.razorpay_payment_id,
                                status: 'COMPLETED',
                                update_time: String(Date.now()),
                                email_address: user.email // or from form
                            })
                        })

                        if (payRes.ok) {
                            setIsSuccess(true)
                            clearCart()
                            router.push(`/order-success?orderId=${order._id}&paymentId=${response.razorpay_payment_id}`)
                        } else {
                            alert("Payment verification failed")
                            router.push('/order-failed')
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: data.phone
                    },
                    theme: {
                        color: "#D4AF37"
                    },
                    modal: {
                        ondismiss: async function () {
                            setIsProcessing(false) // enable button again
                            // cleanup pending order
                            try {
                                const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
                                const token = user?.token
                                await fetch(`${API_URL}/api/orders/${order._id}`, {
                                    method: 'DELETE',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                })
                            } catch (e) { console.error(e) }
                            console.log('Checkout form closed');
                        }
                    }
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.open();

            } else {
                // COD Flow
                setIsSuccess(true)
                clearCart()
                router.push(`/order-success?orderId=${order._id}`)
            }

        } catch (error: any) {
            console.error("Order creation failed", error)
            alert(error.message || "Something went wrong")
            // Redirect to failure page for Razorpay errors? Or stay on page.
            // router.push('/order-failed')
        } finally {
            if (data.paymentMethod !== 'Razorpay') {
                setIsProcessing(false)
            }
            // For Razorpay, isProcessing stays true until modal closes or payment completes
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <h1 className="text-4xl font-serif font-bold text-white mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Checkout Form */}
                <div className="space-y-8">
                    {/* Saved Addresses Selection */}
                    {savedAddresses.length > 0 && !showManualForm && (
                        <div className="bg-chocolate-900/40 border border-white/5 rounded-2xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-gold-400" />
                                    <h2 className="text-2xl font-serif font-bold text-white">Select Delivery Address</h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setValue("address", "")
                                        setValue("city", "")
                                        setValue("postalCode", "")
                                        setValue("country", "India")
                                        setSelectedAddressIndex(null)
                                        setShowManualForm(true)
                                    }}
                                    className="text-sm text-gold-400 hover:text-gold-300 font-medium hover:underline"
                                >
                                    + Add New Address
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {savedAddresses.map((addr, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => fillAddressForm(addr, idx)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all group relative flex items-start justify-between ${selectedAddressIndex === idx
                                            ? "bg-gold-500/10 border-gold-500 ring-1 ring-gold-500"
                                            : "bg-white/5 border-white/10 hover:border-gold-500/30"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start w-full">
                                            <div>
                                                <p className={`font-bold transition-colors uppercase tracking-wide text-sm mb-1 ${selectedAddressIndex === idx ? "text-gold-400" : "text-white group-hover:text-gold-400"
                                                    }`}>{addr.street}</p>
                                                <p className="text-sm text-chocolate-300">{addr.city} - {addr.postalCode}</p>
                                                <p className="text-sm text-chocolate-300">{addr.country}</p>
                                                <p className="text-sm text-chocolate-300">{addr.phone}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {selectedAddressIndex === idx && (
                                                    <div className="h-6 w-6 bg-gold-500 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/20">
                                                        <Check className="w-4 h-4 text-chocolate-950 stroke-[3]" />
                                                    </div>
                                                )}
                                                {addr.isDefault && (
                                                    <span className="text-[10px] bg-white/10 text-chocolate-200 px-2 py-1 rounded-full font-bold">DEFAULT</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Shipping Address Manual Form */}
                    {showManualForm && (
                        <div className="bg-chocolate-900/40 border border-white/5 rounded-2xl p-8 animate-in fade-in slide-in-from-top-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-gold-400" />
                                    <h2 className="text-2xl font-serif font-bold text-white">New Shipping Address</h2>
                                </div>
                                {savedAddresses.length > 0 && (
                                    <button
                                        onClick={() => setShowManualForm(false)}
                                        className="text-sm text-chocolate-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-chocolate-300 text-sm font-bold mb-2">Address</label>
                                    <input
                                        {...register("address", { required: "Address is required" })}
                                        className="w-full bg-chocolate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                                        placeholder="123 Chocolate Lane"
                                    />
                                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message as string}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-chocolate-300 text-sm font-bold mb-2">City</label>
                                        <input
                                            {...register("city", { required: "City is required" })}
                                            className="w-full bg-chocolate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                                            placeholder="Sweet City"
                                        />
                                        {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message as string}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-chocolate-300 text-sm font-bold mb-2">Postal Code</label>
                                        <input
                                            {...register("postalCode", { required: "Postal Code is required" })}
                                            className="w-full bg-chocolate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                                            placeholder="12345"
                                        />
                                        {errors.postalCode && <p className="text-red-400 text-xs mt-1">{errors.postalCode.message as string}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-chocolate-300 text-sm font-bold mb-2">Country</label>
                                    <input
                                        {...register("country", { required: "Country is required" })}
                                        className="w-full bg-chocolate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                                        placeholder="India"
                                        defaultValue="India"
                                    />
                                    {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country.message as string}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Information - Always Visible */}
                    <div className="bg-chocolate-900/40 border border-white/5 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Truck className="w-6 h-6 text-gold-400" />
                            <h2 className="text-2xl font-serif font-bold text-white">Contact Information</h2>
                        </div>
                        <div>
                            <label className="block text-chocolate-300 text-sm font-bold mb-2">Phone Number</label>
                            <input
                                {...register("phone", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Please enter a valid 10-digit phone number"
                                    }
                                })}
                                className="w-full bg-chocolate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                                placeholder="9876543210"
                            />
                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message as string}</p>}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-chocolate-900/40 border border-white/5 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="w-6 h-6 text-gold-400" />
                            <h2 className="text-2xl font-serif font-bold text-white">Payment Method</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-4 p-4 rounded-xl border border-gold-500/30 bg-gold-500/10 cursor-pointer">
                                <input
                                    type="radio"
                                    value="COD"
                                    {...register("paymentMethod")}
                                    defaultChecked
                                    className="w-4 h-4 text-gold-500 focus:ring-gold-500"
                                />
                                <span className="font-bold text-white">Cash on Delivery</span>
                            </label>
                            <label className="flex items-center gap-4 p-4 rounded-xl border border-gold-500/30 bg-gold-500/10 cursor-pointer">
                                <input
                                    type="radio"
                                    value="Razorpay"
                                    {...register("paymentMethod")}
                                    className="w-4 h-4 text-gold-500 focus:ring-gold-500"
                                />
                                <span className="font-bold text-white">Razorpay</span>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-chocolate-950 font-bold rounded-xl hover:shadow-lg hover:shadow-gold-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                        {isProcessing ? "Processing..." : `Place Order - ₹${totalPrice.toLocaleString()}`}
                    </button>
                    <p className="text-center text-xs text-chocolate-400 flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> Secure Checkout
                    </p>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-chocolate-900/60 border border-white/10 rounded-2xl p-8 sticky top-24">
                        <h2 className="text-2xl font-serif font-bold text-white mb-6">Your Order</h2>
                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex gap-4 py-4 border-b border-white/5 last:border-0">
                                    <div className="relative w-16 h-16 bg-chocolate-800 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-bold text-sm line-clamp-2">{item.name}</p>
                                        <p className="text-chocolate-400 text-xs mt-1">{item.qty} x ₹{item.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gold-400 font-bold text-sm">₹{(item.qty * item.price).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-chocolate-300">
                                <span>Subtotal</span>
                                <span className="text-white">₹{itemsPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-chocolate-300">
                                <span>Shipping</span>
                                <span className="text-white">{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span>
                            </div>
                            <div className="flex justify-between text-chocolate-300">
                                <span>Tax (18%)</span>
                                <span className="text-white">₹{taxPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-white/10">
                                <span className="text-lg font-bold text-white">Total</span>
                                <span className="text-2xl font-serif font-bold text-gold-400">₹{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
