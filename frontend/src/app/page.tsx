"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Star, Quote } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image
            src="/hero-v2.png" // Updated to use the new generated hero
            alt="Artisan Chocolate"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-chocolate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent opacity-50" />
        </motion.div>

        <div className="relative z-10 container px-4 text-center text-white">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2, delayChildren: 0.3 }
              }
            }}
            className="space-y-4 max-w-5xl mx-auto"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="flex items-center justify-center gap-4 text-gold-400 font-serif italic text-lg md:text-xl tracking-wide"
            >
              <span className="h-[1px] w-12 bg-gold-400/50" />
              Est. 2024 • Zurich, Switzerland
              <span className="h-[1px] w-12 bg-gold-400/50" />
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="text-5xl md:text-7xl lg:text-[7rem] font-bold font-serif leading-[0.95] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-chocolate-100 to-chocolate-300 drop-shadow-2xl py-2"
            >
              The Art of <br />
              <span className="text-gold-gradient italic bg-clip-text text-transparent bg-gradient-to-r from-gold-300 via-gold-500 to-gold-400">Indulgence</span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              className="text-xl md:text-2xl text-chocolate-100/90 max-w-2xl mx-auto font-light leading-relaxed tracking-wide"
            >
              Experience chocolate in its purest form. Sustainable, handcrafted, and unapologetically luxurious.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link href="/shop">
                <Button className="bg-gold-500 text-chocolate-950 hover:bg-white hover:text-chocolate-950 rounded-full h-16 px-12 text-lg font-bold tracking-wide transition-all duration-300 shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:-translate-y-1 hover:scale-105">
                  Explore Collection
                </Button>
              </Link>
              <Link href="/builder">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white rounded-full h-16 px-12 text-lg font-medium tracking-wide backdrop-blur-md transition-all duration-300 hover:scale-105">
                  Build Your Box
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>


      </section>

      {/* Intro / Philosophy */}
      <section className="py-32 bg-chocolate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/milk-swirl.png"
                alt="Chocolate Swirl"
                fill
                className="object-cover hover:scale-110 transition-transform duration-[1.5s]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
                Crafted for the <br />
                <span className="text-gold-500 italic">Connoisseur</span>
              </h2>
              <div className="w-20 h-1 bg-gold-500" />
              <p className="text-lg text-chocolate-200 leading-relaxed">
                We believe chocolate is more than just a treat—it's a journey. From the sun-drenched plantations of Ecuador to our atelier in Zurich, every step is guided by an obsession with quality.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <h4 className="text-2xl font-serif text-gold-400 mb-2">100%</h4>
                  <p className="text-sm text-chocolate-300">Ethically Sourced Cocoa</p>
                </div>
                <div>
                  <h4 className="text-2xl font-serif text-gold-400 mb-2">24h</h4>
                  <p className="text-sm text-chocolate-300">Conching Process</p>
                </div>
              </div>
              <Link href="/about" className="inline-flex items-center text-gold-400 hover:text-white transition-colors group">
                <span className="border-b border-gold-400 pb-1 group-hover:border-white transition-colors">Read Our Story</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collections - Premium Carousel with Apple TV Style */}
      <section className="py-24 bg-gradient-to-b from-chocolate-950 to-chocolate-900 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white">Curated Collections</h2>
            <p className="text-chocolate-200 max-w-xl mx-auto">Discover our range of award-winning chocolates, from intense dark origins to creamy milk blends.</p>
          </div>

          <div className="relative group/carousel">
            {/* Navigation Buttons */}
            <button
              onClick={() => {
                const container = document.getElementById('carousel-container');
                if (container) container.scrollBy({ left: -400, behavior: 'smooth' });
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-16 w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white/20 shadow-2xl"
            >
              <ArrowRight className="h-6 w-6 rotate-180" />
            </button>
            <button
              onClick={() => {
                const container = document.getElementById('carousel-container');
                if (container) container.scrollBy({ left: 400, behavior: 'smooth' });
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-16 w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white/20 shadow-2xl"
            >
              <ArrowRight className="h-6 w-6" />
            </button>

            {/* Carousel Container */}
            <div
              id="carousel-container"
              className="flex overflow-x-auto pb-12 pt-8 gap-6 snap-x snap-mandatory scrollbar-hide no-scrollbar px-8 md:px-16"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                { title: "Midnight Dark", image: "/dark-truffle.png", desc: "70% Cocoa Origin", color: "from-gray-900 to-black" },
                { title: "Velvet Milk", image: "/milk-swirl.png", desc: "Swiss Alpine Milk", color: "from-amber-900 to-chocolate-800" },
                { title: "Golden Gift", image: "/gift-box.png", desc: "Luxury Hampers", color: "from-chocolate-800 to-chocolate-950" },
                { title: "Ruby Passion", image: "/milk-swirl.png", desc: "Berry Notes", color: "from-pink-900 to-rose-950" },
                { title: "Hazelnut", image: "/dark-truffle.png", desc: "Roasted Crunch", color: "from-chocolate-700 to-chocolate-900" },
                { title: "Pistachio", image: "/milk-swirl.png", desc: "Sicilian Green", color: "from-emerald-900 to-green-950" },
                { title: "Salted Caramel", image: "/dark-truffle.png", desc: "Sea Salt Butter", color: "from-orange-900 to-chocolate-800" },
                { title: "Champagne", image: "/gift-box.png", desc: "Vintage Marc", color: "from-yellow-900 to-gold-900" }
              ].map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="min-w-[70vw] md:min-w-[360px] lg:min-w-[400px] snap-center relative h-[500px] cursor-pointer perspective-1000 shrink-0"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      y: -10,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-full h-full rounded-[2rem] overflow-hidden relative border border-white/5 bg-gradient-to-br from-chocolate-800/50 to-chocolate-950/50 backdrop-blur-sm"
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-80`} />

                    {/* Image Layer - Floating Effect */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center p-8 z-10"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={cat.image}
                          alt={cat.title}
                          fill
                          className="object-contain drop-shadow-2xl"
                        />
                      </div>
                    </motion.div>

                    {/* Overlay Gradient for Text */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 pointer-events-none" />

                    {/* Text Content - Floating at Bottom */}
                    <div className="absolute bottom-8 left-8 z-30">
                      <motion.h3
                        className="text-3xl font-serif font-bold text-white mb-1 shadow-black drop-shadow-lg"
                        whileHover={{ scale: 1.05, originX: 0 }}
                      >
                        {cat.title}
                      </motion.h3>
                      <p className="text-gold-400 font-medium tracking-wide uppercase text-sm shadow-black drop-shadow-md">{cat.desc}</p>
                    </div>

                    {/* Shine Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none z-40" />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Scroll Progress Bar */}
            <div className="hidden md:flex justify-center flex-col items-center gap-2 mt-4">
              <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  whileInView={{ x: '100%' }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="h-full w-full bg-gold-500/30 blur-[1px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="py-32 bg-chocolate-50 text-chocolate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 relative order-2 md:order-1">
              <div className="relative aspect-square w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-3xl" />
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 h-full w-full"
                >
                  <Image
                    src="/gift-box.png"
                    alt="The Royal Box"
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                  />
                </motion.div>
              </div>
            </div>

            <div className="flex-1 space-y-8 text-center md:text-left order-1 md:order-2">
              <div className="inline-block px-4 py-1 border border-gold-600 rounded-full text-gold-700 text-xs font-bold tracking-widest uppercase mb-4">
                Limited Edition
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-chocolate-900 leading-tight">
                The Royal <br />Selection
              </h2>
              <p className="text-chocolate-600 text-xl leading-relaxed max-w-md mx-auto md:mx-0">
                An exquisite assortment of 24 hand-painted truffles, presented in our signature gold-embossed box. The ultimate gesture of appreciation.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start pt-4">
                <Button className="bg-chocolate-900 text-white hover:bg-gold-500 hover:text-chocolate-950 h-16 px-10 rounded-none text-lg font-bold transition-all shadow-xl">
                  Add to Cart — ₹7,200
                </Button>
                <div className="flex items-center gap-2 text-chocolate-600 text-sm font-medium">
                  <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
                  <span>4.9 (128 Reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-chocolate-900 text-white text-center">
        <div className="container px-4 md:px-6">
          <Quote className="h-12 w-12 mx-auto text-gold-500 mb-8 opacity-50" />
          <h3 className="text-3xl md:text-5xl font-serif font-medium leading-tight max-w-4xl mx-auto mb-10">
            “I've tasted chocolates from all over the world, but nothing compares to the complexity and texture of Luxe. A truly transcendental experience.”
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full overflow-hidden relative">
              {/* Placeholder avatar if needed, or just initials */}
              <div className="absolute inset-0 bg-gold-400 flex items-center justify-center text-chocolate-950 font-bold text-xl">ES</div>
            </div>
            <div className="text-left">
              <div className="font-bold text-gold-400">Elena S.</div>
              <div className="text-chocolate-300 text-sm">Zurich, Switzerland</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
