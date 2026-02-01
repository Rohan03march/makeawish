export default function TermsPage() {
    return (
        <div className="bg-chocolate-50 min-h-screen py-24 px-4 md:px-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-chocolate-950">Terms & Conditions</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto" />
                    <p className="text-chocolate-600 italic">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Content Card */}
                <div className="bg-white/80 backdrop-blur-sm p-8 md:p-16 rounded-3xl shadow-[0_20px_50px_rgba(93,64,55,0.1)] border border-chocolate-100/50">
                    <div className="space-y-12 text-chocolate-800 leading-relaxed text-lg font-light">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 font-serif text-chocolate-950 flex items-center gap-3">
                                <span className="text-gold-500">01.</span> Introduction
                            </h2>
                            <p className="text-chocolate-700">Welcome to Make a wish Chocolates. By accessing our website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 font-serif text-chocolate-950 flex items-center gap-3">
                                <span className="text-gold-500">02.</span> Use License
                            </h2>
                            <p className="text-chocolate-700">Permission is granted to temporarily download one copy of the materials (information or software) on Make a wish's website for personal, non-commercial transitory viewing only.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 font-serif text-chocolate-950 flex items-center gap-3">
                                <span className="text-gold-500">03.</span> Disclaimer
                            </h2>
                            <p className="text-chocolate-700">The materials on Make a wish's website are provided on an 'as is' basis. Make a wish makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 font-serif text-chocolate-950 flex items-center gap-3">
                                <span className="text-gold-500">04.</span> Governing Law
                            </h2>
                            <p className="text-chocolate-700">These terms and conditions are governed by and construed in accordance with the laws of Switzerland and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
