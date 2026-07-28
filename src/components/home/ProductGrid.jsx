import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  return (
    <div
      className="
        grid
        w-full
        grid-cols-2
        gap-2

        sm:gap-3

        md:grid-cols-3
        md:gap-4

        xl:grid-cols-4
        xl:gap-5
      "
    >
      {products.map((product) => (
        <div key={product.id} className="min-w-0">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;