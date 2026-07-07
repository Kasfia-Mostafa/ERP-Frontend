import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ProductForm } from '../components/ProductForm';
import { Plus, Edit2, Trash2, Search, ArrowLeft, ArrowRight, Package } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
}

export const Products: React.FC = () => {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchVal, setSearchVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 8;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [categories, setCategories] = useState<string[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/products?page=${page}&limit=${limit}`;
      if (searchQuery) url += `&search=${searchQuery}`;
      if (categoryFilter) url += `&category=${categoryFilter}`;
      
      const response = await axios.get(url);
      setProducts(response.data.data.products);
      setTotalCount(response.data.total);

      if (categories.length === 0) {
        const catRes = await axios.get('/products?limit=100');
        const allProds: Product[] = catRes.data.data.products;
        const distinctCats = Array.from(new Set(allProds.map(p => p.category)));
        setCategories(distinctCats);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to retrieve products inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchVal);
  };

  const handleCreateOrUpdate = async (productData: Omit<Product, '_id'>) => {
    try {
      if (editingProduct) {
        await axios.put(`/products/${editingProduct._id}`, productData);
      } else {
        await axios.post('/products', productData);
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      setCategories([]);
      fetchProducts();
    } catch (err: any) {
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const openEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setIsFormOpen(true);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight vintage-font-title">Products Inventory</h1>
        <p className="text-gray-500 mt-1">Manage and track your products, stock levels, and pricing.</p>
      </div>

      <div className="p-4 border border-[#bba377] shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center bg-[#FAF6ED] rounded-sm">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1 items-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name, SKU..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 vintage-input text-sm bg-white"
            />
            <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-[#bba377]" />
          </form>

          <div className="w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setPage(1);
                setCategoryFilter(e.target.value);
              }}
              className="w-full md:w-48 px-3 py-2 vintage-input vintage-select text-sm bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasPermission('manage_products') && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="w-full md:w-auto px-5 py-2.5 vintage-btn-primary flex items-center justify-center gap-2 text-sm shrink-0"
          >
            <Plus className="h-4.5 w-4.5" />
            Add Product
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-vibrant border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded text-red-700 font-semibold text-center font-serif">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded border border-[#bba377] shadow-sm p-16 text-center text-gray-400 bg-[#FAF6ED]">
          <Package className="h-14 w-14 mx-auto stroke-1 text-[#bba377]" />
          <p className="mt-4 font-bold text-lg text-dark font-serif">No products found</p>
          <p className="text-sm mt-1 font-serif">Try resetting search queries or adding new products.</p>
        </div>
      ) : (
        <div className="vintage-table-container overflow-hidden">

          {/* ── Mobile Card List (visible below md) ── */}
          <div className="block md:hidden divide-y divide-gray-100">
            {products.map((product) => (
              <div key={product._id} className="p-4 bg-[#FAF6ED] hover:bg-[#F3EBD9]/40 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-dark text-sm vintage-font-title truncate">{product.name}</p>
                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">{product.sku}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2 py-0.5 border rounded text-[10px] font-bold ${
                    product.stockQuantity < 5 ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'
                  }`}>
                    {product.stockQuantity} units
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                  <span><span className="font-semibold text-gray-400">Category:</span> {product.category}</span>
                  <span><span className="font-semibold text-gray-400">Buy:</span> ৳{product.purchasePrice.toFixed(2)}</span>
                  <span><span className="font-semibold text-dark font-bold">Sell: ৳{product.sellingPrice.toFixed(2)}</span></span>
                </div>
                {hasPermission('manage_products') && (
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openEditForm(product)} className="p-1.5 vintage-btn-icon inline-flex" title="Edit product">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="p-1.5 vintage-btn-icon vintage-btn-danger inline-flex" title="Delete product">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Desktop Table (visible from md up) ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="vintage-table text-left">
              <thead>
                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">SKU</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Purchase Price</th>
                  <th className="py-4 px-6">Selling Price</th>
                  <th className="py-4 px-6">Stock</th>
                  {hasPermission('manage_products') && <th className="py-4 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-dark vintage-font-title">{product.name}</td>
                    <td className="py-4 px-6 font-mono text-xs text-gray-600">{product.sku}</td>
                    <td className="py-4 px-6 text-gray-500">{product.category}</td>
                    <td className="py-4 px-6 text-gray-400 font-medium font-mono">৳{product.purchasePrice.toFixed(2)}</td>
                    <td className="py-4 px-6 font-bold text-dark font-mono">৳{product.sellingPrice.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 border rounded text-xs font-bold ${product.stockQuantity < 5
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-green-100 text-green-700 border-green-200'
                        }`}>
                        {product.stockQuantity} units
                      </span>
                    </td>
                    {hasPermission('manage_products') && (
                      <td className="py-4 px-6 text-right space-x-2 shrink-0">
                        <button onClick={() => openEditForm(product)} className="p-1.5 vintage-btn-icon inline-flex" title="Edit product">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-1.5 vintage-btn-icon vintage-btn-danger inline-flex" title="Delete product">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 bg-[#F3EBD9]/50 border-t-2 border-[#bba377]/40 flex items-center justify-between">
              <span className="text-xs text-[#705a3a] font-semibold vintage-font-title tracking-wide">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2 vintage-btn-secondary inline-flex disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2 vintage-btn-secondary inline-flex disabled:opacity-50"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleCreateOrUpdate}
        />
      )}
    </div>
  );
};
