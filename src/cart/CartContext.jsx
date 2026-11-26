import { createContext, useContext, useEffect, useReducer, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'shop-app-cart'

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.find((item) => item.id === action.product.id)
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...state, { ...action.product, quantity: 1 }]
    }
    case 'remove':
      return state.filter((item) => item.id !== action.id)
    case 'setQuantity': {
      if (action.quantity <= 0) return state.filter((item) => item.id !== action.id)
      return state.map((item) =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      )
    }
    case 'clear':
      return []
    default:
      return state
  }
}

function readStoredCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], readStoredCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shop-app-favs')) || [] } catch { return [] }
  })
  useEffect(() => { localStorage.setItem('shop-app-favs', JSON.stringify(favs)) }, [favs])
  const toggleFav = (id) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  const addToCart = (product) => dispatch({ type: 'add', product })
  const removeFromCart = (id) => dispatch({ type: 'remove', id })
  const setQuantity = (id, quantity) => dispatch({ type: 'setQuantity', id, quantity })
  const clearCart = () => dispatch({ type: 'clear' })

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ favs, toggleFav, items, addToCart, removeFromCart, setQuantity, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
