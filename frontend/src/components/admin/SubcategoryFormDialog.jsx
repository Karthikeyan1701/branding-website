/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from 'motion/react';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axios';

export default function SubcategoryFormDialog({
  open,
  onClose,
  onSuccess,
  editData,
}) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setCategoryId(editData.category?._id || '');
    } else {
      setName('');
      setCategoryId('');
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editData) {
        await api.put(`/subcategories/${editData._id}`, { name, categoryId });
      } else {
        await api.post('/subcategories', { name, categoryId });
      }

      onSuccess();
      onClose();
    } catch {
      setError('Failed to save subcategory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
              <button className="absolute top-3 right-3" onClick={onClose}>
                <X size={18} />
              </button>

              <h3>{editData ? 'Edit Subcategory' : 'Add Subcategory'}</h3>

              {error && <p>{error}</p>}

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Subcategory name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <div style={{ marginTop: '1rem' }}>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{ marginLeft: '8px' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
