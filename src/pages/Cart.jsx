import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'

export default function Cart() {
  const { items, setQuantity, removeFromCart, clearCart, total } = useCart()

  if (items.length === 0) {
    return (
      <section className="page-header">
        <h1>Your cart</h1>
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
          <div className="summary-row"><span>Shipping</span><span>Free</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button className="btn btn-block btn-big" onClick={() => alert('Checkout is a demo - no payment is processed.')}>Checkout</button>
        </aside>
      </div>
    </>
  )
}
