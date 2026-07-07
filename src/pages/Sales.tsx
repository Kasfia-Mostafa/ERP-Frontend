import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Trash2, Calendar, FileText, ShoppingBag, CheckCircle, User } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  stockQuantity: number;
}

interface SaleItemInput {
  product: string;
  quantity: number;
  name?: string;
  sellingPrice?: number;
  stockQuantity?: number;
}

interface SaleHistoryItem {
  _id: string;
  saleNumber: string;
  items: Array<{
    product: {
      name: string;
      sku: string;
    };
    quantity: number;
    unitPrice: number;
  }>;
  grandTotal: number;
  soldBy: {
    name: string;
  };
  createdAt: string;
}

export const Sales: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesHistory, setSalesHistory] = useState<SaleHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saleItems, setSaleItems] = useState<SaleItemInput[]>([]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, salesRes] = await Promise.all([
        axios.get('/products?limit=100'),
        axios.get('/sales?limit=50&sort=-createdAt'),
      ]);
      setProducts(prodRes.data.data.products);
      setSalesHistory(salesRes.data.data.sales);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to retrieve sales and products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle click outside of the suggestions dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddProductToSale = (productId?: string) => {
    let targetProductId = productId || selectedProductToAdd;
    
    // If no explicit product has been clicked from the suggestions, try matching the typed text
    if (!targetProductId && productSearch.trim()) {
      const match = products.find(
        (p) => `${p.name} (SKU: ${p.sku})`.toLowerCase() === productSearch.toLowerCase() ||
               p.sku.toLowerCase() === productSearch.toLowerCase() ||
               p.name.toLowerCase() === productSearch.toLowerCase()
      );
      if (match) {
        targetProductId = match._id;
      }
    }

    if (!targetProductId) {
      alert('Please select a valid product from the suggestions.');
      return;
    }
    
    if (saleItems.some((item) => item.product === targetProductId)) {
      alert('Product is already added. Please adjust the quantity instead.');
      return;
    }

    const prod = products.find((p) => p._id === targetProductId);
    if (!prod) return;

    if (prod.stockQuantity <= 0) {
      alert('This product is out of stock.');
      return;
    }

    setSaleItems([
      ...saleItems,
      {
        product: prod._id,
        quantity: 1,
        name: prod.name,
        sellingPrice: prod.sellingPrice,
        stockQuantity: prod.stockQuantity,
      },
    ]);
    setSelectedProductToAdd('');
    setProductSearch('');
    setShowSuggestions(false);
  };

  const handleQuantityChange = (index: number, newQty: number) => {
    const items = [...saleItems];
    const item = items[index];

    if (newQty < 1) return;

    if (item.stockQuantity !== undefined && newQty > item.stockQuantity) {
      alert(`Only ${item.stockQuantity} units available in stock.`);
      items[index].quantity = item.stockQuantity;
    } else {
      items[index].quantity = newQty;
    }
    setSaleItems(items);
  };

  const handleRemoveItem = (index: number) => {
    const items = saleItems.filter((_, i) => i !== index);
    setSaleItems(items);
  };

  const grandTotal = saleItems.reduce(
    (sum, item) => sum + (item.sellingPrice || 0) * item.quantity,
    0
  );

  const handleSubmitSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (saleItems.length === 0) {
      setSubmitError('Please add at least one product to the sale.');
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = {
        items: saleItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };

      const res = await axios.post('/sales', payload);
      setSubmitSuccess(`Sale completed successfully! Invoice: ${res.data.data.sale.saleNumber}`);
      setSaleItems([]);
      fetchData();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to complete sales transaction.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-vibrant border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight vintage-font-title">Sales Operations</h1>
        <p className="text-gray-500 mt-1">Register customer sales, check stock levels, and review invoice history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 vintage-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2 vintage-font-title vintage-card-header pb-2">
              <ShoppingBag className="h-5 w-5 text-orange-vibrant" />
              Create Sales Invoice
            </h2>

            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs font-semibold text-red-700 font-serif">
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-xs font-semibold text-green-700 flex items-center gap-2 font-serif">
                <CheckCircle className="h-4.5 w-4.5" />
                {submitSuccess}
              </div>
            )}

            {/* Searchable Product Autocomplete Suggestions Panel */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 bg-[#F3EBD9]/60 p-4 rounded border border-[#bba377] items-end">
              <div className="flex-1 w-full relative" ref={dropdownRef}>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 vintage-font-title">
                  Search Product
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type name or SKU..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full px-3 py-2 vintage-input text-sm bg-white"
                  />

                  {/* Suggestion list shown when typing */}
                  {showSuggestions && productSearch.trim() && (
                    <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-[#bba377] rounded shadow-lg z-50 divide-y divide-gray-100">
                      {products
                        .filter((p) =>
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.sku.toLowerCase().includes(productSearch.toLowerCase())
                        )
                        .map((p) => (
                          <button
                            key={p._id}
                            type="button"
                            disabled={p.stockQuantity <= 0}
                            onClick={() => {
                              setSelectedProductToAdd(p._id);
                              setProductSearch(`${p.name} (SKU: ${p.sku})`);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-3 py-2.5 hover:bg-[#F3EBD9]/40 text-xs flex justify-between items-center transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                          >
                            <div>
                              <span className="font-semibold text-dark">{p.name}</span>
                              <span className="text-gray-400 ml-2 font-mono">({p.sku})</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-dark block">৳{p.sellingPrice.toFixed(2)}</span>
                              <span className="text-[10px] text-gray-450">{p.stockQuantity} in stock</span>
                            </div>
                          </button>
                        ))
                      }
                      {products.filter((p) =>
                        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.sku.toLowerCase().includes(productSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="p-3 text-xs text-gray-400 italic">No products found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAddProductToSale()}
                className="px-5 py-2 vintage-btn-secondary text-sm w-full md:w-auto h-[38px] shrink-0"
              >
                Add Item
              </button>
            </div>

            {saleItems.length === 0 ? (
              <div className="p-10 border border-dashed border-[#bba377] rounded text-center text-gray-400">
                <ShoppingBag className="h-10 w-10 mx-auto stroke-1 text-[#bba377]" />
                <p className="mt-3 text-sm font-medium font-serif">No products added to the invoice yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-1">
                {saleItems.map((item, index) => (
                  <div
                    key={item.product}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#F3EBD9]/35 rounded border border-[#bba377]/60 text-sm gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Unit Price: ৳{item.sellingPrice?.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
                      <div className="flex items-center rounded border border-[#bba377] bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(index, item.quantity - 1)}
                          className="px-2.5 py-1 text-[#705a3a] hover:bg-[#F3EBD9] hover:text-dark font-bold border-r border-[#bba377]/50 transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10) || 1)}
                          className="w-10 text-center text-xs font-semibold focus:outline-none bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(index, item.quantity + 1)}
                          className="px-2.5 py-1 text-[#705a3a] hover:bg-[#F3EBD9] hover:text-dark font-bold border-l border-[#bba377]/50 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-bold text-dark w-16 text-right">
                        ৳{((item.sellingPrice || 0) * item.quantity).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 vintage-btn-icon vintage-btn-danger"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 border-t-2 border-double border-[#bba377]/60 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold text-[#705a3a] uppercase tracking-wider vintage-font-title">Grand Total</span>
              <span className="text-3xl font-extrabold text-dark flex items-center vintage-font-title">
                <span className="text-orange-vibrant shrink-0 mr-1">৳</span>
                {grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleSubmitSale}
              disabled={submitLoading || saleItems.length === 0}
              className="w-full py-3.5 vintage-btn-primary text-base flex items-center justify-center gap-2.5"
            >
              {submitLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : null}
              Complete Checkout
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 vintage-card p-6 flex flex-col">
          <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2 vintage-font-title vintage-card-header pb-2">
            <FileText className="h-5 w-5 text-orange-secondary" />
            Recent Sales Log
          </h2>

          {salesHistory.length === 0 ? (
            <div className="p-12 text-center text-gray-400 border border-dashed border-[#bba377] rounded flex-1 flex flex-col justify-center">
              <FileText className="h-10 w-10 mx-auto stroke-1 text-[#bba377]" />
              <p className="mt-3 text-sm font-medium font-serif">No sales recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1 flex-1">
              {salesHistory.map((sale) => (
                <div
                  key={sale._id}
                  className="p-4 bg-[#FAF6ED] border border-[#bba377]/65 rounded hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-mono font-bold text-gray-500">{sale.saleNumber}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1 font-serif">
                        <Calendar className="h-3 w-3" />
                        {new Date(sale.createdAt).toLocaleDateString()} at{' '}
                        {new Date(sale.createdAt).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-dark font-mono">৳{sale.grandTotal.toFixed(2)}</span>
                  </div>

                  <div className="space-y-1 mt-2 text-xs border-t border-gray-200/60 pt-2 text-gray-600">
                    {sale.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="truncate pr-2">
                          {item.product?.name || 'Deleted Product'} <span className="text-gray-400 font-semibold">x{item.quantity}</span>
                        </span>
                        <span className="font-medium shrink-0">৳{(item.unitPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-dashed border-gray-200/80 text-[10px] text-gray-400 font-semibold uppercase">
                    <User className="h-3.5 w-3.5 text-gray-300" />
                    <span>Sold By: {sale.soldBy?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
