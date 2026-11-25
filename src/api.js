import axios from 'axios'

const api = axios.create({ baseURL: 'https://dummyjson.com' })

export async function getProducts({ limit = 24, skip = 0, category, query } = {}) {
  let url = '/products'
  if (query) url = '/products/search'
  else if (category) url = `/products/category/${encodeURIComponent(category)}`
  const { data } = await api.get(url, { params: { limit, skip, q: query } })
  return data
}

export async function getCategories() {
  const { data } = await api.get('/products/category-list')
  return data
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`)
  return data
}
