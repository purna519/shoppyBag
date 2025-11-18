import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded">
      <div className="h-48 bg-gray-100 mb-2"> {/* placeholder image */}</div>
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm">
        {product.brand} • {product.category}
      </p>
      <div className="flex justify-between items-center mt-2">
        <div className="text-lg font-bold">₹{product.price}</div>
        <Link to={`/product/${product.id}`} className="text-blue-600">
          View
        </Link>
      </div>
    </div>
  );
}
