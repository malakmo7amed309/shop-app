import { useEffect, useState } from 'react'
import { getProducts, getCategories } from '../api'
import { useCart } from '../cart/CartContext'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'

const PAGE_SIZE = 24

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart, favs, toggleFav } = useCart()
  const [onlyFav, setOnlyFav] = useState(false)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 400)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getProducts({
      limit: PAGE_SIZE,
      skip: page * PAGE_SIZE,
      category: category || undefined,
      query: debouncedQuery || undefined,
      sort: sort || undefined,
    })
      .then((data) => {
        if (cancelled) return
        setProducts(data.products)
        setTotal(data.total)
      })
      .catch(() => !cancelled && setError('Could not load products. Check your connection and try again.'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [page, category, debouncedQuery, sort])

  const shown = onlyFav ? products.filter((p) => favs.includes(p.id)) : products
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <>
      <section className="page-header">
        <h1>Products</h1>
        <div className="filters">
          <input
            type="search"
            className="search-input"
            placeholder="Search products..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0) }}
            aria-label="Search products"
          />
          <select
            className="category-select"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(0) }}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>
            ))}
          </select>
          <select
            className="category-select"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(0) }}
            aria-label="Sort products"
          >
            <option value="">Sort: featured</option>
            <option value="price:asc">Price: low to high</option>
            <option value="price:desc">Price: high to low</option>
            <option value="rating:desc">Top rated</option>
            <option value="title:asc">Name A to Z</option>
          </select>
          <label className="fav-toggle">
            <input type="checkbox" checked={onlyFav} onChange={(e) => setOnlyFav(e.target.checked)} />
            Saved only ({favs.length})
          </label>
        </div>
      </section>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorBox message={error} onRetry={() => setPage((p) => p)} />
      ) : shown.length === 0 ? (
        <p className="empty-state">{onlyFav ? 'None of the products on this page are saved yet.' : 'No products match your search.'}</p>
      ) : (
        <>
          <div className="product-grid">
            {shown.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} fav={favs.includes(product.id)} onFav={toggleFav} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <span>Page {page + 1} of {totalPages}</span>
              <button className="btn" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </>
  )
}
