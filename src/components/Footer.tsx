import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-ppg-600" />
            <div>
              <p className="text-sm font-bold text-gray-800">
                E-Portofolio PPG Prajabatan
              </p>
              <p className="text-xs text-gray-500">
                Gomos Andreas Sianturi · PJOK · Semester 2 · 2026
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <Link to="/refleksi" className="hover:text-ppg-600 transition-colors">
              Refleksi
            </Link>
            <Link to="/kaitan-praktis" className="hover:text-ppg-600 transition-colors">
              Kaitan Praktis
            </Link>
            <Link to="/artefak" className="hover:text-ppg-600 transition-colors">
              Artefak
            </Link>
            <Link to="/dokumentasi" className="hover:text-ppg-600 transition-colors">
              Dokumentasi
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          © 2026 Gomos Andreas Sianturi. PPG Prajabatan — Pendidikan Jasmani, Olahraga, dan Kesehatan.
        </div>
      </div>
    </footer>
  );
}
