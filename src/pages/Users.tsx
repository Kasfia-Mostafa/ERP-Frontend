import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth, type User } from '../context/AuthContext';
import { UserForm } from '../components/UserForm';
import { Plus, Edit2, Trash2, Search, ArrowLeft, ArrowRight, Users as UsersIcon } from 'lucide-react';

export const Users: React.FC = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchVal, setSearchVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 8;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/users?page=${page}&limit=${limit}`;
      if (searchQuery) url += `&search=${searchQuery}`;
      
      const response = await axios.get(url);
      setUsers(response.data.data.users);
      setTotalCount(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to retrieve users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchVal);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight vintage-font-title">User Management</h1>
        <p className="text-gray-500 mt-1">Manage system users, roles, and access permissions.</p>
      </div>

      <div className="p-4 border border-[#bba377] shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center bg-[#FAF6ED] rounded-sm">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1 items-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 vintage-input text-sm bg-white"
            />
            <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-[#bba377]" />
          </form>
        </div>

        {hasPermission('manage_users') && (
          <button
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
            className="w-full md:w-auto px-5 py-2.5 vintage-btn-primary flex items-center justify-center gap-2 text-sm shrink-0"
          >
            <Plus className="h-4.5 w-4.5" />
            Add User
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
      ) : users.length === 0 ? (
        <div className="bg-white rounded border border-[#bba377] shadow-sm p-16 text-center text-gray-400 bg-[#FAF6ED]">
          <UsersIcon className="h-14 w-14 mx-auto stroke-1 text-[#bba377]" />
          <p className="mt-4 font-bold text-lg text-dark font-serif">No users found</p>
          <p className="text-sm mt-1 font-serif">Try resetting search queries or adding new users.</p>
        </div>
      ) : (
        <div className="vintage-table-container overflow-hidden">

          {/* ── Mobile Card List (visible below md) ── */}
          <div className="block md:hidden divide-y divide-gray-100">
            {users.map((user) => (
              <div key={user._id} className="p-4 bg-[#FAF6ED] hover:bg-[#F3EBD9]/40 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-dark text-sm vintage-font-title truncate">{user.name}</p>
                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">{user.email}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2 py-0.5 border rounded text-[10px] font-bold ${
                    user.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                  <span><span className="font-semibold text-gray-400">Role:</span> {user.role?.name || 'Unknown'}</span>
                </div>
                {hasPermission('manage_users') && (
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openEditForm(user)} className="p-1.5 vintage-btn-icon inline-flex" title="Edit user">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="p-1.5 vintage-btn-icon vintage-btn-danger inline-flex" title="Delete user">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Desktop Table (visible from md up) ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="vintage-table text-left w-full">
              <thead>
                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  {hasPermission('manage_users') && <th className="py-4 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-dark vintage-font-title">{user.name}</td>
                    <td className="py-4 px-6 text-xs text-gray-600">{user.email}</td>
                    <td className="py-4 px-6 text-gray-500">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {user.role?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 border rounded text-xs font-bold ${
                          user.isActive
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {hasPermission('manage_users') && (
                      <td className="py-4 px-6 text-right space-x-2 shrink-0">
                        <button onClick={() => openEditForm(user)} className="p-1.5 vintage-btn-icon inline-flex" title="Edit user">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="p-1.5 vintage-btn-icon vintage-btn-danger inline-flex" title="Delete user">
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
        <UserForm
          isOpen={isFormOpen}
          user={editingUser}
          onClose={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
          onSubmit={() => {
            setIsFormOpen(false);
            setEditingUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};
