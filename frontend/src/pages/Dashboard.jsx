import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';

import CategoryFormDialog from '../components/admin/CategoryFormDialog';
import SubcategoryFormDialog from '../components/admin/SubcategoryFormDialog';

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

  // Fetch Categories
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this category?'
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert('Failed to delete category');
    }
  };

  const handleDeleteSub = async (id) => {
    const confirmDeleteSub = window.confirm(
      'Are you sure you want to delete this subcategory?'
    );
    if (!confirmDeleteSub) return;

    try {
      await api.delete(`/subcategories/${id}`);
      fetchSubcategories();
    } catch (error) {
      console.error(error);
      alert('Failed to delete subcategory');
    }
  };

  return (
    <div>
      {/* -------- Header -------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Admin Dashboard</h2>
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
          <p>No categories found.</p>
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
                <button onClick={() => handleDelete(category._id)}>
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
          <p>No subcategories found.</p>
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
                <button onClick={() => handleDeleteSub(subcategory._id)}>
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
        onSuccess={fetchCategories}
      />

      {/* -------- Subcategory Dialog -------- */}
      <SubcategoryFormDialog 
        open={openSubDialog}
        onClose={() => setOpenSubDialog(false)}
        editData={editSubcategory}
        onSuccess={fetchSubcategories}
      />
    </div>
  );
}
