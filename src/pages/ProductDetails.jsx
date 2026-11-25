import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../api'
import { useCart } from '../cart/CartContext'
import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageIndex, setImageIndex] = useState(0)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getProduct(id)
      .then((data) => !cancelled && setProduct(data))
      .catch(() => !cancelled && setError('Could not load this product.'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id])

  if (loading) return <Spinner />
  if (error) return <ErrorBox message={error} />
  if (!product) return null

  const discounted = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null

  return (
    <article className="product-details">
      <div className="gallery">
        <img className="gallery-main" src={product.images[imageIndex]} alt={product.title} />
        {product.images.length > 1 && (
          <div className="gallery-thumbs">
            {product.images.map((img, i) => (
              <button key={img + i} className={`thumb ${i === imageIndex ? 'thumb-active' : ''}`} onClick={() => setImageIndex(i)}>
                <img src={img} alt={`${product.title} view ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h1>{product.title}</h1>
        <p className="rating">★ {product.rating} <span className="muted">({product.reviews?.length || 0} reviews)</span></p>
        <div className="price-row">
          {discounted ? (
            <>
              <span className="price price-big">${discounted}</span>
              <span className="price-old">${product.price}</span>
              <span className="discount-badge">-{Math.round(product.discountPercentage)}%</span>
            </>
          ) : (
            <span className="price price-big">${product.price}</span>
          )}
        </div>
        <p className="description">{product.description}</p>
        <p className={`stock ${product.stock < 10 ? 'stock-low' : ''}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
        <button
          className="btn btn-big"
          disabled={product.stock === 0}
          onClick={() => { addToCart(product); setAdded(true); setTimeout(() => setAdded(false), 1500) }}
        >
          {added ? '✓ Added to cart' : 'Add to cart'}
        </button>
        <Link to="/" className="back-link">← Back to products</Link>
      </div>
    </article>
  )
}
