'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

interface CartItem {
  id: string
  type: 'product' | 'course' | 'workshop'
  title: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string; type: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; type: string; quantity: number } }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; payload: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id && i.type === action.payload.type)
      if (existing) {
        return {
          items: state.items.map(i =>
            i.id === action.payload.id && i.type === action.payload.type
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => !(i.id === action.payload.id && i.type === action.payload.type)) }
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map(i =>
          i.id === action.payload.id && i.type === action.payload.type
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      }
    case 'CLEAR':
      return { items: [] }
    case 'LOAD':
      return { items: action.payload }
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (id: string, type: string) => void
  updateQuantity: (id: string, type: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) dispatch({ type: 'LOAD', payload: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.items))
    } catch {}
  }, [state.items])

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item })
  const removeItem = (id: string, type: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id, type } })
  const updateQuantity = (id: string, type: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, type, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
