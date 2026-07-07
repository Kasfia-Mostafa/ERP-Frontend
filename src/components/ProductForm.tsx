import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Product {
  _id?: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
}

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSubmit: (productData: Omit<Product, '_id'>) => Promise<void>;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setCategory(product.category);
      setPurchasePrice(product.purchasePrice.toString());
      setSellingPrice(product.sellingPrice.toString());
      setStockQuantity(product.stockQuantity.toString());
    } else {
      setName('');
      setSku('');
      setCategory('');
      setPurchasePrice('');
      setSellingPrice('');
      setStockQuantity('');
    }
  }, [product]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !sku || !category || !purchasePrice || !sellingPrice || !stockQuantity) {
      setError('All fields are required.');
      return;
    }

    setSubmitting(true);
    try {
      const productData = {
        name,
        sku,
        category,
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        stockQuantity: parseInt(stockQuantity, 10),
      };

      await onSubmit(productData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl vintage-card overflow-hidden shadow-2xl border-2 border-[#bba377] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#bba377] bg-[#F3EBD9] vintage-card-header shrink-0">
          <h2 className="text-xl font-bold text-dark vintage-font-title">
            {product ? 'Edit Product Ledger' : 'Create Product Entry'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-gray-500 hover:bg-[#FAF6ED] hover:text-dark border border-transparent hover:border-[#bba377]/40 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-6 bg-[#FAF6ED] overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded text-xs font-semibold text-red-700 font-serif">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-1.5 vintage-font-title">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mechanical Keyboard"
                  className="w-full px-4 py-2.5 vintage-input text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-1.5 vintage-font-title">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. KB-002"
                  className="w-full px-4 py-2.5 vintage-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-1.5 vintage-font-title">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Accessories"
                  className="w-full px-4 py-2.5 vintage-input text-sm bg-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-655 uppercase tracking-wider mb-1.5 vintage-font-title">
                    Purchase Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 vintage-input text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-655 uppercase tracking-wider mb-1.5 vintage-font-title">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 vintage-input text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-655 uppercase tracking-wider mb-1.5 vintage-font-title">
                  Initial Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 vintage-input text-sm bg-white"
                />
              </div>

            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#bba377]/40">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 vintage-btn-secondary text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 vintage-btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-dark border-t-transparent"></div>
              ) : null}
              {product ? 'Update Ledger Entry' : 'Create Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
