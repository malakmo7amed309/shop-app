import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page-header">
      <h1>404 - Page not found</h1>
      <p><Link to="/">Back to products</Link></p>
    </section>
  )
}
