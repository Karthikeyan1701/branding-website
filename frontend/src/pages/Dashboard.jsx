import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';

import CategoryFormDialog from '../components/admin/CategoryFormDialog';
import SubcategoryFormDialog from '../components/admin/SubcategoryFormDialog';
import ProductFormDialog from '../components/admin/ProductFormDialog';

export default function Dashboard() {
  const { logout } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [openSubDialog, setOpenSubDialog] = useState(false);
  const [editSubcategory, setEditSubcategory] = useState(null);

  const [products, setProducts] = useState([]);
  const [openProdDialog, setOpenProdDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Categories
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchProducts();
  }, [fetchCategories, fetchSubcategories, fetchProducts]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      showErrorMsg('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubcategories = useCallback(async () => {
    try {
      setLoadingSubs(true);
      const res = await api.get('/subcategories');
      setSubcategories(res.data);
    } catch (error) {
      console.error(error);
      showErrorMsg('Failed to load subcategories');
    } finally {
      setLoadingSubs(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      showErrorMsg('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const handleDeleteCategory = async (id) => {
    const confirmDeleteCategory = window.confirm(
      'Are you sure you want to delete this category?\nThis action cannot be undone.'
    );
    if (!confirmDeleteCategory) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      showSuccessMsg('Category deleted successfully');
    } catch (error) {
      console.error(error);
      showErrorMsg('Failed to delete category');
    }
  };

  const handleDeleteSubcategory = async (id) => {
    const confirmDeleteSubcategory = window.confirm(
      'Are you sure you want to delete this subcategory?\nThis action cannot be undone.'
    );
    if (!confirmDeleteSubcategory) return;

    try {
      await api.delete(`/subcategories/${id}`);
      fetchSubcategories();
      showSuccessMsg('Subcategory deleted successfully');
    } catch (error) {
      console.error(error);
      showErrorMsg('Failed to delete subcategory');
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDeleteProduct = window.confirm(
      'Are you sure you want to delete this product?\nThis action cannot be undone.'
    );
    if (!confirmDeleteProduct) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      showSuccessMsg('Product added successfully');
    } catch (error) {
      console.error(error);
      showErrorMsg('Failed to delete product');
    }
  };

  const showSuccessMsg = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const showErrorMsg = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 3000);
  };

  return (
    <div className="space-y-8">
      {/* -------- Header -------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>

        <div className="flex flex-col gap-1">
          {successMsg && <p className="text-green-600">{successMsg}</p>}

          {errorMsg && <p className="text-red-600">{errorMsg}</p>}
        </div>

        <button
          onClick={logout}
          className="border px-3 py-1 rounded hover:bg-gray-100 w-fit"
        >
          Logout
        </button>
      </div>

      {/* -------- Category Section -------- */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Categories</h3>
          <button
            className="border px-3 py-1 rounded"
            onClick={() => {
              setEditCategory(null);
              setOpenDialog(true);
            }}
          >
            + Add Category
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">
            No categories yet. Click "Add Category" to create your first one.
          </p>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category._id} className="flex items-center gap-3">
                <strong>{category.name}</strong>{' '}
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => {
                    setEditCategory(category);
                    setOpenDialog(true);
                  }}
                >
                  Edit
                </button>{' '}
                <button
                  className="text-red-600 text-sm"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* -------- Subcategory Section -------- */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Subcategories</h3>
          <button
            className="border px-3 py-1 rounded"
            onClick={() => {
              setEditSubcategory(null);
              setOpenSubDialog(true);
            }}
          >
            + Add Subcategory
          </button>
        </div>

        {loadingSubs ? (
          <p className="text-gray-500">Loading subcategories...</p>
        ) : subcategories.length === 0 ? (
          <p className="text-gray-500">
            No subcategories yet. Add one new subcategory under a category.
          </p>
        ) : (
          <ul className="space-y-2">
            {subcategories.map((subcategory) => (
              <li key={subcategory._id} className="flex items-center gap-3">
                <strong>{subcategory.name}</strong>
                <span className="text-sm text-gray-500">
                  {subcategory.category?.name}
                </span>
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => {
                    setEditSubcategory(subcategory);
                    setOpenSubDialog(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 text-sm"
                  onClick={() => handleDeleteSubcategory(subcategory._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* -------- Product Section -------- */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Products</h3>
          <button
            className="border px-3 py-1 rounded"
            onClick={() => {
              setEditProduct(null);
              setOpenProdDialog(true);
            }}
          >
            + Add Product
          </button>
        </div>

        {loadingProducts ? (
          <p className="text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products yet. Add your first product.</p>
        ) : (
          <ul className="space-y-2">
            {products.map((prod) => (
              <li key={prod._id} className="flex items-center gap-3">
                <strong>{prod.name}</strong>
                <span className="text-sm text-gray-500">{prod.category?.name}</span>
                <button
                className="text-blue-600 text-sm"
                  onClick={() => {
                    setEditProduct(prod);
                    setOpenProdDialog(true);
                  }}
                >
                  Edit
                </button>
                <button
                className="text-red-600 text-sm"
                 onClick={() => handleDeleteProduct(prod._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* -------- Category Dialog -------- */}
      <CategoryFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        editData={editCategory}
        onSuccess={() => {
          fetchCategories();
          showSuccessMsg('Category saved successfully');
        }}
      />

      {/* -------- Subcategory Dialog -------- */}
      <SubcategoryFormDialog
        open={openSubDialog}
        onClose={() => setOpenSubDialog(false)}
        editData={editSubcategory}
        onSuccess={() => {
          fetchSubcategories();
          showSuccessMsg('Subcategory saved successfully');
        }}
      />

      {/* -------- Product Dialog -------- */}
      <ProductFormDialog
        open={openProdDialog}
        onClose={() => setOpenProdDialog(false)}
        editData={editProduct}
        onSuccess={() => {
          fetchProducts();
          showSuccessMsg('Product saved successfully');
        }}
      />
    </div>
  );
}
