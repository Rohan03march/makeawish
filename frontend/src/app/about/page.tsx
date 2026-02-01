"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"


export default function AboutPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <div ref={containerRef} className="bg-chocolate-50 min-h-screen text-chocolate-950 font-sans selection:bg-gold-500/30">

      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Image
            src="/about-hero-v3.png"
            alt="Master Chocolatier Creating Magic"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-chocolate-950/90" />
        </motion.div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block px-4 py-1.5 border border-gold-400/50 rounded-full text-gold-400 text-sm tracking-[0.2em] font-medium backdrop-blur-sm"
          >
            EST. 2024
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-chocolate-100 to-chocolate-200 drop-shadow-2xl py-4 pb-6"
          >
            Our Legacy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-chocolate-100/90 font-light leading-relaxed max-w-2xl mx-auto"
          >
            A story of passion, precision, and the relentless pursuit of perfection.
          </motion.p>
        </div>
      </section>

      {/* 2. THE BEGINNING */}
      <section className="py-24 md:py-32 container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-chocolate-950 leading-tight">
              Swiss Roots, <br /><span className="text-gold-600 italic">Global Vision.</span>
            </h2>
            <div className="w-24 h-1 bg-gold-500" />
            <div className="space-y-6 text-lg text-chocolate-700 leading-relaxed font-light">
              <p>
                Founded in the heart of Zurich, <span className="font-semibold text-chocolate-900">Make a wish</span> was born from a simple yet ambitious desire: to redefine what chocolate can be.
              </p>
              <p>
                Our founder, tired of the industrialized, sugar-laden confectionary that dominated the market, embarked on a journey to the remote cocoa plantations of Ecuador and Madagascar. There, among the ancient criollo trees, he discovered the true soul of chocolate.
              </p>
              <p>
                What started as a small atelier in 2024 has grown into a sanctuary for cocoa connoisseurs, where traditional Swiss techniques meet modern, avant-garde flavor profiles.
              </p>
            </div>
          </motion.div>

          <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <Image
                src="/about-workshop.png"
                alt="Make a wish Atelier"
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl max-w-xs">
              <p className="text-white font-serif italic text-lg">"The Atelier"</p>
              <p className="text-gold-300 text-sm uppercase tracking-wider">Where magic happens</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE CRAFT (DARK SECTION) */}
      <section className="bg-chocolate-950 text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-600/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif font-bold">The Art of <span className="text-gold-500 italic">Alchemy</span></h2>
            <p className="text-chocolate-200 text-lg">We don't just make chocolate. We curate experiences.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 relative group">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src="/about-beans.png"
                    alt="Hand sorting cocoa beans"
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-serif text-white mb-2">Hand-Selected Origins</h3>
                  <p className="text-chocolate-300">Only the top 1% of harvested beans make the cut.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-12">
              {[
                { title: "24h Conching", desc: "Our signature long-conch process aerates the chocolate, removing acidity and revealing hidden floral notes.", icon: "01" },
                { title: "Single Origin", desc: "We never blend harvests. Each bar tells the unique story of its specific terroir and harvest year.", icon: "02" },
                { title: "Zero Additives", desc: "No lecithin, no vanilla, no palm oil. Just cocoa, cocoa butter, and unrefined cane sugar.", icon: "03" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-gold-400 to-gold-700 opacity-30 group-hover:opacity-100 transition-opacity font-bold">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gold-100 mb-2 group-hover:text-gold-400 transition-colors">{item.title}</h4>
                    <p className="text-chocolate-300 leading-relaxed text-sm md:text-base">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUES / ETHICS */}
      <section className="py-24 bg-white text-chocolate-950">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 border border-chocolate-100 rounded-2xl bg-chocolate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="h-16 w-16 bg-gold-100 text-gold-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Sustainability First</h3>
              <p className="text-chocolate-600 text-sm">Every package is 100% biodegradable and plastic-free.</p>
            </div>
            <div className="p-8 border border-chocolate-100 rounded-2xl bg-chocolate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="h-16 w-16 bg-gold-100 text-gold-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-handshake"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.18 0l2.47 1.69a2.16 2.16 0 0 1 .15 3.64l-3.32 2.33a2.16 2.16 0 0 1-2.91-.49l-1.91-2.19a2.16 2.16 0 0 0-2.81-.33h0a2.16 2.16 0 0 0-2.8 3.04l2.19 1.91a2.16 2.16 0 0 1 .49 2.91l-2.33 3.32a2.16 2.16 0 0 1-3.64-.15l-1.69-2.47a2.82 2.82 0 0 1 0-3.18l1.9-2.07c.78-.89.75-2.2-.07-3.02l-1.8-1.79c-.87-.87-2.12-.9-3-.12l-1.12.98" /></svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Fair Trade Plus</h3>
              <p className="text-chocolate-600 text-sm">We pay our farmers 4x the standard fair trade price.</p>
            </div>
            <div className="p-8 border border-chocolate-100 rounded-2xl bg-chocolate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="h-16 w-16 bg-gold-100 text-gold-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Award Winning</h3>
              <p className="text-chocolate-600 text-sm">Gold Medalist at the 2025 International Chocolate Awards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER CTA */}
      <section className="h-[50vh] relative flex items-center justify-center bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/about-footer.png')" }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center space-y-8">
          <h2 className="text-4xl md:text-6xl text-white font-serif font-bold">Taste the Dedication</h2>
          <p className="text-white/80 max-w-lg mx-auto text-lg">Your journey into the world of fine chocolate starts here.</p>
          <a href="/shop" className="inline-block bg-gold-500 text-chocolate-950 px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            Shop the Collection
          </a>
        </div>
      </section>

    </div>
  )
}
