"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

type CheckoutFormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    paymentMethod: "card" | "upi" | "cod"
}

export function CheckoutForm() {
    const { items, clearCart } = useCart()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<CheckoutFormData>({
        defaultValues: {
            country: "India",
            paymentMethod: "cod"
        }
    })

    const paymentMethod = watch("paymentMethod")

    const onSubmit = async (data: CheckoutFormData) => {
        setIsSubmitting(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        console.log("Order placed:", { items, ...data })

        clearCart()
        router.push("/checkout/success")
        setIsSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
                {/* Contact Info Card */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-white/10">
                    <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Contact Information</h2>
                    </div>

                    <div className="p-6 space-y-4 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-600">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                                    className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-gold-500 focus:ring-gold-500/20"
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-gray-600">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    {...register("phone", { required: "Phone is required" })}
                                    className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-gold-500 focus:ring-gold-500/20"
                                />
                                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping Address Card */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-white/10">
                    <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Shipping Address</h2>
                    </div>

                    <div className="p-6 space-y-4 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-gray-600">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    {...register("firstName", { required: "First name is required" })}
                                    className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-gold-500 focus:ring-gold-500/20"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-gray-600">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    {...register("lastName", { required: "Last name is required" })}
                                    className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-gold-500 focus:ring-gold-500/20"
                                />
                                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-gray-600">Address</Label>
                            <Input
                                id="address"
                                placeholder="123 Street Name, Area"
                                {...register("address", { required: "Address is required" })}
                                className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-gold-500 focus:ring-gold-500/20"
                            />
                            {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-gray-600">City</Label>
                                <Input
                                    id="city"
                                    placeholder="Mumbai"
                                    {...register("city", { required: "City is required" })}
                                    className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-gold-500 focus:ring-gold-500/20"
                                />
                                {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zipCode" className="text-gray-600">ZIP Code</Label>
                                <Input
                                    id="zipCode"
                                    placeholder="400001"
                                    {...register("zipCode", { required: "ZIP Code is required" })}
                                    className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-gold-500 focus:ring-gold-500/20"
                                />
                                {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="state" className="text-gray-600">State</Label>
                                <Input
                                    id="state"
                                    placeholder="Maharashtra"
                                    {...register("state", { required: "State is required" })}
                                    className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-gold-500 focus:ring-gold-500/20"
                                />
                                {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-gray-600">Country</Label>
                                <Input
                                    id="country"
                                    {...register("country", { required: "Country is required" })}
                                    className="bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-serif font-bold text-white">Payment Method</h2>
                    <div className="text-xs text-green-400 flex items-center bg-green-500/10 px-2 py-1 rounded">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        100% Secure
                    </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-white/10">
                    <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-medium">Pay with</span>
                        <div className="flex items-center gap-1">
                            <span className="text-blue-600 font-bold italic tracking-tighter">Razorpay</span>
                            <div className="bg-blue-600 text-[9px] text-white px-1 rounded-sm">TRUSTED</div>
                        </div>
                    </div>

                    <div className="p-4 space-y-3 bg-white">
                        {/* UPI Option */}
                        <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200'}`}>
                            <input
                                type="radio"
                                value="upi"
                                {...register("paymentMethod")}
                                className="sr-only"
                            />
                            <div className="flex items-center gap-4 w-full">
                                <div className="h-10 w-10 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm">
                                    <span className="text-xs font-bold text-gray-600">UPI</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">UPI</p>
                                    <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                                </div>
                                {paymentMethod === 'upi' ? (
                                    <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center"><div className="h-2 w-2 bg-white rounded-full" /></div>
                                ) : (
                                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                                )}
                            </div>
                        </label>

                        {/* Card Option */}
                        <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200'}`}>
                            <input
                                type="radio"
                                value="card"
                                {...register("paymentMethod")}
                                className="sr-only"
                            />
                            <div className="flex items-center gap-4 w-full">
                                <div className="h-10 w-10 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm text-blue-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">Card</p>
                                    <p className="text-xs text-gray-500">Visa, MasterCard, RuPay</p>
                                </div>
                                {paymentMethod === 'card' ? (
                                    <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center"><div className="h-2 w-2 bg-white rounded-full" /></div>
                                ) : (
                                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                                )}
                            </div>
                        </label>

                        {/* Netbanking Option (Disabled) */}
                        <label className="relative flex items-center p-4 border border-gray-100 rounded-lg opacity-60 cursor-not-allowed bg-gray-50">
                            <input
                                type="radio"
                                value="netbanking"
                                disabled
                                className="sr-only"
                            />
                            <div className="flex items-center gap-4 w-full">
                                <div className="h-10 w-10 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-400">Netbanking</p>
                                    <p className="text-xs text-gray-400">All Indian banks</p>
                                </div>
                                <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-1 rounded shadow-sm">SOON</span>
                            </div>
                        </label>

                        {/* COD Option */}
                        <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200'}`}>
                            <input
                                type="radio"
                                value="cod"
                                {...register("paymentMethod")}
                                className="sr-only"
                            />
                            <div className="flex items-center gap-4 w-full">
                                <div className="h-10 w-10 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm text-green-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500">Pay when order arrives</p>
                                </div>
                                {paymentMethod === 'cod' ? (
                                    <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center"><div className="h-2 w-2 bg-white rounded-full" /></div>
                                ) : (
                                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                                )}
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full bg-gold-500 text-chocolate-950 hover:bg-gold-600 font-bold h-12 text-lg"
                disabled={isSubmitting || (items || []).length === 0}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    "Place Order"
                )}
            </Button>
        </form>
    )
}
