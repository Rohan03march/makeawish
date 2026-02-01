"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface CartItem {
    _id: string
    name: string
    price: number
    image: string
    countInStock: number
    qty: number
}

interface CartContextType {
    cartItems: CartItem[]
    addToCart: (item: CartItem, qty: number) => void
    removeFromCart: (id: string) => void
    updateQty: (id: string, qty: number) => void
    clearCart: () => void
    itemsPrice: number
    shippingPrice: number
    taxPrice: number
    totalPrice: number
    // Aliases and UI State
    items?: CartItem[]
    removeItem?: (id: string) => void
    updateQuantity?: (id: string, qty: number) => void
    cartTotal?: number
    isCartOpen: boolean
    setIsCartOpen: (isOpen: boolean) => void
    cartCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    // Load cart from local storage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems")
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart)
                // Sanitize loaded items to ensure no NaN values persist
                const cleanCart = parsedCart.map((item: any) => ({
                    ...item,
                    price: Number(item.price) || 0,
                    qty: Number(item.qty) || 1,
                    countInStock: Number(item.countInStock) || 0
                }))
                setCartItems(cleanCart)
            } catch (e) {
                console.error("Failed to parse cart items", e)
                setCartItems([])
            }
        }
    }, [])

    // Update local storage when cart changes
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (item: CartItem, qty: number) => {
        const existItem = cartItems.find((x) => x._id === item._id)

        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === existItem._id ? { ...x, qty: qty } : x
                )
            )
        } else {
            setCartItems([...cartItems, { ...item, qty }])
        }
    }

    const removeFromCart = (id: string) => {
        setCartItems(cartItems.filter((x) => x._id !== id))
    }

    const updateQty = (id: string, qty: number) => {
        setCartItems(cartItems.map(item =>
            item._id === id ? { ...item, qty: Math.min(Math.max(1, qty), item.countInStock) } : item
        ))
    }

    const clearCart = () => {
        setCartItems([])
        localStorage.removeItem("cartItems")
    }

    // Calculate Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    const shippingPrice = itemsPrice > 1000 ? 0 : 100 // Free shipping over ₹1,000
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2)) // 18% Tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice

    // State for Sidebar
    const [isCartOpen, setIsCartOpen] = useState(false)
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0)

    return (
        <CartContext.Provider value={{
            cartItems,
            items: cartItems, // Alias for backward compatibility
            addToCart,
            removeFromCart,
            removeItem: removeFromCart, // Alias
            updateQty,
            updateQuantity: updateQty, // Alias
            clearCart,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            cartTotal: totalPrice, // Alias
            isCartOpen,
            setIsCartOpen,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
