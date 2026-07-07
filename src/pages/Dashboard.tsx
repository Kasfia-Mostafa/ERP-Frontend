import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, TrendingUp, AlertTriangle, ShoppingCart } from 'lucide-react';

interface LowStockProduct {
  _id: string;
  name: string;
  sku: string;
  category: string;
  stockQuantity: number;
  purchasePrice: number;
  sellingPrice: number;
}

interface DashboardData {
  totalProducts: number;
  totalSalesCount: number;
  totalRevenue: number;
  lowStockCount: number;
  lowStockProducts: LowStockProduct[];
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/dashboard/stats');
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-vibrant border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <p className="font-semibold">Error Loading Dashboard</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight vintage-font-title">System Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time overview of inventory levels and sales performance.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="vintage-card p-6 flex items-center gap-5">
          <div className="h-12 w-12 rounded bg-peach/40 flex items-center justify-center text-orange-secondary border border-orange-secondary/20">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider vintage-font-title">Total Products</span>
            <p className="text-2xl font-bold text-dark mt-1 vintage-font-title">{data?.totalProducts}</p>
          </div>
        </div>

        {/* Total Sales Count */}
        <div className="vintage-card p-6 flex items-center gap-5">
          <div className="h-12 w-12 rounded bg-peach/40 flex items-center justify-center text-orange-vibrant border border-orange-vibrant/20">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider vintage-font-title">Sales Count</span>
            <p className="text-2xl font-bold text-dark mt-1 vintage-font-title">{data?.totalSalesCount}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="vintage-card p-6 flex items-center gap-5">
          <div className="h-12 w-12 rounded bg-sage/30 flex items-center justify-center text-green-800 border border-sage/40">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider vintage-font-title">Total Revenue</span>
            <p className="text-2xl font-bold text-dark mt-1 vintage-font-title">
              ৳{data?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`p-6 flex items-center gap-5 transition-all vintage-card ${
          (data?.lowStockCount || 0) > 0 
            ? 'bg-red-50/70 border-red-300 text-red-900' 
            : ''
        }`}>
          <div className={`h-12 w-12 rounded flex items-center justify-center border ${
            (data?.lowStockCount || 0) > 0 ? 'bg-red-200/80 text-red-600 border-red-300' : 'bg-gold/20 text-orange-secondary border-gold/30'
          }`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider vintage-font-title">Low Stock items</span>
            <p className="text-2xl font-bold mt-1 vintage-font-title">{data?.lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* Low Stock Products Section */}
      <div className="vintage-table-container overflow-hidden">
        <div className="p-6 border-b border-gray-150 flex justify-between items-center vintage-card-header bg-[#F3EBD9]">
          <div>
            <h2 className="text-lg font-bold text-dark vintage-font-title">Low Stock Alerts</h2>
            <p className="text-xs text-gray-500 mt-1">Products with inventory count below 5 units.</p>
          </div>
        </div>

        {(!data?.lowStockProducts || data.lowStockProducts.length === 0) ? (
          <div className="p-12 text-center text-gray-400">
            <Package className="h-12 w-12 mx-auto stroke-1" />
            <p className="mt-4 font-medium">All products are healthy! No low stock alerts.</p>
          </div>
        ) : (
          <>
            {/* ── Mobile Card List (visible below md) ── */}
            <div className="block md:hidden divide-y divide-gray-100">
              {data.lowStockProducts.map((product) => (
                <div key={product._id} className="p-4 bg-[#FAF6ED] hover:bg-[#F3EBD9]/40 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-dark text-sm vintage-font-title truncate">{product.name}</p>
                      <p className="text-[10px] font-mono text-gray-400 mt-0.5">{product.sku}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 border border-red-200 rounded text-[10px] font-bold bg-red-100 text-red-700">
                      <AlertTriangle className="h-3 w-3" />
                      {product.stockQuantity} Left
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span><span className="font-semibold text-gray-400">Category:</span> {product.category}</span>
                    <span><span className="font-semibold text-gray-400">Buy:</span> ৳{product.purchasePrice}</span>
                    <span><span className="font-semibold text-dark">Sell: ৳{product.sellingPrice}</span></span>
                  </div>
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
                    <th className="py-4 px-6">Prices (Buy / Sell)</th>
                    <th className="py-4 px-6">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {data.lowStockProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-dark vintage-font-title">{product.name}</td>
                      <td className="py-4 px-6 font-mono text-xs">{product.sku}</td>
                      <td className="py-4 px-6 text-gray-500">{product.category}</td>
                      <td className="py-4 px-6 font-mono text-xs">
                        <span className="text-gray-400">৳{product.purchasePrice}</span>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="font-semibold text-dark">৳{product.sellingPrice}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-red-200 rounded text-xs font-bold bg-red-100 text-red-700">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {product.stockQuantity} Left
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
