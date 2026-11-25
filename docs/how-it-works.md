# How ShopMart works (plain-language tour)

This note explains how the app is put together, so you can talk about it
confidently in an interview. No jargon without an explanation.

## The big picture

ShopMart is a single-page application: the browser loads one HTML file, and
React swaps the visible "page" as you navigate. There are four routes:

| URL | Page | What it shows |
| --- | --- | --- |
| `/` | Home | Product grid with search, category filter and pagination |
| `/product/:id` | ProductDetails | One product with images, rating, price and stock |
| `/cart` | Cart | Cart items, quantity controls and the order summary |
| anything else | NotFound | A friendly 404 page |

## Where the data comes from

All products come from [DummyJSON](https://dummyjson.com), a free fake-store
API made for learning. `src/api.js` is the only file that talks to it. It
creates one Axios instance with the base URL and exports three small
functions: `getProducts` (with pagination, search and category options),
`getCategories` and `getProduct`. Keeping every request in one file means the
pages never build URLs themselves; if the API ever changes, there is exactly
one place to fix.

The Home page keeps the list in state (`useState`) and reloads it inside a
`useEffect` whenever the page number, category or search term changes. The
search box is **debounced**: typing does not fire a request per keystroke.
Instead a short timer waits until you pause (about half a second), and only
then updates the value the effect listens to. That is the standard trick for
search inputs, and interviewers love to ask about it.

## The cart: Context + useReducer

The cart is the heart of the app, and it demonstrates two React ideas working
together:

- **`useReducer`** (`src/cart/CartContext.jsx`) holds the cart logic in one
  pure function. Every change is an *action* (`add`, `remove`, `setQuantity`,
  `clear`), and the reducer computes the next state from the current one.
  Adding a product that is already in the cart just increases its quantity;
  setting a quantity to zero removes the item.
- **Context** makes that state available everywhere without "prop drilling"
  (passing data through components that do not need it). The provider wraps
  the whole app, so the navbar badge, the product cards and the cart page all
  read and update the same cart.

A second `useEffect` in the provider saves the cart to `localStorage` every
time it changes, and the initial state is read back from `localStorage` when
the app loads. That is why your cart survives a page refresh, even though
there is no backend account or database.

## Loading, error and empty states

Every data view handles three situations explicitly: a spinner while the
request is in flight, an error box if the request fails, and an empty-state
message when the result is simply empty (for example a search with no
matches, or a cleared cart). Real users hit all three, so the UI never shows
a blank screen.

## Concepts worth mentioning in an interview

- Component composition: `ProductCard`, `Spinner`, `ErrorBox` and `Layout`
  are small reusable pieces shared by the pages.
- Derived data: cart totals are computed from state with `reduce` at render
  time instead of being stored separately, so they can never get out of sync.
- Controlled inputs: the search box and quantity controls are driven by React
  state.
- Persistence without a backend: `localStorage` as a simple client-side
  store.
- Separation of concerns: API calls in `api.js`, state logic in the context,
  presentation in components.
