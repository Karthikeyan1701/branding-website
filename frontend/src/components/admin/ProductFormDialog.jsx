/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from 'motion/react';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axios';

export default function ProductFormDialog({
  open,
  onClose,
  onSuccess,
  editData,
}) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
    }
  }, [open]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    api
      .get(`/subcategories/category/${categoryId}`)
      .then((res) => setSubcategories(res.data));
  }, [categoryId]);

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setBrand(editData.brand || '');
      setPrice(editData.price);
      setExternalUrl(editData.externalUrl || '');
      setCategoryId(editData.category?._id || '');
      setSubcategoryId(editData.subcategory?._id || '');
    } else {
      setName('');
      setBrand('');
      setPrice('');
      setExternalUrl('');
      setCategoryId('');
      setSubcategoryId('');
      setSubcategories([]);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        brand,
        price,
        externalUrl,
        categoryId,
        subcategoryId,
      };

      if (editData) {
        await api.put(`/products/${editData._id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to save product');
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
            onClick={!loading ? onClose : undefined}
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
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 relative">
              <button
                className="absolute top-3 right-3 disabled:opacity-60"
                onClick={!loading ? onClose : undefined}
                disabled={loading}
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-semibold mb-3">{editData ? 'Edit Product' : 'Add Product'}</h3>

              {error && <p className="text-red-600 mb-2">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />

                <input
                  placeholder="Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />

                <input
                  placeholder="External product URL"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />

                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2 pt-4">
                  <button type="submit" disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-60">
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={!loading ? onClose : undefined}
                    disabled={loading}
                    className="border px-4 py-2 rounded disabled:opacity-60"
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
