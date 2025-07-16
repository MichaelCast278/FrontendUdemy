"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface CartItem {
  curso_id: string
  nombre: string
  precio: number
  imagen_url?: string
  instructor?: string
  duracion?: string
  rating?: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (cursoId: string) => void
  clearCart: () => void
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      // Check if item already exists
      const existingItem = state.items.find((item) => item.curso_id === action.payload.curso_id)
      if (existingItem) {
        return state // Don't add duplicates
      }

      const newItems = [...state.items, action.payload]
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.precio, 0),
        itemCount: newItems.length,
      }

    case "REMOVE_ITEM":
      const filteredItems = state.items.filter((item) => item.curso_id !== action.payload)
      return {
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + item.precio, 0),
        itemCount: filteredItems.length,
      }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      }

    case "LOAD_CART":
      return {
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + item.precio, 0),
        itemCount: action.payload.length,
      }

    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartItems })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (cursoId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: cursoId })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return <CartContext.Provider value={{ state, addItem, removeItem, clearCart }}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
