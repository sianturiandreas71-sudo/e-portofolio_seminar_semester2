import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { supabase, type Documentation } from '@/lib/supabase';
import { normalizeImageUrl } from '@/lib/imageUrl';
import Lightbox from '@/components/Lightbox';

export default function Dokumentasi() {
  const [docs, setDocs] = useState<Documentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from('documentation')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setDocs(data as Documentation[]);
        setLoading(false);
      });
  }, []);

  const lightboxImages = docs.map((d) => ({ url: normalizeImageUrl(d.image_url), caption: d.caption }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <p className="text-ppg-600 text-sm tracking-widest uppercase mb-3">Galeri</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Dokumentasi Semester 2
        </h1>
        <div className="w-16 h-0.5 bg-ppg-600 mx-auto" />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Memuat dokumentasi…</div>
      ) : docs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300">
          <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">
            Belum ada dokumentasi. Foto dapat ditambahkan melalui halaman Kelola.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc, i) => (
            <button
              key={doc.id}
              onClick={() => setLightboxIndex(i)}
              className="group relative overflow-hidden border border-gray-200 bg-white"
            >
              <img
                src={normalizeImageUrl(doc.image_url)}
                alt={doc.caption}
                className="w-full aspect-[4/3] object-cover transition-transform group-hover:scale-105 duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {doc.caption}
              </p>
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
