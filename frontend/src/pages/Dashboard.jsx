import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';

import CategoryFormDialog from '../components/admin/CategoryFormDialog';
import SubcategoryFormDialog from '../components/admin/SubcategoryFormDialog';
import ProductFormDialog from '../components/admin/ProductFormDialog';

export default function Dashboard() {
  const { logout } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState([]);
  const [editCategory, setEditCategory] = useState(null);

  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [openSubDialog, setOpenSubDialog] = useState(false);
  const [editSubcategory, setEditSubcategory] = useState(null);

  const [products, setProducts] = useState([]);
  const [openProdDialog, setOpenProdDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Categories
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      setLoadingSubs(true);
      const res = await api.get('/subcategories');
      setSubcategories(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load subcategories');
    } finally {
      setLoadingSubs(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmDeleteCategory = window.confirm(
      'Are you sure you want to delete this category?\nThis action cannot be undone.'
    );
    if (!confirmDeleteCategory) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      showSuccessMsg("Category deleted successfully");
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
      showSuccessMsg("Subcategory deleted successfully");
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
      showSuccessMsg("Product added successfully");
    } catch (error) {
      console.error(error);
      showErrorMsg('Failed to delete product');
    }
  };

  const showSuccessMsg = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg("");
    setTimeout(() => setSuccessMsg(""), 2000)
  };

  const showErrorMsg = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg("");
    setTimeout(() => setErrorMsg(""), 3000);
  };

  return (
    <div>
      {/* -------- Header -------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Admin Dashboard</h2>

        {successMsg && (
          <p style={{ color: "green", marginBottom: "10px" }}>
            {successMsg}
          </p>
        )}

        {errorMsg && (
          <p style={{ color: "red", marginBottom: "10px" }}>
            {errorMsg}
          </p>
        )}

        <button onClick={logout}>Logout</button>
      </div>

      {/* -------- Category Section -------- */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Categories</h3>
          <button
            onClick={() => {
              setEditCategory(null);
              setOpenDialog(true);
            }}
          >
            + Add Category
          </button>
        </div>

        {loading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p>No categories yet. Click "Add Category" to create your first one.</p>
        ) : (
          <ul>
            {categories.map((category) => (
              <li key={category._id} style={{ marginBottom: '8px' }}>
                <strong>{category.name}</strong>{' '}
                <button
                  onClick={() => {
                    setEditCategory(category);
                    setOpenDialog(true);
                  }}
                >
                  Edit
                </button>{' '}
                <button onClick={() => handleDeleteCategory(category._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* -------- Subcategory Section -------- */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Subcategories</h3>
          <button
            onClick={() => {
              setEditSubcategory(null);
              setOpenSubDialog(true);
            }}
          >
            + Add Subcategory
          </button>
        </div>

        {loadingSubs ? (
          <p>Loading subcategories...</p>
        ) : subcategories.length === 0 ? (
          <p>No subcategories yet. Add one new subcategory under a category.</p>
        ) : (
          <ul>
            {subcategories.map((subcategory) => (
              <li key={subcategory._id} style={{ marginBottom: '8px' }}>
                <strong>{subcategory.name}</strong>{' '}
                <strong>{subcategory.category?.name}</strong>{' '}
                <button
                  onClick={() => {
                    setEditSubcategory(subcategory);
                    setOpenSubDialog(true);
                  }}
                >
                  Edit
                </button>{' '}
                <button onClick={() => handleDeleteSubcategory(subcategory._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* -------- Product Section -------- */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Products</h3>
          <button
            onClick={() => {
              setEditProduct(null);
              setOpenProdDialog(true);
            }}
          >
            + Add Product
          </button>
        </div>

        {loadingProducts ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products yet. Add your first product.</p>
        ) : (
          <ul>
            {products.map((prod) => (
              <li key={prod._id} style={{ marginBottom: '8px' }}>
                <strong>{prod.name}</strong>{' '}
                <strong>{prod.category?.name}</strong>{' '}
                <button
                  onClick={() => {
                    setEditProduct(prod);
                    setOpenProdDialog(true);
                  }}
                >
                  Edit
                </button>{' '}
                <button onClick={() => handleDeleteProduct(prod._id)}>
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
          showSuccessMsg("Category saved successfully");
        }}
      />

      {/* -------- Subcategory Dialog -------- */}
      <SubcategoryFormDialog 
        open={openSubDialog}
        onClose={() => setOpenSubDialog(false)}
        editData={editSubcategory}
        onSuccess={() => {
          fetchSubcategories();
          showSuccessMsg("Subcategory saved successfully");
        }}
      />

      {/* -------- Product Dialog -------- */}
      <ProductFormDialog 
        open={openProdDialog}
        onClose={() => setOpenProdDialog(false)}
        editData={editProduct}
        onSuccess={() => {
          fetchProducts();
          showSuccessMsg("Product saved successfully");
        }}
      />
    </div>
  );
}
