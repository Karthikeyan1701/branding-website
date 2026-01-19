/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from 'motion/react';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createCategory, updateCategory } from '../../api/category.api';

export default function CategoryFormDialog({
  open,
  onClose,
  onSuccess,
  editData,
}) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
    }
  }, [open]);

  useEffect(() => {
      setName(editData ? editData.name : '');
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editData) {
        await updateCategory(editData._id, { name });
      } else {
        await createCategory({ name });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
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
                className="absolute top-3 right-3 p-2 rounded hover:bg-gray-100 disabled:opacity-60"
                onClick={!loading ? onClose : undefined}
                disabled={loading}
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-semibold mb-3"
              >{editData ? 'Edit Category' : 'Add Category'}</h3>

              {error && <p className="text-red-600 mb-2">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
                />

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
