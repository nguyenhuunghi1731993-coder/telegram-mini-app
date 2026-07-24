import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-5">
      {products.map((product) => (
        <div key={product.id} className="min-w-0">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;