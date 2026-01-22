import { memo } from "react";

function ProductCard({ product, onView }) {
    return (
        <li className="border rounded-lg p-4 space-y-3 transition hover:shadow-sm">
            <div>
                <strong className="block text-sm">{product.name}</strong>
                <span className="text-gray-600 text-sm">₹{product.price}</span>
            </div>

            <button onClick={() => onView(product)} className="btn btn-secondary">
                View Details
            </button>
        </li>
    );
}

export default memo(ProductCard);