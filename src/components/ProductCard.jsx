import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAdd, fav, onFav }) {
  const discounted = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-thumb-link">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </Link>
      <button
        className={`fav-btn${fav ? ' on' : ''}`}
        onClick={() => onFav(product.id)}
        aria-pressed={!!fav}
        aria-label={fav ? 'Remove from saved' : 'Save for later'}
      ><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.800-8 11-8 11z" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg></button>
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
