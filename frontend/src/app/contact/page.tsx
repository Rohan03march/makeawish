"use client"

import { useState } from "react"
import { Send, MapPin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [reason, setReason] = useState("")



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        toast.success("Message sent successfully! We'll be in touch shortly.")
        setIsLoading(false)
        setReason("")
            ; (e.target as HTMLFormElement).reset()
    }

    return (
        <div className="bg-chocolate-50 min-h-screen py-24 px-4 md:px-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-chocolate-200/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-chocolate-950">Get in Touch</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto" />
                    <p className="text-chocolate-600 text-lg max-w-2xl mx-auto">
                        Whether you have a question about our chocolates, need assistance with an order, or just want to say hello, we'd love to hear from you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* Contact Form Card */}
                    <div className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(93,64,55,0.1)] border border-chocolate-100/50">
                        <h2 className="text-2xl font-serif font-bold text-chocolate-950 mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-chocolate-700">Name</label>
                                    <Input id="name" required placeholder="Your name" className="bg-chocolate-50/50 border-chocolate-200 focus:border-gold-400 focus:ring-gold-400/20" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-chocolate-700">Email</label>
                                    <Input id="email" type="email" required placeholder="your@email.com" className="bg-chocolate-50/50 border-chocolate-200 focus:border-gold-400 focus:ring-gold-400/20" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="reason" className="text-sm font-medium text-chocolate-700">Reason for Contacting</label>
                                <Select required onValueChange={setReason}>
                                    <SelectTrigger className="bg-chocolate-50/50 border-chocolate-200 focus:border-gold-400 focus:ring-gold-400/20">
                                        <SelectValue placeholder="Select a reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General Inquiry</SelectItem>
                                        <SelectItem value="order">Order Support</SelectItem>
                                        <SelectItem value="refund">Refund Request</SelectItem>
                                        <SelectItem value="custom">Custom/Corporate Orders</SelectItem>
                                        <SelectItem value="feedback">Feedback</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {reason === "refund" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <label htmlFor="orderId" className="text-sm font-medium text-chocolate-700">Order ID</label>
                                    <Input id="orderId" required placeholder="e.g. #12345" className="bg-chocolate-50/50 border-chocolate-200 focus:border-gold-400 focus:ring-gold-400/20" />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-chocolate-700">Message</label>
                                <Textarea id="message" required placeholder="How can we help you?" className="min-h-[150px] bg-chocolate-50/50 border-chocolate-200 focus:border-gold-400 focus:ring-gold-400/20 resize-none" />
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gold-500 hover:bg-gold-600 text-chocolate-950 font-bold text-base transition-all rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                {isLoading ? "Sending..." : (
                                    <span className="flex items-center gap-2">Send Message <Send className="h-4 w-4" /></span>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8 md:pt-12">
                        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-serif font-bold text-chocolate-950 mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 bg-gold-100 rounded-full flex items-center justify-center shrink-0 text-gold-700">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-chocolate-900">Email Us</h4>
                                        <p className="text-chocolate-600">Makeawish.dm@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 bg-gold-100 rounded-full flex items-center justify-center shrink-0 text-gold-700">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-chocolate-900">Call Us</h4>
                                        <p className="text-chocolate-600">+91 9876543210</p>
                                        <p className="text-xs text-chocolate-500 mt-1">Mon-Fri, 9am - 6pm CET</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-chocolate-900 to-chocolate-950 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gold-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-gold-500/20 transition-colors" />
                            <h3 className="text-xl font-serif font-bold mb-3 relative z-10">FAQ</h3>
                            <p className="text-chocolate-200 mb-6 relative z-10">Have a quick question? Check our Frequently Asked Questions first.</p>
                            <Button variant="outline" className="border-white/20 hover:bg-white hover:text-chocolate-950 text-chocolate-100 relative z-10">
                                View FAQ
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
