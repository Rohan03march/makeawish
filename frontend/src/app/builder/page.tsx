"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { Check, ChevronRight, ChevronLeft, Upload, Type, Box, Heart, LayoutGrid, Star, Sparkles, Gift } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"

// Types
type BaseOption = {
    id: string
    name: string
    price: number
    color: string
    image: string
    description: string
    style?: React.CSSProperties
    cocoa?: string
}

type FillingOption = {
    id: string
    name: string
    price: number
    description: string
    image?: string
    color: string
}

type ShapeOption = {
    id: string
    name: string
    price: number
    description: string
    image?: string
    icon?: React.ElementType
}

const STEPS = [
    { id: 'base', title: 'Select Base', subtitle: 'Start with the finest cocoa' },
    { id: 'filling', title: 'Choose Filling', subtitle: 'Add a burst of flavor' },
    { id: 'shape', title: 'Pick Shape', subtitle: 'Define the form' },
    { id: 'extras', title: 'Personalize', subtitle: 'Make it yours' },
    { id: 'review', title: 'Final Review', subtitle: 'Ready for crafting' }
]

const BASES: BaseOption[] = [
    { id: 'dark', name: '70% Dark Chocolate', price: 850, color: 'bg-[#3E2723]', image: '/dark-truffle.png', description: "Intense, bittersweet cocoa sourced from the equator.", cocoa: "70%" },
    { id: 'milk', name: 'Creamy Milk Chocolate', price: 850, color: 'bg-[#8D6E63]', image: '/milk-swirl.png', description: "Smooth, velvety texture with a hint of vanilla.", cocoa: "45%" },
    { id: 'white', name: 'Velvet White Chocolate', price: 1000, color: 'bg-[#F9A825]', image: '/milk-swirl.png', style: { filter: 'brightness(1.5) sepia(0.3)' }, description: "Sweet, creamy, and delicate with cocoa butter.", cocoa: "30%" },
    { id: 'ruby', name: 'Ruby Chocolate', price: 1250, color: 'bg-[#D32F2F]', image: '/milk-swirl.png', style: { filter: 'hue-rotate(320deg) saturate(1.2)' }, description: "Naturally pink with fresh berry notes.", cocoa: "47%" }
]

const FILLINGS: FillingOption[] = [
    { id: 'none', name: 'Pure Solid', price: 0, description: "Just pure, unadulterated chocolate.", color: "bg-chocolate-800" },
    { id: 'nuts', name: 'Roasted Hazelnuts', price: 400, description: "Crunchy Piedmont hazelnuts tailored for texture.", color: "bg-amber-700" },
    { id: 'caramel', name: 'Salted Caramel', price: 350, description: "Gooey caramel with a pinch of sea salt.", color: "bg-orange-600" },
    { id: 'fruit', name: 'Dried Raspberry', price: 500, description: "Tart and tangy fruit pieces for contrast.", color: "bg-red-600" },
    { id: 'liqueur', name: 'Irish Cream', price: 700, description: "A smooth boozy kick of Baileys.", color: "bg-amber-200" },
    { id: 'matcha', name: 'Matcha Green Tea', price: 600, description: "Earthy notes of premium Japanese matcha.", color: "bg-green-700" }
]

const SHAPES: ShapeOption[] = [
    { id: 'bar', name: 'Signature Bar', price: 0, image: '/gift-box.png', description: "Timeless elegance in a classic block." },
    { id: 'heart', name: 'Love Heart', price: 400, icon: Heart, description: "The perfect symbol of affection." },
    { id: 'squares', name: 'Tasting Squares', price: 200, icon: LayoutGrid, description: "Individual bites for sharing." },
    { id: 'letters', name: 'Custom Letters', price: 850, icon: Type, description: "Spell out your message." }
]

export default function BuilderPage() {
    const [currentStep, setCurrentStep] = React.useState(0)
    const [selections, setSelections] = React.useState({
        base: null as BaseOption | null,
        filling: null as FillingOption | null,
        shape: null as ShapeOption | null,
        text: '',
    })

    const { addToCart } = useCart()

    const calculateTotal = () => {
        let total = 0
        if (selections.base) total += selections.base.price
        if (selections.filling) total += selections.filling.price
        if (selections.shape) total += selections.shape.price
        if (selections.text) total += 450
        return total
    }

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1)
    }

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1)
    }

    const handleAddToCart = () => {
        if (!selections.base || !selections.filling || !selections.shape) return

        addToCart({
            _id: `custom-${Date.now()}`,
            name: `Custom ${selections.base.name}`,
            price: calculateTotal(),
            qty: 1,
            countInStock: 100,
            image: selections.shape.image || baseImage(selections.base.id),
            customDetails: {
                base: selections.base.name,
                filling: selections.filling.name,
                shape: selections.shape.name,
                text: selections.text
            }
        }, 1)
    }

    const baseImage = (baseId: string) => {
        const base = BASES.find(b => b.id === baseId)
        return base ? base.image : '/placeholder.png'
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    }

    const renderStep = () => {
        switch (STEPS[currentStep].id) {
            case 'base':
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="flex md:grid md:grid-cols-2 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-12 md:pb-0 px-4 md:px-0 no-scrollbar"
                    >
                        {BASES.map(base => (
                            <div
                                key={base.id}
                                onClick={() => setSelections(prev => ({ ...prev, base }))}
                                className={`min-w-[75vw] md:min-w-0 snap-center group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 border-2 ${selections.base?.id === base.id ? 'border-gold-500 bg-chocolate-900/80 shadow-[0_0_40px_rgba(198,166,51,0.2)]' : 'border-white/5 bg-chocolate-900/40 hover:border-gold-500/30'}`}
                            >
                                <div className="absolute top-0 right-0 p-4 z-10">
                                    {selections.base?.id === base.id && <div className="bg-gold-500 text-chocolate-950 rounded-full p-2"><Check size={20} strokeWidth={3} /></div>}
                                </div>

                                <div className="flex flex-col md:flex-row h-full">
                                    <div className="w-full md:w-2/5 p-8 flex items-center justify-center bg-black/20">
                                        <div className="relative w-32 h-32 md:w-40 md:h-40 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl">
                                            <Image src={base.image} alt={base.name} fill className="object-contain" style={base.style || {}} />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-serif font-bold text-white group-hover:text-gold-400 transition-colors">{base.name}</h3>
                                        </div>
                                        <div className="inline-block bg-white/10 rounded px-2 py-1 text-xs font-bold text-gold-500 w-fit mb-4">{base.cocoa} Cocoa</div>
                                        <p className="text-chocolate-200 text-sm leading-relaxed mb-6">{base.description}</p>
                                        <div className="mt-auto flex justify-between items-center">
                                            <span className="text-xl font-bold text-gold-500">₹{base.price}</span>
                                            <span className="text-xs text-chocolate-400 uppercase tracking-widest font-semibold group-hover:text-white transition-colors">Select Base</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )
            case 'filling':
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-12 md:pb-0 px-4 md:px-0 no-scrollbar"
                    >
                        {FILLINGS.map(filling => (
                            <div
                                key={filling.id}
                                onClick={() => setSelections(prev => ({ ...prev, filling }))}
                                className={`min-w-[65vw] md:min-w-0 snap-center relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-4 h-full ${selections.filling?.id === filling.id ? 'border-gold-500 bg-chocolate-800 shadow-xl' : 'border-white/5 bg-chocolate-900/40 hover:bg-chocolate-800/60 hover:border-white/10'}`}
                            >
                                <div className={`w-12 h-12 rounded-full ${filling.color} flex items-center justify-center mb-2 shadow-inner border border-white/10`}>
                                    {selections.filling?.id === filling.id && <Check className="text-white" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif font-bold text-white mb-1">{filling.name}</h3>
                                    <p className="text-sm text-chocolate-300 leading-snug">{filling.description}</p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-gold-500 font-bold">{filling.price === 0 ? 'Included' : `+₹${filling.price}`}</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )
            case 'shape':
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="flex md:grid md:grid-cols-2 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-12 md:pb-0 px-4 md:px-0 no-scrollbar"
                    >
                        {SHAPES.map(shape => {
                            const Icon = shape.icon
                            const isBar = shape.id === 'bar'

                            return (
                                <motion.div
                                    key={shape.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelections(prev => ({ ...prev, shape }))}
                                    className={`min-w-[75vw] md:min-w-0 snap-center relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300 md:col-span-${isBar ? '2' : '1'} ${selections.shape?.id === shape.id ? 'ring-2 ring-gold-500 shadow-[0_0_50px_rgba(198,166,51,0.3)]' : 'hover:shadow-xl hover:bg-white/5'}`}
                                >
                                    <div className={`h-full flex flex-col items-center p-8 relative z-10 ${selections.shape?.id === shape.id ? 'bg-gradient-to-br from-[#3E2723] to-[#1a0f0a]' : 'bg-[#2A1812]/40 backdrop-blur-md border border-white/5'}`}>

                                        {/* Selection Indicator */}
                                        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${selections.shape?.id === shape.id ? 'bg-gold-500 text-chocolate-950 opacity-100 scale-100' : 'bg-white/10 opacity-0 scale-75'}`}>
                                            <Check size={18} strokeWidth={3} />
                                        </div>

                                        {/* Premium Badge for Bar */}
                                        {isBar && (
                                            <div className="absolute top-4 left-4 bg-gold-500/20 text-gold-500 text-xs font-bold px-3 py-1 rounded-full border border-gold-500/30 uppercase tracking-widest flex items-center gap-2">
                                                <Star size={12} fill="currentColor" /> Signature Choice
                                            </div>
                                        )}

                                        <div className={`relative mb-6 transition-all duration-500 ${isBar ? 'w-full max-w-sm h-56' : 'w-32 h-32'} ${selections.shape?.id === shape.id ? 'scale-105 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]' : 'grayscale-[0.3] hover:grayscale-0'}`}>
                                            {/* Shine effect overlay for the bar */}
                                            {isBar && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" />}

                                            {shape.image ? (
                                                <Image
                                                    src={shape.image}
                                                    alt={shape.name}
                                                    fill
                                                    className="object-contain"
                                                    priority={isBar}
                                                />
                                            ) : (
                                                <div className={`w-full h-full rounded-full flex items-center justify-center ${selections.shape?.id === shape.id ? 'bg-gold-500/20 text-gold-500' : 'bg-white/5 text-chocolate-300'}`}>
                                                    {Icon && <Icon className="w-1/2 h-1/2" />}
                                                </div>
                                            )}
                                        </div>

                                        <h3 className={`font-serif font-bold text-white mb-2 ${isBar ? 'text-4xl text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-500' : 'text-2xl'}`}>{shape.name}</h3>
                                        <p className="text-chocolate-200 mb-8 max-w-sm text-center text-sm leading-relaxed">{shape.description}</p>

                                        <div className={`mt-auto px-6 py-3 rounded-full font-bold transition-all duration-300 ${selections.shape?.id === shape.id ? 'bg-gold-500 text-chocolate-950 shadow-[0_0_20px_rgba(198,166,51,0.4)]' : 'bg-white/5 text-gold-500 hover:bg-white/10'}`}>
                                            {shape.price === 0 ? 'Included' : `+₹${shape.price}`}
                                        </div>
                                    </div>

                                    {/* Animated Background Gradient for Selected State */}
                                    {selections.shape?.id === shape.id && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-gold-500/10 to-transparent pointer-events-none" />
                                    )}
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )
            case 'extras':
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12"
                    >
                        {/* Left Column: Input */}
                        <div className="space-y-8">
                            <div className="bg-chocolate-900/60 p-8 rounded-3xl border border-white/5 shadow-xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Engraving</h3>
                                        <p className="text-sm text-chocolate-300">Add a personal message</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm text-chocolate-200 uppercase tracking-widest font-semibold">Your Message</label>
                                    <Input
                                        placeholder="Type something sweet..."
                                        maxLength={30}
                                        value={selections.text}
                                        onChange={(e) => setSelections(prev => ({ ...prev, text: e.target.value }))}
                                        className="bg-black/20 border-white/10 text-white h-16 text-xl px-6 focus:ring-gold-500 focus:border-gold-500 rounded-xl"
                                    />
                                    <div className="flex justify-between text-xs text-chocolate-400">
                                        <span>Max 30 characters</span>
                                        <span>{selections.text.length} / 30</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-chocolate-200">Engraving Cost</span>
                                        <span className="text-gold-500 font-bold">+₹450</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-chocolate-900/20 p-8 rounded-3xl border border-dashed border-white/10 opacity-70">
                                <div className="flex items-center gap-4 mb-4">
                                    <Upload className="text-chocolate-500" />
                                    <span className="text-chocolate-400 font-medium">Logo Upload (Enterprise Only)</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Preview */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-gold-500/5 blur-3xl rounded-full" />
                            <div className="relative w-full aspect-square max-w-sm bg-[#3E2723] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center border-8 border-[#5D4037] p-8">
                                <div className="text-center space-y-2">
                                    <div className="w-20 h-20 mx-auto opacity-20 mb-4">
                                        {/* Chocolate texture/brand logo placeholder */}
                                        <Gift className="w-full h-full text-[#5D4037]" />
                                    </div>
                                    {selections.text ? (
                                        <h2 className="font-serif italic text-3xl text-[#8D6E63] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] transform -rotate-6">
                                            "{selections.text}"
                                        </h2>
                                    ) : (
                                        <span className="text-[#5D4037] text-lg font-serif italic opacity-50">Your Text Here</span>
                                    )}
                                </div>
                                {/* Light sheen effect */}
                                <div className="absolute top-10 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                            </div>
                        </div>
                    </motion.div>
                )
            case 'review':
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="max-w-2xl mx-auto"
                    >
                        <div className="bg-[#FAF8F5] text-chocolate-950 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
                            {/* Vintage Paper Texture Overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] pointer-events-none" />

                            {/* Decorative Border */}
                            <div className="absolute inset-4 border border-chocolate-900/10 pointer-events-none" />
                            <div className="absolute inset-5 border border-dashed border-chocolate-900/10 pointer-events-none" />

                            <div className="relative z-10 text-center mb-10">
                                <div className="inline-block border-b-2 border-gold-500 pb-2 mb-2">
                                    <span className="text-xs uppercase tracking-[0.3em] text-chocolate-500">Make A Wish</span>
                                </div>
                                <h2 className="text-4xl font-serif font-bold text-chocolate-900">Custom Creation</h2>
                            </div>

                            <div className="space-y-6 relative z-10 px-4">
                                <div className="flex justify-between items-baseline border-b border-chocolate-900/10 pb-4 border-dashed">
                                    <div>
                                        <span className="block text-sm text-chocolate-500 uppercase tracking-wider mb-1">Base</span>
                                        <span className="text-xl font-serif font-bold">{selections.base?.name}</span>
                                    </div>
                                    <span className="font-mono text-lg text-chocolate-600">₹{selections.base?.price}</span>
                                </div>

                                <div className="flex justify-between items-baseline border-b border-chocolate-900/10 pb-4 border-dashed">
                                    <div>
                                        <span className="block text-sm text-chocolate-500 uppercase tracking-wider mb-1">Filling</span>
                                        <span className="text-xl font-serif font-bold">{selections.filling?.name}</span>
                                    </div>
                                    <span className="font-mono text-lg text-chocolate-600">
                                        {selections.filling?.price === 0 ? '-' : `₹${selections.filling?.price}`}
                                    </span>
                                </div>

                                <div className="flex justify-between items-baseline border-b border-chocolate-900/10 pb-4 border-dashed">
                                    <div>
                                        <span className="block text-sm text-chocolate-500 uppercase tracking-wider mb-1">Shape</span>
                                        <span className="text-xl font-serif font-bold">{selections.shape?.name}</span>
                                    </div>
                                    <span className="font-mono text-lg text-chocolate-600">
                                        {selections.shape?.price === 0 ? '-' : `₹${selections.shape?.price}`}
                                    </span>
                                </div>

                                {selections.text && (
                                    <div className="flex justify-between items-baseline border-b border-chocolate-900/10 pb-4 border-dashed">
                                        <div>
                                            <span className="block text-sm text-chocolate-500 uppercase tracking-wider mb-1">Engraving</span>
                                            <span className="text-xl font-serif italic text-chocolate-700">"{selections.text}"</span>
                                        </div>
                                        <span className="font-mono text-lg text-chocolate-600">₹450</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-6 mt-6">
                                    <span className="text-2xl font-serif text-chocolate-900">Total</span>
                                    <span className="text-4xl font-bold text-gold-600">₹{calculateTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8 text-chocolate-300 text-sm">
                            <p>Handcrafted with passion. Delivered with care.</p>
                        </div>
                    </motion.div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-chocolate-950 bg-[url('/noise.png')] text-white font-sans selection:bg-gold-500 selection:text-chocolate-950 pb-24">

            {/* Header / Progress */}
            <div className="sticky top-0 z-50 bg-chocolate-950/80 backdrop-blur-md border-b border-white/5 py-6">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                                {STEPS[currentStep].title}
                            </h1>
                            <p className="text-chocolate-300 text-sm hidden md:block">{STEPS[currentStep].subtitle}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl md:text-5xl font-serif font-bold text-white/10">{currentStep + 1}</span>
                            <span className="text-lg text-white/10 font-serif">/{STEPS.length}</span>
                        </div>
                    </div>

                    {/* Progress Line */}
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                        <motion.div
                            className="h-full bg-gold-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl py-12">
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-chocolate-900/90 backdrop-blur-lg border-t border-white/5 p-4 z-40">
                <div className="container mx-auto max-w-6xl flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="text-chocolate-300 hover:text-white hover:bg-white/5 disabled:opacity-0"
                    >
                        <ChevronLeft className="mr-2 h-5 w-5" /> Back
                    </Button>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right mr-4">
                            <div className="text-xs text-chocolate-400 uppercase tracking-wider">Current Total</div>
                            <div className="text-xl font-bold text-gold-500">₹{calculateTotal().toLocaleString()}</div>
                        </div>

                        {currentStep === STEPS.length - 1 ? (
                            <Button
                                onClick={handleAddToCart}
                                className="bg-gold-500 text-chocolate-950 hover:bg-white hover:text-chocolate-950 px-8 py-6 text-lg font-bold rounded-full shadow-[0_0_30px_rgba(198,166,51,0.3)] hover:shadow-[0_0_50px_rgba(198,166,51,0.5)] transition-all"
                            >
                                Add to Cart
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                disabled={
                                    (currentStep === 0 && !selections.base) ||
                                    (currentStep === 1 && !selections.filling) ||
                                    (currentStep === 2 && !selections.shape)
                                }
                                className="bg-white text-chocolate-950 hover:bg-gold-500 px-8 py-6 text-lg font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next Step <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
