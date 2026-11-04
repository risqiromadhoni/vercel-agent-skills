// SOURCE: skills/react-best-practices/rules/server-use-cache-directive.md
// HASH: 5cf582d2eaa55a7555afc9679643fee15a4a99ada34205f2cc96da91fa3f9bd5
// app/products/page.tsx
export default async function ProductsPage() {
  // Runs for every request, even though every user sees the same products
  const products = await db.product.findMany({ where: { published: true } })
  return <ProductList products={products} />
}

// ---- test scaffolding (not part of the exercise) ----
interface Product {
  id: string
  title: string
}

const db = {
  product: {
    async findMany(_args: { where: { published: boolean } }): Promise<Product[]> {
      throw new Error('seed stand-in: db.product.findMany')
    },
  },
}

function ProductList({ products }: { products: Product[] }) {
  return <ul>{products.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}
