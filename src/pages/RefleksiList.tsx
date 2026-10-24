import { useEffect, useState } from 'react';
import { FileText, BookOpen, ExternalLink, ArrowLeft, ChevronRight, Link2, AlertCircle, Lightbulb, RefreshCw, FileSearch } from 'lucide-react';
import { supabase, type Reflection } from '@/lib/supabase';
import { normalizeImageUrl, normalizeDirectUrl } from '@/lib/imageUrl';
import PDFViewer from '@/components/PDFViewer';

type Tab = 'pdf' | 'summary' | 'analysis';

const DEFAULT_REFLECTIONS: Reflection[] = [
  {
    id: '1',
    course: 'Pembelajaran Mendalam dan Asesmen (PMA)',
    description: 'Refleksi penerapan asesmen dan strategi pembelajaran mendalam pada mata pelajaran PJOK.',
    focus: 'Desain Universal untuk Pembelajaran (DUP) & Teaching at the Right Level (TaRL)',
    pdf_url: '',
    sort_order: 1,
  },
  {
    id: '2',
    course: 'Pengantar Pendidikan untuk Anak Berkebutuhan Khusus',
    description: 'Refleksi penyesuaian pembelajaran PJOK inklusif bagi peserta didik dengan beragam kebutuhan fisik dan motorik.',
    focus: 'Pembelajaran Inklusif & Adaptasi Olahraga',
    pdf_url: '',
    sort_order: 2,
  },
  {
    id: '3',
    course: 'Prinsip Pengajaran dan Asesmen II',
    description: 'Evaluasi penerapan modul ajar PJOK berbasis siklus perencanaan, pelaksanaan, dan asesmen berkelanjutan.',
    focus: 'Asesmen Formatif & Sumatif PJOK',
    pdf_url: '',
    sort_order: 3,
  },
  {
    id: '4',
    course: 'Pembelajaran Sosial Emosional (PSE)',
    description: 'Integrasi kompetensi sosial emosional dalam aktivitas jasmani untuk membangun kerja sama siswa.',
    focus: 'Kesadaran Diri & Manajemen Diri',
    pdf_url: '',
    sort_order: 4,
  },
  {
    id: '5',
    course: 'Praktik Pengalaman Lapangan II (PPL II)',
    description: 'Refleksi pengalaman mengajar langsung di sekolah latihan dan penerapan berbagai pendekatan pembelajaran.',
    focus: 'Praktik Mengajar Terintegrasi',
    pdf_url: '',
    sort_order: 5,
  },
];

export default function RefleksiList() {
  const [reflections, setReflections] = useState<Reflection[]>(DEFAULT_REFLECTIONS);
  const [loading, setLoading] = useState(true);
  const [pdfReflection, setPdfReflection] = useState<Reflection | null>(null);
  const [selected, setSelected] = useState<Reflection | null>(null);

  useEffect(() => {
    supabase
      .from('reflections')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setReflections(data as Reflection[]);
        } else {
          setReflections(DEFAULT_REFLECTIONS);
        }
        setLoading(false);
      })
      .catch(() => {
        setReflections(DEFAULT_REFLECTIONS);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center text-gray-400">
        Memuat refleksi…
      </div>
    );
  }

  if (selected) {
    return (
      <>
        <RefleksiDetail
          reflection={selected}
          onBack={() => setSelected(null)}
          onOpenPdf={() => setPdfReflection(selected)}
        />
        {pdfReflection && (
          <PDFViewer
            url={pdfReflection.pdf_url}
            title={`Refleksi — ${pdfReflection.course}`}
            onClose={() => setPdfReflection(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <p className="text-ppg-600 text-sm tracking-widest uppercase mb-3">Semester 2</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Refleksi</h1>
        <div className="w-16 h-0.5 bg-ppg-600 mx-auto mb-6" />
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Mata kuliah yang saya jalani selama Semester 2 PPG Prajabatan. Klik mata kuliah
          untuk membaca PDF refleksi, ringkasan 4C, dan analisis artefak.
        </p>
      </div>

      <div className="space-y-0">
        {reflections.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setSelected(r)}
            className="w-full text-left border-t border-gray-200 last:border-b py-10 group"
          >
            <div className="grid md:grid-cols-3 gap-6 md:gap-10 items-start">
              <div className="md:col-span-1">
                <p className="text-5xl font-bold text-ppg-100 mb-4 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </p>
                {r.image_url && (
                  <img
                    src={normalizeImageUrl(r.image_url)}
                    alt={r.course}
                    className="w-full aspect-[3/2] object-cover border border-gray-200"
                  />
                )}
              </div>

              <div className="md:col-span-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-ppg-700 transition-colors">
                  {r.course}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
                  {r.description}
                </p>
                {r.focus && (
                  <div className="mb-5 border-l-2 border-ppg-200 pl-4">
                    <p className="text-xs text-ppg-600 font-bold uppercase tracking-wider mb-1">
                      Fokus Pembelajaran
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">{r.focus}</p>
                  </div>
                )}
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ppg-600">
                  Lihat Refleksi
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {reflections.length === 0 && (
        <div className="text-center py-20 border border-dashed border-gray-300">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">
            Belum ada refleksi. Refleksi dapat ditambahkan melalui halaman Kelola.
          </p>
        </div>
      )}

      {pdfReflection && (
        <PDFViewer
          url={pdfReflection.pdf_url}
          title={`Refleksi — ${pdfReflection.course}`}
          onClose={() => setPdfReflection(null)}
        />
      )}
    </div>
  );
}

/* ============ Detail View ============ */

function RefleksiDetail({
  reflection,
  onBack,
  onOpenPdf,
}: {
  reflection: Reflection;
  onBack: () => void;
  onOpenPdf: () => void;
}) {
  const [tab, setTab] = useState<Tab>('pdf');

  const tabs: { key: Tab; label: string; icon: typeof FileText }[] = [
    { key: 'pdf', label: 'Dokumen PDF', icon: FileText },
    { key: 'summary', label: 'Ringkasan 4C', icon: Lightbulb },
    { key: 'analysis', label: 'Analisis Artefak', icon: FileSearch },
  ];

  const hasSummary = !!(reflection.summary_connection?.trim() || reflection.summary_challenge?.trim() || reflection.summary_concept?.trim() || reflection.summary_change?.trim());
  const hasAnalysis = !!(reflection.artifact_analysis_summary?.trim() || reflection.artifact_analysis_reason?.trim() || reflection.artifact_analysis_meaning?.trim());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-ppg-600 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Refleksi
      </button>

      <div className="mb-8">
        <p className="text-ppg-600 text-sm font-bold uppercase tracking-wider mb-2">
          Refleksi Mata Kuliah
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {reflection.course}
        </h1>
        {reflection.description && (
          <p className="text-gray-600 leading-relaxed text-[15px] mt-3">
            {reflection.description}
          </p>
        )}
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.key
                ? 'border-ppg-600 text-ppg-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'pdf' && (
        <PdfTab reflection={reflection} onOpenPdf={onOpenPdf} />
      )}
      {tab === 'summary' && (
        <SummaryTab reflection={reflection} hasContent={hasSummary} />
      )}
      {tab === 'analysis' && (
        <AnalysisTab reflection={reflection} hasContent={hasAnalysis} />
      )}
    </div>
  );
}

/* ============ PDF Tab ============ */

function PdfTab({ reflection, onOpenPdf }: { reflection: Reflection; onOpenPdf: () => void }) {
  if (!reflection.pdf_url) {
    return (
      <div className="text-center py-16 border border-dashed border-gray-300">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-400 mb-2">PDF refleksi belum diunggah.</p>
        <p className="text-sm text-gray-400">
          Dokumen akan tersedia setelah diunggah melalui halaman Kelola.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 bg-white p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-ppg-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <FileText className="w-8 h-8 text-ppg-600" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">Dokumen Refleksi</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          Baca dokumen refleksi lengkap untuk mata kuliah {reflection.course} langsung di
          halaman ini, atau buka di tab baru.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onOpenPdf}
            className="inline-flex items-center gap-2 bg-ppg-600 hover:bg-ppg-700 text-white px-5 py-2.5 text-sm font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Baca PDF di Sini
          </button>
          <a
            href={normalizeDirectUrl(reflection.pdf_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2.5 text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Buka di Tab Baru
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============ Summary 4C Tab ============ */

function SummaryTab({ reflection, hasContent }: { reflection: Reflection; hasContent: boolean }) {
  if (!hasContent) {
    return (
      <div className="text-center py-16 border border-dashed border-gray-300">
        <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-400">Ringkasan 4C belum diisi untuk mata kuliah ini.</p>
      </div>
    );
  }

  const sections = [
    { key: 'summary_connection' as const, label: 'Connection', icon: Link2, desc: 'Keterkaitan materi dengan pengalaman dan pengetahuan sebelumnya' },
    { key: 'summary_challenge' as const, label: 'Challenge', icon: AlertCircle, desc: 'Tantangan yang dihadapi selama pembelajaran' },
    { key: 'summary_concept' as const, label: 'Concept', icon: Lightbulb, desc: 'Konsep utama yang dipelajari' },
    { key: 'summary_change' as const, label: 'Change', icon: RefreshCw, desc: 'Perubahan pemahaman atau pendekatan setelah pembelajaran' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Ringkasan isi PDF menggunakan pendekatan 4C — Connection, Challenge, Concept, dan Change.
      </p>
      {sections.map((s) => {
        const text = reflection[s.key];
        if (!text || !text.trim()) return null;
        return (
          <div key={s.key} className="border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="shrink-0 w-9 h-9 rounded-full bg-ppg-50 flex items-center justify-center">
                <s.icon className="w-4.5 h-4.5 text-ppg-600" />
              </span>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{s.label}</h3>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap ml-0 sm:ml-12">
              {text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ============ Artifact Analysis Tab ============ */

function AnalysisTab({ reflection, hasContent }: { reflection: Reflection; hasContent: boolean }) {
  if (!hasContent) {
    return (
      <div className="text-center py-16 border border-dashed border-gray-300">
        <FileSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-400">Analisis artefak belum diisi untuk mata kuliah ini.</p>
      </div>
    );
  }

  const sections = [
    { key: 'artifact_analysis_summary' as const, label: 'Ringkasan Analisis', icon: FileSearch },
    { key: 'artifact_analysis_reason' as const, label: 'Alasan Pemilihan Artefak', icon: Lightbulb },
    { key: 'artifact_analysis_meaning' as const, label: 'Makna Artefak', icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Ringkasan analisis artefak yang terdapat dalam dokumen refleksi.
      </p>
      {sections.map((s) => {
        const text = reflection[s.key];
        if (!text || !text.trim()) return null;
        return (
          <div key={s.key} className="border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="shrink-0 w-9 h-9 rounded-full bg-ppg-50 flex items-center justify-center">
                <s.icon className="w-4.5 h-4.5 text-ppg-600" />
              </span>
              <h3 className="font-bold text-gray-900 text-base">{s.label}</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap ml-0 sm:ml-12">
              {text}
            </p>
          </div>
        );
      })}
    </div>
  );
}