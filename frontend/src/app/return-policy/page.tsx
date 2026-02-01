import { Truck, AlertCircle, RefreshCw } from "lucide-react"

export default function ReturnPolicyPage() {
    return (
        <div className="bg-chocolate-50 min-h-screen py-24 px-4 md:px-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-400/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-chocolate-950">Return & Refund Policy</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto" />
                </div>

                {/* Content Card */}
                <div className="bg-white/80 backdrop-blur-sm p-8 md:p-16 rounded-3xl shadow-[0_20px_50px_rgba(93,64,55,0.1)] border border-chocolate-100/50">

                    <div className="bg-gold-50 border border-gold-200 rounded-xl p-6 mb-12 flex gap-4 items-start">
                        <AlertCircle className="h-6 w-6 text-gold-600 shrink-0 mt-1" />
                        <div>
                            <h3 className="font-serif font-bold text-gold-800 text-lg mb-1">Our Guarantee</h3>
                            <p className="text-gold-700/80">At Make a wish, we take great pride in the quality and craftsmanship of our chocolates. We want you to be completely satisfied with your purchase.</p>
                        </div>
                    </div>

                    <div className="space-y-12 text-chocolate-800 leading-relaxed text-lg font-light">

                        <section className="flex gap-6">
                            <div className="hidden md:flex h-12 w-12 bg-chocolate-100 rounded-full items-center justify-center shrink-0 text-chocolate-600">
                                <Truck className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4 font-serif text-chocolate-950">Perishable Goods</h2>
                                <p className="text-chocolate-700">Due to health and safety regulations, we cannot accept returns on perishable food items, including chocolates, once they have left our facility. However, if your order is delayed significantly, please reach out.</p>
                            </div>
                        </section>

                        <section className="flex gap-6">
                            <div className="hidden md:flex h-12 w-12 bg-chocolate-100 rounded-full items-center justify-center shrink-0 text-chocolate-600">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4 font-serif text-chocolate-950">Damaged or Incorrect Items</h2>
                                <p className="text-chocolate-700 mb-4">If your order arrives damaged or if you receive the wrong item, please contact us within <span className="font-semibold text-chocolate-900">24 hours</span> of delivery. We will happily replace the item or offer a full refund.</p>
                                <div className="bg-chocolate-50 p-6 rounded-xl border border-chocolate-100 text-base">
                                    <p className="font-medium mb-3">To speed up the process, please provide:</p>
                                    <ul className="list-disc pl-5 space-y-2 text-chocolate-700">
                                        <li>Photos of the damaged packaging and product</li>
                                        <li>Your order number</li>
                                        <li>A brief description of the issue</li>
                                    </ul>
                                    <div className="mt-6 pt-6 border-t border-chocolate-200">
                                        Email us at <a href="mailto:support@makeawish.com" className="text-gold-600 font-bold hover:underline">support@makeawish.com</a>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="flex gap-6">
                            <div className="hidden md:flex h-12 w-12 bg-chocolate-100 rounded-full items-center justify-center shrink-0 text-chocolate-600">
                                <RefreshCw className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4 font-serif text-chocolate-950">Refund Process</h2>
                                <p className="text-chocolate-700">Once your refund is approved, it will be processed immediately. A credit will automatically be applied to your original method of payment or credit card within <span className="font-semibold text-chocolate-900">5-10 business days</span>.</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
