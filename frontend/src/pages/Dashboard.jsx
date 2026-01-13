import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';
import CategoryFormDialog from '../components/admin/CategoryFormDialog';

export default function Dashboard() {
  const { logout } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState([]);
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
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

      {/* -------- Category Dialog -------- */}
      <CategoryFormDialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        editData={editCategory}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
