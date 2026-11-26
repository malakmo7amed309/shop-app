import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'

export default function Cart() {
  const { items, setQuantity, removeFromCart, clearCart, total } = useCart()
  const [code, setCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponMsg, setCouponMsg] = useState('')
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  const [errors, setErrors] = useState({})
  const [open, setOpen] = useState(false)
  const [order, setOrder] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shop-app-last-order')) } catch { return null }
  })
  const [justPlaced, setJustPlaced] = useState(false)
  const discount = coupon ? total * coupon.rate : 0
  const shipping = total - discount >= 50 || total === 0 ? 0 : 4.99
  const grand = total - discount + shipping

  const applyCoupon = (e) => {
    e.preventDefault()
    const c = code.trim().toUpperCase()
    if (c === 'WELCOME10') { setCoupon({ code: c, rate: 0.1 }); setCouponMsg('10% off applied.') }
    else { setCoupon(null); setCouponMsg('Code not valid. Try WELCOME10.') }
  }

  const placeOrder = (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Enter a valid email.'
    if (form.address.trim().length < 6) er.address = 'Enter your address.'
    setErrors(er)
    if (Object.keys(er).length) return
    const o = { id: 'SM-' + Math.random().toString(36).slice(2, 8).toUpperCase(), name: form.name.trim(), total: grand.toFixed(2), count: items.reduce((n, i) => n + i.quantity, 0), date: new Date().toLocaleString() }
    localStorage.setItem('shop-app-last-order', JSON.stringify(o))
    setOrder(o); setJustPlaced(true); setOpen(false); clearCart()
  }

  if (items.length === 0) {
    return (
      <section className="page-header">
        <h1>Your cart</h1>
        {order && (
          <div className="order-box" role="status">
            <strong>{justPlaced ? 'Order placed (demo)' : 'Last demo order'}: {order.id}</strong>
            <p>{order.count} item(s), ${order.total}, {order.date}. No payment was taken.</p>
          </div>
        )}
        <p className="empty-state">
          Your cart is empty. <Link to="/">Browse products</Link> to fill it up.
        </p>
      </section>
    )
  }

  return (
    <>
      <section className="page-header cart-header">
        <h1>Your cart</h1>
        <button className="btn btn-outline" onClick={clearCart}>Clear cart</button>
      </section>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.thumbnail} alt={item.title} />
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`} className="product-title">{item.title}</Link>
                <p className="muted">${item.price} each</p>
              </div>
              <div className="quantity-controls">
                <button className="qty-btn" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                <span>{item.quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
              </div>
              <p className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</p>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.title}`}>✕</button>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          {coupon && <div className="summary-row"><span>{coupon.code}</span><span>-${discount.toFixed(2)}</span></div>}
          <div className="summary-row"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>${grand.toFixed(2)}</span></div>
          <p className="muted small">Free shipping over $50.</p>
          <form className="coupon" onSubmit={applyCoupon}>
            <input placeholder="Promo code" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Promo code" />
            <button className="btn btn-outline">Apply</button>
          </form>
          {couponMsg && <p className="muted small">{couponMsg}</p>}
          {!open ? (
            <button className="btn btn-block btn-big" onClick={() => setOpen(true)}>Checkout</button>
          ) : (
            <form className="checkout" onSubmit={placeOrder} noValidate>
              {['name', 'email', 'address'].map((k) => (
                <label key={k}>{k[0].toUpperCase() + k.slice(1)}
                  <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                  {errors[k] && <span className="err">{errors[k]}</span>}
                </label>
              ))}
              <button className="btn btn-block btn-big">Place demo order</button>
              <p className="muted small">Demo only. No payment is processed.</p>
            </form>
          )}
        </aside>
      </div>
    </>
  )
}
