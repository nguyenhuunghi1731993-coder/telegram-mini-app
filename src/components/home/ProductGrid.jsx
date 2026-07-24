import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
      {products.map((product) => (
        <div key={product.id} className="min-w-0">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;