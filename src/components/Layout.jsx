import { NavLink, Outlet, Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'

export default function Layout() {
  const { count } = useCart()
  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          <NavLink to="/" className="brand">ShopMart</NavLink>
          <nav className="nav-links">
            <NavLink to="/" end>Products</NavLink>
            <Link to="/cart" className="cart-link">
              🛒 Cart {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </nav>
        </div>
      </header>
      <main className="container page">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Demo store built with React + the DummyJSON API.</p>
      </footer>
    </>
  )
}
