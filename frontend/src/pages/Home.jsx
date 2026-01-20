import { useCallback, useState, useMemo, lazy, Suspense } from 'react';
import useHomeData from '../hooks/useHomeData';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';

export default function Home() {
  const {
    categories,
    subcategories,
    products,
    loading,
    error,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubcategoryId,
    setSelectedSubcategoryId,
  } = useHomeData();

  const ProductDetails = lazy(() => import('../components/ProductDetails'));

  const [openDialog, setOpenDialog] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    return subcategories.filter(
      (sub) => sub.category?._id === selectedCategoryId,
    );
  }, [subcategories, selectedCategoryId]);

  const filteredProducts = useMemo(() => {
    if (!selectedSubcategoryId) return [];
    return products.filter(
      (prod) => prod.subcategory?._id === selectedSubcategoryId,
    );
  }, [products, selectedSubcategoryId]);

  const handleViewProduct = useCallback((product) => {
    setActiveProduct(product);
    setOpenDialog(true);
  }, []);

  return (
    <div className="space-y-10 px-4 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold">
          Explore Our Products
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Browse categories, choose a subcategory, and view products.
        </p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* CATEGORIES UI */}
      <section className="space-y-4">
        <h3 className="font-semibold text-lg">Categories</h3>
        {loading.categories ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </ul>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No categories are available right now. Please check back later.
          </p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <li key={category._id}>
                <button
                  onClick={() => setSelectedCategoryId(category._id)}
                  className={`w-full border rounded-lg px-4 py-3 text-left text-sm transition hover:bg-gray-50 
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
      {!selectedCategoryId && (
        <p className="text-sm text-gray-500">
          Select a category to view available subcategories.
        </p>
      )}


      {selectedCategoryId && (
        <section className="space-y-4">
          <h3 className="font-semibold text-lg">Subcategories</h3>

          {loading.subcategories ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </ul>
          ) : filteredSubcategories.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No subcategories found in this category.
            </p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSubcategories.map((subcategory) => (
                <li key={subcategory._id}>
                  <button
                    onClick={() => setSelectedSubcategoryId(subcategory._id)}
                    className={`w-full border rounded px-4 py-3 text-left text-sm transition hover:bg-gray-50 ${
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
      {selectedCategoryId && !selectedCategoryId && (
        <p className='text-sm text-gray-500'>
          Select a subcategory to view products.
        </p>
      )}

      {selectedSubcategoryId && (
        <section className="space-y-4">
          <h3 className="font-semibold text-lg">Products</h3>

          {loading.products ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="space-y-3">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </li>
              ))}
            </ul>
          ) : filteredProducts.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No products found in this subcategory.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onView={handleViewProduct}
                />
              ))}
            </ul>
          )}
        </section>
      )}

      {/* DIALOG BOX UI */}
      {openDialog && activeProduct && (
        <Suspense
          fallback={<div className="p-4">Loading product details...</div>}
        >
          <ProductDetails
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            product={activeProduct}
          />
        </Suspense>
      )}
    </div>
  );
}
