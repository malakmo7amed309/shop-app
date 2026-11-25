import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAdd }) {
  const discounted = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-thumb-link">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </Link>
      <div className="product-card-body">
        <Link to={`/product/${product.id}`} className="product-title">{product.title}</Link>
        <p className="product-brand">{product.brand || product.category}</p>
        <div className="price-row">
          {discounted ? (
            <>
              <span className="price">${discounted}</span>
              <span className="price-old">${product.price}</span>
            </>
          ) : (
            <span className="price">${product.price}</span>
          )}
          <span className="rating">★ {product.rating}</span>
        </div>
        <button className="btn btn-block" onClick={() => onAdd(product)}>Add to cart</button>
      </div>
    </article>
  )
}
