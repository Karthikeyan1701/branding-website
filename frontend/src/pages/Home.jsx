import { useEffect, useState } from 'react';
import ProductDetails from '../components/ProductDetails';
import api from './../api/axios';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const [error, setError] = useState('');

  // Load categories on page load

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch {
        setError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Load subcategories when category is selected

  useEffect(() => {
    if (!selectedCategoryId) return;

    const fetchSubcategories = async () => {
      try {
        setLoadingSubcategories(true);
        const res = await api.get(
          `/subcategories/category/${selectedCategoryId}`
        );
        setSubcategories(res.data);
        setProducts([]);
        setSelectedSubcategoryId(null);
      } catch {
        setError('Failed to load subcategories');
      } finally {
        setLoadingSubcategories(false);
      }
    };

    fetchSubcategories();
  }, [selectedCategoryId]);

  // Load products when subcategory is selected
  useEffect(() => {
    if (!selectedSubcategoryId) return;

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await api.get(
          `/products/subcategory/${selectedSubcategoryId}`
        );
        setProducts(res.data);
      } catch {
        setError('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedSubcategoryId]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Explore Our Products</h1>
        <p className="text-sm text-gray-500">
          Browse categories, choose a subcategory, and view products.
        </p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* CATEGORIES UI */}
      <section className="space-y-3">
        <h3 className="font-semibold">Categories</h3>
        {loadingCategories ? (
          <p className="text-gray-500">Loading Categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No categories available at the moment.
          </p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((category) => (
              <li key={category._id}>
                <button
                  onClick={() => setSelectedCategoryId(category._id)}
                  className={`w-full border rounded px-3 py-2 text-left hover:bg-gray-50 
                    ${
                      selectedCategoryId === category._id
                        ? 'bg-gray-100 font-medium'
                        : ''
                    }`}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* SUBCATEGORIES UI */}
      {selectedCategoryId && (
        <section className="space-y-3">
          <h3 className="font-semibold">Subcategories</h3>

          {loadingSubcategories ? (
            <p className="text-gray-500">Loading subcategories...</p>
          ) : subcategories.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No subcategories found for this category.
            </p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {subcategories.map((subcategory) => (
                <li key={subcategory._id}>
                  <button
                    onClick={() => setSelectedSubcategoryId(subcategory._id)}
                    className={`w-full border rounded px-3 py-2 text-left hover:bg-gray-50 ${
                      selectedSubcategoryId === subcategory._id
                        ? 'bg-gray-100 font-medium'
                        : ''
                    }`}
                  >
                    {subcategory.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* PRODUCTS UI */}
      {selectedSubcategoryId && (
        <section className="space-y-3">
          <h3 className="font-semibold">Products</h3>

          {loadingProducts ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No products found in this subcategory.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <li
                  key={product._id}
                  className="border rounded p-4 space-y-2 hover:shadow-sm"
                >
                  <div>
                    <strong className="block">{product.name}</strong>
                    <span className="text-gray-600 text-sm">
                      ₹{product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveProduct(product);
                      setOpenDialog(true);
                    }}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* DIALOG BOX UI */}
      <ProductDetails
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        product={activeProduct}
      />
    </div>
  );
}
