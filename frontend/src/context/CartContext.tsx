"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { API_URL } from "@/lib/config"

interface CartItem {
    _id: string
    name: string
    price: number
    image: string
    countInStock: number
    qty: number
    customDetails?: {
        base: string
        filling: string
        shape: string
        text?: string
    }
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
    syncCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    const syncCart = async () => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {
            try {
                const { token } = JSON.parse(userInfo)
                const res = await fetch(`${API_URL}/api/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (res.ok) {
                    const data = await res.json()
                    const serverCart = data.cart || []

                    if (serverCart.length > 0) {
                        const cleanServerCart = serverCart.map((item: any) => ({
                            _id: item.product || item._id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            countInStock: 10,
                            qty: item.qty
                        }))
                        setCartItems(cleanServerCart)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch server cart", error)
            }
        }
    }

    // Load cart from local storage on mount AND fetch from server if logged in
    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems")
        const userInfo = localStorage.getItem("userInfo")

        let localItems: CartItem[] = []

        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart)
                localItems = parsedCart.map((item: any) => ({
                    ...item,
                    price: Number(item.price) || 0,
                    qty: Number(item.qty) || 1,
                    countInStock: Number(item.countInStock) || 0
                }))
                setCartItems(localItems)
            } catch (e) {
                console.error("Failed to parse cart items", e)
            }
        }

        // If logged in, fetch from server
        if (userInfo) {
            const fetchServerCart = async () => {
                try {
                    const { token } = JSON.parse(userInfo)
                    const res = await fetch(`${API_URL}/api/auth/profile?t=${Date.now()}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        cache: 'no-store'
                    })
                    if (res.ok) {
                        const data = await res.json()
                        const serverCart = data.cart || []

                        // Strategy: 
                        // 1. If server cart is empty but local has items (guest -> login), keep local and lets save it in next effect.
                        // 2. If server cart has items, prefer server cart (or merge). Let's prefer server cart for consistency across devices, 
                        //    UNLESS local cart has items that are NOT in server cart (merging is complex).
                        //    Simple approach: If server has items, use server items. If server empty, use local.

                        if (serverCart.length > 0) {
                            // Ensure structure matches
                            const cleanServerCart = serverCart.map((item: any) => ({
                                _id: item.product || item._id, // Handle if product is populated or not
                                name: item.name,
                                price: item.price,
                                image: item.image,
                                countInStock: 10, // Default or fetch real stock? 
                                qty: item.qty
                            }))
                            setCartItems(cleanServerCart)
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch server cart", error)
                }
            }
            fetchServerCart()
        }
    }, [])

    // Helper to save to server immediately
    const saveCartToBackend = async (currentCart: CartItem[]) => {
        const userInfo = localStorage.getItem("userInfo")
        if (userInfo) {
            try {
                const { token } = JSON.parse(userInfo)
                const cartPayload = currentCart.map(item => ({
                    product: (item.customDetails || item._id.startsWith('custom-')) ? null : item._id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    qty: item.qty,
                    customDetails: item.customDetails
                }))

                await fetch(`${API_URL}/api/auth/cart`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ cart: cartPayload })
                })
            } catch (error) {
                console.error("Failed to save cart to server", error)
            }
        }
    }

    // Update local storage AND server when cart changes
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems))

        // Debounce for general updates (like quantity changes)
        const timeoutId = setTimeout(() => {
            saveCartToBackend(cartItems)
        }, 1000)

        return () => clearTimeout(timeoutId)
    }, [cartItems])

    const addToCart = (item: CartItem, qty: number) => {
        const existItem = cartItems.find((x) => x._id === item._id)
        let newCart;

        if (existItem) {
            newCart = cartItems.map((x) =>
                x._id === existItem._id ? { ...x, qty: qty } : x
            )
        } else {
            newCart = [...cartItems, { ...item, qty }]
        }
        setCartItems(newCart)
        // Immediate save for add
        saveCartToBackend(newCart)
    }

    const removeFromCart = (id: string) => {
        const newCart = cartItems.filter((x) => x._id !== id)
        setCartItems(newCart)
        // Immediate save for remove
        saveCartToBackend(newCart)
    }

    const updateQty = (id: string, qty: number) => {
        setCartItems(cartItems.map(item =>
            item._id === id ? { ...item, qty: Math.min(Math.max(1, qty), item.countInStock) } : item
        ))
        // Debounce handled by useEffect
    }

    const clearCart = () => {
        setCartItems([])
        localStorage.removeItem("cartItems")
        // Immediate save for clear
        saveCartToBackend([])
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
            cartCount,
            syncCart
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
