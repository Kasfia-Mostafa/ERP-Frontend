import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, LogOut, Package, Users, User, Boxes, ChevronsLeft, ChevronsRight, Menu } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication states and routing utilities
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Collapse/Expand state for the navigation sidebar (default: expanded)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Clears user sessions and redirects to Login portal
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      permission: 'view_dashboard',
    },
    {
      name: 'Products',
      path: '/products',
      icon: <Package className="h-5 w-5" />,
      permission: 'view_products',
    },
    {
      name: 'Sales',
      path: '/sales',
      icon: <ShoppingCart className="h-5 w-5" />,
      permission: 'create_sales',
    },
    {
      name: 'Users',
      path: '/users',
      icon: <Users className="h-5 w-5" />,
      permission: 'manage_users',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bgLight">
      {/* Mobile Top Bar */}
      <div className="flex md:hidden items-center justify-between p-4 bg-[#26231F] text-[#FAF6ED] border-b border-[#bba377]/40 sticky top-0 z-40">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-1 rounded-sm text-gray-400 hover:text-[#FAF6ED]"
          title="Open Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-sm bg-orange-vibrant flex items-center justify-center border border-dark text-dark shrink-0">
            <Boxes className="h-3.5 w-3.5" />
          </div>
          <span className="font-serif italic font-extrabold text-sm tracking-wider text-orange-vibrant">ERP</span>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#2D2A26] border border-[#bba377]/30 text-gold uppercase font-mono tracking-wider">
          {user?.role?.name}
        </div>
      </div>

      {/* Backdrop Overlay for Mobile Drawer */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-dark/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        ${isCollapsed ? 'md:w-20' : 'md:w-64'} 
        w-64 bg-[#26231F] text-[#FAF6ED] flex flex-col h-screen 
        fixed inset-y-0 left-0 z-50 md:sticky md:top-0 
        border-r-4 border-double border-[#bba377] shrink-0 
        transition-all duration-350 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : 'translate-x-[-100%] md:translate-x-0'}
      `}>
        {/* Logo & Toggle */}
        <div className={`p-4 border-b border-[#bba377]/40 flex items-center ${isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'} min-h-[73px] shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm bg-orange-vibrant flex items-center justify-center border border-dark text-dark shrink-0">
              <Boxes className="h-5 w-5" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="font-serif italic font-extrabold text-xl tracking-wider text-orange-vibrant transition-opacity duration-300">ERP</span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-1 rounded-sm text-gray-400 hover:bg-[#FAF6ED]/10 hover:text-[#FAF6ED] border border-transparent hover:border-[#bba377]/30 transition-all"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronsRight className="h-4.5 w-4.5" /> : <ChevronsLeft className="h-4.5 w-4.5" />}
          </button>
        </div>

        {/* Navigation Links (Scrollable) */}
        <div className="flex-1 overflow-y-auto min-h-0 py-2 scrollbar-thin">
          <nav className="p-3 space-y-2.5">
            {menuItems.map((item) => {
              if (item.permission && !hasPermission(item.permission)) return null;

              const isActive = location.pathname === item.path;
              const isCollapsedMobileSafe = isCollapsed && !isMobileOpen;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  title={isCollapsedMobileSafe ? item.name : undefined}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center ${isCollapsedMobileSafe ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-sm font-medium transition-all font-serif ${isActive
                    ? 'bg-[#F3EBD9] text-dark border border-[#bba377] shadow-sm font-bold'
                    : 'hover:bg-[#FAF6ED]/10 text-gray-400 hover:text-[#FAF6ED]'
                    }`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {(!isCollapsedMobileSafe) && <span className="tracking-wide transition-opacity duration-300">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Session (Fixed) */}
        <div className="p-3 border-t border-[#bba377]/40 bg-[#1E1C1A] shrink-0">
          <div className={`flex items-center ${(isCollapsed && !isMobileOpen) ? 'justify-center px-0' : 'gap-3 px-2'} mb-4`}>
            <div className="h-10 w-10 rounded bg-[#FAF6ED]/10 flex items-center justify-center text-orange-secondary border border-[#bba377]/30 font-bold shrink-0">
              <User className="h-5 w-5" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="overflow-hidden transition-opacity duration-300">
                <p className="font-serif font-bold text-sm truncate">{user?.name}</p>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#2D2A26] border border-[#bba377]/30 text-gold mt-1 uppercase font-mono tracking-wider">
                  {user?.role?.name}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            title={(isCollapsed && !isMobileOpen) ? "Logout" : undefined}
            className={`w-full flex items-center ${(isCollapsed && !isMobileOpen) ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-sm text-sm font-semibold text-red-400 hover:bg-[#FAF6ED]/5 hover:text-red-300 transition-all text-left font-serif`}
          >
            <div className="shrink-0"><LogOut className="h-4 w-4" /></div>
            {(!isCollapsed || isMobileOpen) && <span className="transition-opacity duration-300">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
