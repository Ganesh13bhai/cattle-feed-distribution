import React from 'react';
import ProductCard from './ProductCard';

function ProductGrid({ loading, products }) {

  if (loading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-lg font-medium text-gray-500">Loading products...</h2>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-lg font-medium text-gray-500">
          No products found matching your filters.
        </h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id || product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;