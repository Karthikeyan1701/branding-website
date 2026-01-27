import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded text-sm transition
    ${isActive ? 'bg-gray-100 font-medium' : 'text-gray-600 hover:bg-gray-50'}`;

  return (
    <div className="min-h-screen flex bg-white">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
            fixed z-50 md:static w-64 bg-white border-r ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        <div className="p-4 space-y-6">
          <h3 className="font-semibold text-lg">Admin Dashboard</h3>

          <nav className="space-y-1">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/dashboard/categories" className={linkClass}>
              Categories
            </NavLink>
            <NavLink to="/dashboard/subcategories" className={linkClass}>
              Subcategories
            </NavLink>
            <NavLink to="/dashboard/products" className={linkClass}>
              Products
            </NavLink>
          </nav>

          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}

      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden border-b px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <span className="font-medium">Admin Panel</span>
        </div>
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 lg:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
