import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({
    isActive,
  }) => `block w-full px-4 py-3 rounded text-sm font-medium transition
    ${isActive ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`;

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Name */}
        <div className="font-semibold text-lg">Branding</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/services" className={linkClass}>
            Services
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Protected admin navigation */}
        <NavLink to="/admin" className="hidden md:block px-3 py-2 text-sm font-medium text-gray-600">
          Admin
        </NavLink>

        {/* Mobile toggle menu button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-2">
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/services"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Services
          </NavLink>
          <NavLink
            to="/contact"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Contact
          </NavLink>
          <NavLink
            to="/admin"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Admin
          </NavLink>
        </div>
      )}
    </header>
  );
}
