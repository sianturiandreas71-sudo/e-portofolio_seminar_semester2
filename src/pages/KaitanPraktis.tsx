import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, RefreshCw, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, type KaitanPraktisItem } from '@/lib/supabase';

export default function KaitanPraktisPage() {
  const [items, setItems] = useState<KaitanPraktisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCourse, setOpenCourse] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('kaitan_praktis_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setItems(data as KaitanPraktisItem[]);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center text-gray-400">
        Memuat…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <p className="text-ppg-600 text-sm tracking-widest uppercase mb-3">Refleksi Praktis</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Kaitan Praktis: Pembelajaran dan Perubahan di Masa Depan
        </h1>
        <div className="w-16 h-0.5 bg-ppg-600 mx-auto" />
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-400 italic py-12">
          Konten belum diisi. Silakan tambahkan melalui halaman Kelola.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const isOpen = openCourse === item.course;
            return (
              <div key={item.id} className="border border-gray-200 bg-white">
                {/* Course header */}
                <button
                  onClick={() => setOpenCourse(isOpen ? null : item.course)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <BookOpen className="w-5 h-5 text-ppg-600 shrink-0" />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {item.course || 'Mata Kuliah'}
                    </h2>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>

                {/* Course content */}
                {isOpen && (
                  <div className="px-5 pb-6 space-y-8 border-t border-gray-100 pt-6">
                    {/* A. Konsep Utama */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-lg font-bold text-ppg-200 tabular-nums">A</span>
                        <Wrench className="w-4 h-4 text-ppg-600" />
                        <h3 className="text-sm sm:text-base font-bold text-gray-900">
                          Konsep Utama yang Saya Pelajari
                        </h3>
                      </div>
                      <div className="ml-0 sm:ml-8">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                          {item.main_concepts?.trim() ? (
                            item.main_concepts
                          ) : (
                            <p className="italic text-gray-400">Belum diisi</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* B. Perubahan yang Ingin Saya Lakukan */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-lg font-bold text-ppg-200 tabular-nums">B</span>
                        <RefreshCw className="w-4 h-4 text-ppg-600" />
                        <h3 className="text-sm sm:text-base font-bold text-gray-900">
                          Perubahan yang Ingin Saya Lakukan di Masa Depan
                        </h3>
                      </div>
                      <div className="ml-0 sm:ml-8">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                          {item.future_changes?.trim() ? (
                            item.future_changes
                          ) : (
                            <p className="italic text-gray-400">Belum diisi</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Link back to refleksi */}
      <div className="mt-16 pt-8 border-t border-gray-200 text-center">
        <Link
          to="/refleksi"
          className="inline-flex items-center gap-1.5 text-ppg-600 hover:text-ppg-700 text-sm font-medium transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Kembali ke Refleksi
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
