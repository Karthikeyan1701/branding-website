import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import useDashboardData from '../hooks/useDashboardData';

import CategoryFormDialog from '../components/admin/CategoryFormDialog';
import SubcategoryFormDialog from '../components/admin/SubcategoryFormDialog';
import ProductFormDialog from '../components/admin/ProductFormDialog';

export default function Dashboard() {
  const { logout } = useAuth();

  const {
    categories,
    subcategories,
    products,
    loading,
    successMsg,
    errorMsg,
    handleDeleteCategory,
    handleDeleteSubcategory,
    handleDeleteProduct,
    fetchCategories,
    fetchSubcategories,
    fetchProducts,
    showSuccessMsg
  } = useDashboardData();

  const [openDialog, setOpenDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [openSubDialog, setOpenSubDialog] = useState(false);
  const [editSubcategory, setEditSubcategory] = useState(null);

  const [openProdDialog, setOpenProdDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

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

        {loading.categories ? (
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

        {loading.subcategories ? (
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

        {loading.products ? (
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
