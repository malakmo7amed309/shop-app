import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CartProvider } from './cart/CartContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'product/:id', element: <ProductDetails /> },
        { path: 'cart', element: <Cart /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
)

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  )
}
