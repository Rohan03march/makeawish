export default function PrivacyPage() {
    return (
        <div className="bg-chocolate-50 min-h-screen py-24 px-4 md:px-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-chocolate-200/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-chocolate-950">Privacy Policy</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto" />
                    <p className="text-chocolate-600 italic">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Content Card */}
                <div className="bg-white/80 backdrop-blur-sm p-8 md:p-16 rounded-3xl shadow-[0_20px_50px_rgba(93,64,55,0.1)] border border-chocolate-100/50">
                    <div className="space-y-12 text-chocolate-800 leading-relaxed text-lg font-light">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 font-serif text-chocolate-950 flex items-center gap-3">
                                <span className="text-gold-500">01.</span> Information We Collect
                            </h2>
                            <p className="text-chocolate-700">We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or sign up for our newsletter. This may include your name, email address, shipping address, and payment information.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 font-serif text-chocolate-950 flex items-center gap-3">
                                <span className="text-gold-500">02.</span> How We Use Your Information
                            </h2>
                            <p className="text-chocolate-700">We use the information we collect to process your orders, communicate with you, and improve our services. We do not sell your personal data to third parties.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 font-serif text-chocolate-950 flex items-center gap-3">
                                <span className="text-gold-500">03.</span> Cookies
                            </h2>
                            <p className="text-chocolate-700">We use cookies to enhance your browsing experience and analyze our traffic. By using our website, you consent to our use of cookies.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 font-serif text-chocolate-950 flex items-center gap-3">
                                <span className="text-gold-500">04.</span> Contact Us
                            </h2>
                            <p className="text-chocolate-700">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@makeawish.com" className="text-gold-600 font-medium hover:underline hover:text-gold-700 transition-colors">privacy@makeawish.com</a>.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
