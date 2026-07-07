import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import type { User } from '../context/AuthContext';

interface Role {
  _id: string;
  name: string;
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  user: User | null;
}

export const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    isActive: true,
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          password: '', // Password is empty on edit by default
          role: user.role._id || (user.role as any as string), // handle object or string id
          isActive: user.isActive,
        });
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          role: '',
          isActive: true,
        });
      }
      setError('');
    }
  }, [isOpen, user]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/users/roles/all');
      setRoles(response.data.data.roles);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load roles');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSubmit = { ...formData };
      if (user && !dataToSubmit.password) {
        delete (dataToSubmit as any).password;
      }

      if (user) {
        await axios.put(`/users/${user._id}`, dataToSubmit);
      } else {
        await axios.post('/users', dataToSubmit);
      }
      onSubmit();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl vintage-card overflow-hidden shadow-2xl border-2 border-[#bba377] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#bba377] bg-[#F3EBD9] vintage-card-header shrink-0">
          <h2 className="text-xl font-bold text-dark vintage-font-title">
            {user ? 'Edit User Profile' : 'Create New User'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-gray-500 hover:bg-[#FAF6ED] hover:text-dark border border-transparent hover:border-[#bba377]/40 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-[#FAF6ED] overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded text-xs font-semibold text-red-700 font-serif">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-1.5 vintage-font-title">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 vintage-input text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-1.5 vintage-font-title">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. john@erp.com"
                  className="w-full px-4 py-2.5 vintage-input text-sm bg-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-1.5 vintage-font-title">
                  Password {user && <span className="text-gray-400 font-normal normal-case">(Leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!user}
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-2.5 vintage-input text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-1.5 vintage-font-title">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 vintage-input text-sm bg-white"
                >
                  <option value="">Select a role</option>
                  {roles.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {user && (
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#bba377] bg-white border-[#bba377] rounded focus:ring-[#bba377]"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-bold text-dark vintage-font-title uppercase tracking-wider">
                    Active User
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#bba377]/40">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 vintage-btn-secondary text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 vintage-btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-dark border-t-transparent"></div>
              ) : null}
              {user ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
