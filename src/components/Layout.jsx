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
              <svg className="ico" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 11h10.2L20 7H6.2M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"/></svg> Cart {count > 0 && <span className="cart-badge">{count}</span>}
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
