import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b p-4 flex items-center">
      <div className="font-bold">Branding</div>

      {/* Desktop links */}
      <div className="hidden md:flex gap-4 ml-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>

      <NavLink to="/admin" className="ml-auto hidden md:block">
        Admin
      </NavLink>

      {/* Mobile menu button */}
      <button
        className="ml-auto md:hidden transition-transform duration-200"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full border-t bg-white p-4 md:hidden z-50">
          <div className="flex flex-col gap-3">
            <NavLink to="/" onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)}>
              About
            </NavLink>
            <NavLink to="/services" onClick={() => setOpen(false)}>
              Services
            </NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)}>
              Contact
            </NavLink>
            <NavLink to="/admin" onClick={() => setOpen(false)}>
              Admin
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
