/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function ProductDetails({ open, onClose, product }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

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
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-3 right-3"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {!product ? (
                <p>Loading...</p>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="mt-2">Brand: {product.brand}</p>
                  <p className="mt-1">Price: ₹{product.price}</p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => window.open(product.externalUrl, '_blank')}
                    >
                      Buy from trusted site
                    </button>
                    <button onClick={onClose}>Close</button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
