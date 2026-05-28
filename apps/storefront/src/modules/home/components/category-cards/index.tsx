import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categories = [
  { title: "Skincare", count: "12 products" },
  { title: "Supplements", count: "8 products" },
  { title: "Recovery", count: "6 products" },
]

const CategoryCards = () => {
  return (
    <section className="content-container py-20">
      <h2 className="text-2xl font-bold text-black mb-10">Shop by Category</h2>
      <div className="grid grid-cols-1 small:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <LocalizedClientLink
            key={cat.title}
            href="/store"
            className="border border-grey-20 p-8 hover:border-black transition-colors group"
          >
            <h3 className="text-lg font-semibold text-black group-hover:underline">{cat.title}</h3>
            <p className="text-sm text-grey-50 mt-1">{cat.count}</p>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}

export default CategoryCards
