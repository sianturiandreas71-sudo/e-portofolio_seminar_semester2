import { useEffect, useState } from 'react';
import { Lightbulb, Search, Wrench, ClipboardCheck, ExternalLink, Tag, Users, AlertCircle, Beaker, Cog, Rocket, ListChecks, Sparkles, HeartHandshake, Database } from 'lucide-react';
import { supabase, type DesainKarya } from '@/lib/supabase';

export default function DesainKaryaInovatif() {
  const [data, setData] = useState<DesainKarya | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('desain_karya')
      .select('*')
      .maybeSingle()
      .then(({ data: result }) => {
        if (result) setData(result as DesainKarya);
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

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-16">
          <p className="text-ppg-600 text-sm tracking-widest uppercase mb-3">PPG Prajabatan</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Penyusunan Desain Karya Inovatif
          </h1>
          <div className="w-16 h-0.5 bg-ppg-600 mx-auto" />
        </div>
        <p className="text-center text-gray-400 py-12">
          Konten halaman ini belum diisi. Silakan tambahkan melalui halaman Kelola.
        </p>
      </div>
    );
  }

  const links = [1, 2, 3]
    .map((n) => ({
      url: (data as Record<string, string>)[`link_url_${n}`],
      label: (data as Record<string, string>)[`link_label_${n}`],
    }))
    .filter((l) => l.url && l.url.trim());

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-ppg-600 text-sm tracking-widest uppercase mb-3">PPG Prajabatan</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Penyusunan Desain Karya Inovatif
        </h1>
        <div className="w-16 h-0.5 bg-ppg-600 mx-auto mb-6" />
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          {data.intro}
        </p>
      </div>

      {/* A. Identitas Karya */}
      <section className="pt-8 border-t border-gray-200 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Tag className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">A. Identitas Karya</h2>
        </div>
        <div className="space-y-5 ml-0 sm:ml-8">
          <div>
            <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              Nama Karya Inovatif
            </p>
            <p className="text-gray-700 leading-relaxed">
              {data.work_name?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Sasaran Inovasi
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.target_audience?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
            </p>
          </div>
        </div>
      </section>

      {/* B. Gagasan dan Riset */}
      <section className="pt-8 border-t border-gray-200 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">B. Gagasan dan Riset</h2>
        </div>
        <div className="space-y-5 ml-0 sm:ml-8">
          <div>
            <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Tantangan atau Permasalahan
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.challenge?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              Gagasan Solusi
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.solution_idea?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Beaker className="w-3.5 h-3.5" />
              Hasil Riset Sederhana
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.research_result?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
            </p>
          </div>
        </div>
      </section>

      {/* C. Rancangan dan Implementasi */}
      <section className="pt-8 border-t border-gray-200 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Wrench className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">C. Rancangan dan Implementasi</h2>
        </div>
        <div className="space-y-5 ml-0 sm:ml-8">
          <div>
            <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Cog className="w-3.5 h-3.5" />
              Rancangan atau Prototipe
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.prototype_desc?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Cog className="w-3.5 h-3.5" />
              Cara Kerja atau Bentuk Karya
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.how_it_works?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5" />
              Rencana Implementasi di Kelas
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.implementation_plan?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
            </p>
          </div>

          {/* Links */}
          {links.length > 0 && (
            <div>
              <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                Tautan Pendukung
              </p>
              <div className="flex flex-col gap-2">
                {links.map((l, i) => (
                  <a
                    key={i}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-ppg-600 hover:text-ppg-700 hover:underline transition-colors w-fit"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {l.label?.trim() || l.url}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* D. Evaluasi */}
      <section className="pt-8 border-t border-gray-200 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardCheck className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">D. Evaluasi</h2>
        </div>
        <div className="space-y-5 ml-0 sm:ml-8">
          <div>
            <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5" />
              Tahapan Evaluasi
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.eval_stages?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
            </p>
          </div>

          {/* Three indicators as distinct cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-ppg-600" />
                <p className="text-xs font-bold text-ppg-600 uppercase tracking-wider">Kebaruan</p>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {data.novelty_indicator?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
              </p>
            </div>
            <div className="border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-ppg-600" />
                <p className="text-xs font-bold text-ppg-600 uppercase tracking-wider">Kreativitas</p>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {data.creativity_indicator?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
              </p>
            </div>
            <div className="border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <HeartHandshake className="w-4 h-4 text-ppg-600" />
                <p className="text-xs font-bold text-ppg-600 uppercase tracking-wider">Kebermanfaatan</p>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {data.usefulness_indicator?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Cara Mengumpulkan Bukti atau Data Evaluasi
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.evidence_method?.trim() || <span className="text-gray-400 italic">Belum diisi</span>}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
