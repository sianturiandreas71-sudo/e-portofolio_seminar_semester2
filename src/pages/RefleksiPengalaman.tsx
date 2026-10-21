import { useEffect, useState } from 'react';
import { Eye, GraduationCap, Target, Calendar, CheckCircle2, ListChecks, ArrowRight } from 'lucide-react';
import { supabase, type RefleksiPengalaman } from '@/lib/supabase';

const rtlFields = [
  { num: 1, icon: Target },
  { num: 2, icon: Target },
  { num: 3, icon: Target },
] as const;

export default function RefleksiPengalamanPage() {
  const [data, setData] = useState<RefleksiPengalaman | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('refleksi_pengalaman')
      .select('*')
      .maybeSingle()
      .then(({ data: result }) => {
        if (result) setData(result as RefleksiPengalaman);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center text-gray-400">
        Memuat refleksi…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-16">
          <p className="text-ppg-600 text-sm tracking-widest uppercase mb-3">Refleksi Akhir</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Refleksi Pengalaman Belajar Selama Mengikuti PPG
          </h1>
          <div className="w-16 h-0.5 bg-ppg-600 mx-auto" />
        </div>
        <p className="text-center text-gray-400 py-12">
          Konten refleksi belum diisi. Silakan tambahkan melalui halaman Kelola.
        </p>
      </div>
    );
  }

  const sections = [
    { id: 'pandangan', label: 'A. Pandangan tentang Pendidikan' },
    { id: 'profesional', label: 'B. Upaya Menjadi Guru Profesional' },
    { id: 'rtl', label: 'C. Rencana Tindak Lanjut' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Page header */}
      <div className="text-center mb-12">
        <p className="text-ppg-600 text-sm tracking-widest uppercase mb-3">Refleksi Akhir</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Refleksi Pengalaman Belajar Selama Mengikuti PPG
        </h1>
        <div className="w-16 h-0.5 bg-ppg-600 mx-auto mb-6" />
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Refleksi akhir yang menggambarkan pengalaman, pemahaman, perubahan cara pandang,
          serta komitmen saya setelah mengikuti rangkaian program PPG Prajabatan.
        </p>
      </div>

      {/* Table of contents */}
      <div className="border border-gray-200 bg-gray-50 px-5 py-4 mb-16">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Daftar Isi</p>
        <nav className="space-y-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-ppg-600 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 text-ppg-400" />
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Section A — Pandangan tentang Pendidikan */}
      <section id="pandangan" className="pt-8 border-t border-gray-200 mb-16 scroll-mt-20">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">
            A. Pandangan tentang Pendidikan di Indonesia Setelah Mengikuti PPG
          </h2>
        </div>
        <div className="text-gray-700 leading-relaxed text-[15px] whitespace-pre-wrap ml-0 sm:ml-8">
          {data.education_view}
        </div>
      </section>

      {/* Section B — Upaya Menjadi Guru Profesional */}
      <section id="profesional" className="pt-8 border-t border-gray-200 mb-16 scroll-mt-20">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">
            B. Upaya Menjadi Guru yang Profesional
          </h2>
        </div>
        <div className="text-gray-700 leading-relaxed text-[15px] whitespace-pre-wrap ml-0 sm:ml-8">
          {data.professional_effort}
        </div>
      </section>

      {/* Section C — Rencana Tindak Lanjut */}
      <section id="rtl" className="pt-8 border-t border-gray-200 mb-12 scroll-mt-20">
        <div className="flex items-center gap-3 mb-2">
          <ListChecks className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">
            C. Rencana Tindak Lanjut Saat Memulai Karier sebagai Guru
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-8 ml-0 sm:ml-8">
          Tiga rencana tindak lanjut yang konkret, realistis, dan dapat dilaksanakan ketika
          mulai berkarier sebagai guru.
        </p>

        <div className="space-y-6">
          {rtlFields.map((rtl) => {
            const prefix = `rtl_${rtl.num}_`;
            const title = (data as Record<string, string>)[`${prefix}title`];
            const action = (data as Record<string, string>)[`${prefix}action`];
            const goal = (data as Record<string, string>)[`${prefix}goal`];
            const indicator = (data as Record<string, string>)[`${prefix}indicator`];
            const timeframe = (data as Record<string, string>)[`${prefix}timeframe`];

            if (!title && !action) return null;

            return (
              <div key={rtl.num} className="border border-gray-200 bg-white p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-ppg-600 text-white flex items-center justify-center text-sm font-bold">
                    {rtl.num}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug pt-0.5">
                    {title}
                  </h3>
                </div>

                <div className="space-y-4 ml-0 sm:ml-11">
                  {action && (
                    <div>
                      <p className="text-xs font-bold text-ppg-600 uppercase tracking-wider mb-1.5">
                        Tindakan
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">{action}</p>
                    </div>
                  )}
                  {goal && (
                    <div>
                      <p className="text-xs font-bold text-ppg-600 uppercase tracking-wider mb-1.5">
                        Tujuan
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">{goal}</p>
                    </div>
                  )}
                  {indicator && (
                    <div>
                      <p className="text-xs font-bold text-ppg-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Indikator Keberhasilan
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">{indicator}</p>
                    </div>
                  )}
                  {timeframe && (
                    <div>
                      <p className="text-xs font-bold text-ppg-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Waktu Pelaksanaan
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">{timeframe}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
