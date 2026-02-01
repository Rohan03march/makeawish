"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/context/CartContext"
import { Check, ChevronRight, ChevronLeft, Upload, Type, Box, Heart, LayoutGrid } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"

// Define types to avoid TS inference errors
type BaseOption = {
    id: string
    name: string
    price: number
    color: string
    image: string
    description: string
    style?: React.CSSProperties
}

type FillingOption = {
    id: string
    name: string
    price: number
    description: string
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
    { id: 'base', title: 'Choose Base' },
    { id: 'filling', title: 'Select Filling' },
    { id: 'shape', title: 'Pick Shape' },
    { id: 'extras', title: 'Personalize' },
    { id: 'review', title: 'Review' }
]

const BASES: BaseOption[] = [
    { id: 'dark', name: '70% Dark Chocolate', price: 850, color: 'bg-[#3E2723]', image: '/dark-truffle.png', description: "Intense, bittersweet cocoa from Ecuador." },
    { id: 'milk', name: 'Creamy Milk Chocolate', price: 850, color: 'bg-[#8D6E63]', image: '/milk-swirl.png', description: "Smooth Alpine milk chocolate." },
    { id: 'white', name: 'Velvet White Chocolate', price: 1000, color: 'bg-[#F9A825]', image: '/milk-swirl.png', style: { filter: 'brightness(1.5) sepia(0.3)' }, description: "Sweet, creamy, and delicate." },
    { id: 'ruby', name: 'Ruby Chocolate', price: 1250, color: 'bg-[#D32F2F]', image: '/milk-swirl.png', style: { filter: 'hue-rotate(320deg) saturate(1.2)' }, description: "Naturally pink with berry notes." }
]

const FILLINGS: FillingOption[] = [
    { id: 'none', name: 'No Filling (Solid)', price: 0, description: "Pure chocolate bliss." },
    { id: 'nuts', name: 'Roasted Hazelnuts', price: 400, description: "Crunchy Piedmont hazelnuts." },
    { id: 'caramel', name: 'Salted Caramel', price: 350, description: "Gooey caramel with sea salt." },
    { id: 'fruit', name: 'Dried Raspberry', price: 500, description: "Tart and tangy fruit pieces." },
    { id: 'liqueur', name: 'Irish Cream', price: 700, description: "A boozy kick of Baileys." }
]

const SHAPES: ShapeOption[] = [
    { id: 'bar', name: 'Classic Bar', price: 0, image: '/gift-box.png', description: "Timeless elegance." },
    { id: 'heart', name: 'Heart Shape', price: 400, icon: Heart, description: "For your special one." },
    { id: 'squares', name: 'Individual Squares', price: 200, icon: LayoutGrid, description: "Perfect for sharing." },
    { id: 'letters', name: 'Custom Letters', price: 850, icon: Type, description: "Spell it out." }
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
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleAddToCart = () => {
        if (!selections.base || !selections.filling || !selections.shape) return

        addToCart({
            _id: `custom-${Date.now()}`,
            name: `Custom ${selections.base.name}`,
            price: calculateTotal(),
            qty: 1,
            countInStock: 100, // Custom items are always available
            image: selections.shape.image || baseImage(selections.base.id),
        }, 1)
    }

    // Helper for fallback images based on base if shape has no image
    const baseImage = (baseId: string) => {
        const base = BASES.find(b => b.id === baseId)
        return base ? base.image : '/placeholder.png'
    }

    const renderStep = () => {
        switch (STEPS[currentStep].id) {
            case 'base':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {BASES.map(base => (
                            <motion.div
                                key={base.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className={`cursor-pointer transition-all border-2 h-full flex flex-col items-center text-center p-8 bg-chocolate-900/40 backdrop-blur-sm ${selections.base?.id === base.id ? 'border-gold-500 shadow-[0_0_30px_rgba(212,175,55,0.2)]' : 'border-white/5 hover:border-gold-500/50'}`}
                                    onClick={() => setSelections(prev => ({ ...prev, base }))}
                                >
                                    <div className={`relative w-40 h-40 mb-6 drop-shadow-2xl flex items-center justify-center`}>
                                        <Image
                                            src={base.image}
                                            alt={base.name}
                                            fill
                                            className="object-contain"
                                            style={base.style || {}}
                                        />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-white mb-2">{base.name}</h3>
                                    <p className="text-chocolate-300 mb-4 text-sm">{base.description}</p>
                                    <p className="text-gold-500 font-bold mt-auto text-xl">+₹{base.price}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )
            case 'filling':
                return (
                    <div className="space-y-4">
                        {FILLINGS.map(filling => (
                            <motion.div
                                key={filling.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => setSelections(prev => ({ ...prev, filling }))}
                                className={`flex items-center justify-between p-6 rounded-xl border-2 cursor-pointer transition-all ${selections.filling?.id === filling.id ? 'border-gold-500 bg-gold-500/10' : 'border-white/5 bg-chocolate-900/40 hover:bg-chocolate-800/60'}`}
                            >
                                <div className="flex flex-col">
                                    <span className="text-xl font-medium text-white font-serif">{filling.name}</span>
                                    <span className="text-sm text-chocolate-300">{filling.description}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-gold-500 font-bold text-lg">
                                        {filling.price === 0 ? 'Free' : `+₹${filling.price}`}
                                    </span>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selections.filling?.id === filling.id ? 'border-gold-500 bg-gold-500 text-chocolate-950' : 'border-chocolate-500'}`}>
                                        {selections.filling?.id === filling.id && <Check className="w-4 h-4" />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )
            case 'shape':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {SHAPES.map(shape => {
                            const Icon = shape.icon
                            return (
                                <motion.div
                                    key={shape.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card
                                        className={`cursor-pointer transition-all border-2 h-full flex flex-col items-center text-center p-8 bg-chocolate-900/40 backdrop-blur-sm group ${selections.shape?.id === shape.id ? 'border-gold-500 shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-gold-500/5' : 'border-white/5 hover:border-gold-500/30'}`}
                                        onClick={() => setSelections(prev => ({ ...prev, shape }))}
                                    >
                                        <div className={`w-36 h-36 rounded-full mb-6 flex items-center justify-center transition-all duration-300 ${selections.shape?.id === shape.id ? 'bg-gold-500/20' : 'bg-white/5 group-hover:bg-gold-500/10'}`}>
                                            {shape.image ? (
                                                <div className="relative w-28 h-28 drop-shadow-2xl">
                                                    <Image
                                                        src={shape.image}
                                                        alt={shape.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                Icon && <Icon className={`w-16 h-16 ${selections.shape?.id === shape.id ? 'text-gold-500' : 'text-chocolate-200 group-hover:text-gold-400'}`} />
                                            )}
                                        </div>

                                        <h3 className="text-2xl font-serif font-bold text-white mb-2">{shape.name}</h3>
                                        <p className="text-chocolate-300 mb-4 text-sm">{shape.description}</p>
                                        <p className={`font-bold mt-auto text-xl ${selections.shape?.id === shape.id ? 'text-gold-500' : 'text-gold-500/70'}`}>
                                            {shape.price === 0 ? 'Included' : `+₹${shape.price}`}
                                        </p>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                )
            case 'extras':
                return (
                    <div className="space-y-8 max-w-2xl mx-auto">
                        <div className="bg-chocolate-900/40 p-8 rounded-2xl border border-white/5 shadow-xl">
                            <div className="flex items-center gap-4 mb-6 text-white text-xl font-serif">
                                <Type className="text-gold-500 h-8 w-8" />
                                <h3 className="font-bold">Text Engraving</h3>
                            </div>
                            <Input
                                placeholder="Enter message (e.g. Happy Birthday)"
                                maxLength={30}
                                value={selections.text}
                                onChange={(e) => setSelections(prev => ({ ...prev, text: e.target.value }))}
                                className="bg-chocolate-950/50 border-chocolate-600 text-white h-14 text-lg px-6 focus:ring-gold-500"
                            />
                            <div className="flex justify-between mt-3 text-sm text-chocolate-300">
                                <span>Add a personal touch to your chocolate.</span>
                                <span>+₹450 • Max 30 chars</span>
                            </div>
                        </div>

                        <div className="bg-chocolate-900/20 p-8 rounded-2xl border border-white/5 opacity-50 cursor-not-allowed border-dashed">
                            <div className="flex items-center gap-4 mb-6 text-white text-xl font-serif">
                                <Upload className="text-gold-500 h-8 w-8" />
                                <h3 className="font-bold">Upload Logo (Coming Soon)</h3>
                            </div>
                            <div className="border-2 border-dashed border-chocolate-700 rounded-xl p-12 text-center text-chocolate-500">
                                Drag & drop or click to upload
                            </div>
                        </div>
                    </div>
                )
            case 'review':
                return (
                    <div className="bg-chocolate-900/60 p-10 rounded-3xl border border-gold-500/20 text-white max-w-2xl mx-auto backdrop-blur-md shadow-2xl">
                        <h3 className="text-4xl font-serif font-bold mb-8 text-white text-center">Your Masterpiece</h3>

                        <div className="space-y-6 text-lg">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-chocolate-200">Base Chocolate</span>
                                <span className="font-bold text-xl">{selections.base?.name}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-chocolate-200">Filling Choice</span>
                                <span className="font-bold text-xl">{selections.filling?.name}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-chocolate-200">Shape</span>
                                <span className="font-bold text-xl">{selections.shape?.name}</span>
                            </div>
                            {selections.text && (
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-chocolate-200">Engraving</span>
                                    <span className="font-serif italic text-gold-400 text-xl">"{selections.text}"</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-12 pt-6 border-t font-serif">
                            <span className="text-2xl text-chocolate-200">Total</span>
                            <span className="text-5xl font-bold text-gold-500">₹{calculateTotal().toLocaleString()}</span>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen py-16 px-4 md:px-6 bg-chocolate-950 bg-[url('/noise.png')]">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">Craft Your Pleasure</h1>
                    <p className="text-chocolate-200 text-xl font-light">Design your unique chocolate experience in 5 simple steps.</p>
                </div>

                {/* Steps Indicator */}
                <div className="flex justify-between items-center mb-16 relative px-4 md:px-12">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-chocolate-800 -z-10" />
                    <motion.div
                        className="absolute top-1/2 left-0 h-0.5 bg-gold-500 -z-10"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                    {STEPS.map((step, idx) => (
                        <div key={step.id} className="flex flex-col items-center relative group">
                            <motion.div
                                animate={{
                                    backgroundColor: idx <= currentStep ? '#D4AF37' : '#2A1A15',
                                    borderColor: idx <= currentStep ? '#D4AF37' : '#5D4037',
                                    scale: idx === currentStep ? 1.2 : 1
                                }}
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 z-10 text-lg shadow-xl ${idx <= currentStep ? 'text-chocolate-950' : 'text-chocolate-500'}`}
                            >
                                {idx + 1}
                            </motion.div>
                            <span className={`absolute -bottom-8 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${idx <= currentStep ? 'text-gold-500' : 'text-chocolate-600'}`}>{step.title}</span>
                        </div>
                    ))}
                </div>

                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.4 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-between mt-16 pt-8 border-t border-white/5">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="border-chocolate-600 text-chocolate-300 hover:text-white hover:bg-chocolate-800 h-14 px-8 text-lg rounded-full"
                    >
                        <ChevronLeft className="mr-2 h-5 w-5" /> Previous
                    </Button>

                    {currentStep === STEPS.length - 1 ? (
                        <Button
                            onClick={handleAddToCart}
                            className="bg-gold-500 text-chocolate-950 hover:bg-white hover:text-chocolate-950 px-10 h-14 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                        >
                            Add to Cart - ₹{calculateTotal().toLocaleString()}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            disabled={
                                (currentStep === 0 && !selections.base) ||
                                (currentStep === 1 && !selections.filling) ||
                                (currentStep === 2 && !selections.shape)
                            }
                            className="bg-gold-500 text-chocolate-950 hover:bg-white hover:text-chocolate-950 px-10 h-14 text-lg font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            Next Step <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
