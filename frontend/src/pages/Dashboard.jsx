import { useState, useMemo } from 'react';
import { useAuth } from '../context/useAuth';
import useDashboardData from '../hooks/useDashboardData';

import CategoryFormDialog from '../components/admin/CategoryFormDialog';
import SubcategoryFormDialog from '../components/admin/SubcategoryFormDialog';
import ProductFormDialog from '../components/admin/ProductFormDialog';
import Skeleton from '../components/Skeleton';

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
    showSuccessMsg,
  } = useDashboardData();

  const [openDialog, setOpenDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [openSubDialog, setOpenSubDialog] = useState(false);
  const [editSubcategory, setEditSubcategory] = useState(null);

  const [openProdDialog, setOpenProdDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  return (
    <div className="space-y-10 px-4 md:px-6 lg:px-8">
      {/* -------- Header -------- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>

        <div className="space-y-1">
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
        </div>

        <button
          onClick={logout}
          className="btn-secondary"
        >
          Logout
        </button>
      </div>

      {/* -------- Category Section -------- */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <h3 className="font-semibold">Categories</h3>
          <button
            className="btn-secondary"
            onClick={() => {
              setEditCategory(null);
              setOpenDialog(true);
            }}
          >
            + Add Category
          </button>
        </div>

        {loading.categories ? (
          <ul className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-1/2" />
            ))}
          </ul>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">
            No categories yet. Click "Add Category" to create your first one.
          </p>
        ) : (
          <ul className="space-y-3">
            {sortedCategories.map((category) => (
              <li
                key={category._id}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
              >
                <strong>{category.name}</strong>{' '}
                <div className="flex gap-3">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditCategory(category);
                      setOpenDialog(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* -------- Subcategory Section -------- */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <h3 className="font-semibold">Subcategories</h3>
          <button
            className="btn-secondary"
            onClick={() => {
              setEditSubcategory(null);
              setOpenSubDialog(true);
            }}
          >
            + Add Subcategory
          </button>
        </div>

        {loading.subcategories ? (
          <ul className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-2/3" />
            ))}
          </ul>
        ) : subcategories.length === 0 ? (
          <p className="text-gray-500">
            No subcategories yet. Add one new subcategory under a category.
          </p>
        ) : (
          <ul className="space-y-3">
            {subcategories.map((subcategory) => (
              <li
                key={subcategory._id}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
              >
                <strong>{subcategory.name}</strong>
                <span className="text-sm text-gray-500">
                  {subcategory.category?.name}
                </span>
                <div className="flex gap-3">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditSubcategory(subcategory);
                      setOpenSubDialog(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteSubcategory(subcategory._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* -------- Product Section -------- */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <h3 className="font-semibold">Products</h3>
          <button
            className="btn-secondary"
            onClick={() => {
              setEditProduct(null);
              setOpenProdDialog(true);
            }}
          >
            + Add Product
          </button>
        </div>

        {loading.products ? (
          <ul className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-3/4" />
            ))}
          </ul>
        ) : products.length === 0 ? (
          <p className="text-gray-500">
            No products yet. Add your first product.
          </p>
        ) : (
          <ul className="space-y-3">
            {products.map((prod) => (
              <li
                key={prod._id}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
              >
                <strong>{prod.name}</strong>
                <span className="text-sm text-gray-500">
                  {prod.category?.name}
                </span>
                <div className="flex gap-3">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditProduct(prod);
                      setOpenProdDialog(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteProduct(prod._id)}
                  >
                    Delete
                  </button>
                </div>
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
