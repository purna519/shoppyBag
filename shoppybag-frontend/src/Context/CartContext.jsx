import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/api'
import { ToastContext } from './ToastContext'

export const CartContext = createContext()

// Convenience hook for consuming the CartContext
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }){
  const [cart, setCart] = useState(null)
  const [count, setCount] = useState(0)
  const [loadingCart, setLoadingCart] = useState(false)
  const { showToast } = useContext(ToastContext)

  const loadCart = async ()=>{
    const token = localStorage.getItem('token')
    // Only fetch cart if authenticated
    if(!token){
      setCart(null)
      setCount(0)
      return
    }
    setLoadingCart(true)
    try{
      const res = await api.get('/cart/get')
      const data = res?.data?.data
      setCart(data || null)
      const items = data?.items || []
      setCount(items.length) // Count unique items, not total quantity
    }catch(e){ console.error('loadCart', e); setCart(null); setCount(0) }
    finally{ setLoadingCart(false) }
  }

  useEffect(()=>{ loadCart() }, [])

  const addToCart = async ({ productId, variantId = null, quantity = 1, price })=>{
    try{
      await api.post('/cart/add', null, { params: { productId, variantId, quantity, price } })
      await loadCart()
      showToast('Added to cart', 'success')
    }catch(e){ console.error(e); showToast('Add to cart failed', 'error'); throw e }
  }

  const updateItem = async ({ productId, variantId = null, quantity })=>{
    try{ await api.put('/cart/update', null, { params: { productId, variantId, quantity } }); await loadCart() }
    catch(e){ console.error(e); showToast('Update failed', 'error'); throw e }
  }

  const removeItem = async ({ productId, variantId = null })=>{
    try{ await api.delete('/cart/remove', { params: { productId, variantId } }); await loadCart() }
    catch(e){ console.error(e); showToast('Remove failed', 'error'); throw e }
  }

  // Helpers for components that work with cart-item id
  const updateItemById = async (itemId, quantity)=>{
    if(!cart || !cart.items) return
    const it = cart.items.find(i=> String(i.id) === String(itemId))
    if(!it) return
    return updateItem({ productId: it.product.id, variantId: it.variant?.id || null, quantity })
  }

  const removeItemById = async (itemId)=>{
    if(!cart || !cart.items) return
    const it = cart.items.find(i=> String(i.id) === String(itemId))
    if(!it) return
    return removeItem({ productId: it.product.id, variantId: it.variant?.id || null })
  }

  return (
    <CartContext.Provider value={{ cart, count, loadingCart, loadCart, addToCart, updateItem, removeItem, updateItemById, removeItemById }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
