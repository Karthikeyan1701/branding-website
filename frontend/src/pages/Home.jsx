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
    <div>
      <h2>Browse Products</h2>

      {error && <p>{error}</p>}

      {/* CATEGORIES UI */}
      <h3>Categories</h3>
      {loadingCategories ? (
        <p>Loading Categories...</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category._id}>
              <button onClick={() => setSelectedCategoryId(category._id)}>
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* SUBCATEGORIES UI */}
      {selectedCategoryId && (
        <>
          <h3>Subcategories</h3>
          {loadingSubcategories ? (
            <p>Loading subcategories...</p>
          ) : (
            <ul>
              {subcategories.map((subcategory) => (
                <li key={subcategory._id}>
                  <button
                    onClick={() => setSelectedSubcategoryId(subcategory._id)}
                  >
                    {subcategory.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* PRODUCTS UI */}
      {selectedSubcategoryId && (
        <>
          <h3>Products</h3>
          {loadingProducts ? (
            <p>Loading products...</p>
          ) : (
            <ul>
              {products.map((product) => (
                <li key={product._id}>
                  <strong>{product.name}</strong>
                  <h3>₹{product.price}</h3>
                  <br />
                  <button onClick={() => {
                    setActiveProduct(product);
                    setOpenDialog(true);
                  }}>
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
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
