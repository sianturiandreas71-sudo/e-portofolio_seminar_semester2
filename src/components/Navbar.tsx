import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const navLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Refleksi', path: '/refleksi' },
  { label: 'Kaitan Praktis', path: '/kaitan-praktis' },
  { label: 'Artefak', path: '/artefak' },
  { label: 'Refleksi Pengalaman', path: '/refleksi-pengalaman' },
  { label: 'Desain Karya Inovatif', path: '/desain-karya' },
  { label: 'Dokumentasi', path: '/dokumentasi' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { session } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-ppg-700 text-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <GraduationCap className="w-7 h-7 text-ppg-100" />
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-wide">PPG Prajabatan</span>
              <p className="text-xs text-ppg-200 -mt-0.5">E-Portofolio PJOK</p>
            </div>
            <span className="sm:hidden text-base font-bold">PPG</span>
          </Link>

          {/* Hamburger toggle — always visible on all screen sizes */}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-white hover:bg-ppg-600 rounded transition-colors"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Dropdown panel — shown on all screen sizes when toggled */}
      {open && (
        <div className="border-t border-ppg-600">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 text-[15px] rounded transition-colors ${
                  isActive(link.path)
                    ? 'bg-ppg-800 text-white'
                    : 'text-ppg-100 hover:bg-ppg-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={session ? '/kelola' : '/login'}
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 px-3 py-2.5 text-[15px] text-ppg-100 hover:bg-ppg-600 rounded transition-colors"
            >
              <Settings className="w-4 h-4" />
              Kelola
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
