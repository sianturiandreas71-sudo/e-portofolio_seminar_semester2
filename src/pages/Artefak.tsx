import { useEffect, useState } from 'react';
import { FileText, ChevronRight, ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import { supabase, type Artifact } from '@/lib/supabase';
import { normalizeImageUrl, normalizeDirectUrl } from '@/lib/imageUrl';
import { isImageFile, isPdfFile } from '@/lib/upload';
import LiteYouTubePlayer from '@/components/LiteYouTubePlayer';
import PDFViewer from '@/components/PDFViewer';
import Lightbox from '@/components/Lightbox';

export default function Artefak() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Artifact | null>(null);
  const [pdfArtifact, setPdfArtifact] = useState<Artifact | null>(null);

  useEffect(() => {
    supabase
      .from('artifacts')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setArtifacts(data as Artifact[]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center text-gray-400">
        Memuat artefak…
      </div>
    );
  }

  if (selected) {
    return (
      <>
        <ArtefakDetail
          artifact={selected}
          onBack={() => setSelected(null)}
          onOpenPdf={() => setPdfArtifact(selected)}
        />
        {pdfArtifact && (
          <PDFViewer
            url={pdfArtifact.file_url}
            title={pdfArtifact.title}
            onClose={() => setPdfArtifact(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-ppg-600 text-sm tracking-widest uppercase mb-3">Bukti Dukung</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Artefak Pembelajaran Semester 2
        </h1>
        <div className="w-16 h-0.5 bg-ppg-600 mx-auto mb-6" />
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Bukti pembelajaran yang mendukung perjalanan refleksi dan perkembangan saya selama
          Semester 2.
        </p>
      </div>

      {/* Artifact list */}
      {artifacts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">
            Belum ada artefak. Artefak dapat ditambahkan melalui halaman Kelola.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {artifacts.map((artifact) => (
            <button
              key={artifact.id}
              onClick={() => setSelected(artifact)}
              className="w-full flex items-center justify-between gap-4 py-6 px-2 text-left hover:bg-gray-50 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-ppg-700 transition-colors">
                  {artifact.title}
                </h2>
                {artifact.course && (
                  <p className="text-sm text-gray-500 mt-1">{artifact.course}</p>
                )}
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ppg-600 shrink-0">
                Lihat Artefak
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* PDF Viewer modal */}
      {pdfArtifact && (
        <PDFViewer
          url={pdfArtifact.file_url}
          title={pdfArtifact.title}
          onClose={() => setPdfArtifact(null)}
        />
      )}
    </div>
  );
}

/* ============ Detail View ============ */

function ArtefakDetail({
  artifact,
  onBack,
  onOpenPdf,
}: {
  artifact: Artifact;
  onBack: () => void;
  onOpenPdf: () => void;
}) {
  const [showLightbox, setShowLightbox] = useState(false);

  const fileType = artifact.file_type || '';
  const fileName = artifact.file_url.split('/').pop() || '';
  const isPdf = isPdfFile(fileName, fileType) || fileType.toLowerCase() === 'pdf';
  const isImage = isImageFile(fileName, fileType);
  const isDoc = !isPdf && !isImage && fileType.toLowerCase().includes('doc');
  const hasFile = !!artifact.file_url;

  const sections = [
    { label: 'A. Alasan Pemilihan', text: artifact.artifact_reason },
    { label: 'B. Bukti Pembelajaran', text: artifact.evidence_shown },
    { label: 'C. Makna', text: artifact.artifact_meaning },
    { label: 'D. Pembelajaran yang Saya Dapatkan', text: artifact.learning_from_artifact },
    { label: 'E. Kaitan dengan Praktik', text: artifact.practical_connection },
  ];

  const hasAnalysis = sections.some((s) => s.text && s.text.trim());

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-ppg-600 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Artefak
      </button>

      {/* Title block */}
      <div className="mb-10">
        <p className="text-ppg-600 text-sm font-bold uppercase tracking-wider mb-2">
          {artifact.type || 'Artefak'}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {artifact.title}
        </h1>
        {artifact.course && (
          <p className="text-gray-500 text-sm">{artifact.course}</p>
        )}
      </div>

      {/* Preview image */}
      {artifact.preview_url && (
        <div className="mb-8">
          <img
            src={normalizeImageUrl(artifact.preview_url)}
            alt={artifact.title}
            className="w-full max-h-80 object-cover border border-gray-200"
          />
        </div>
      )}

      {/* Description */}
      {artifact.description && artifact.description.trim() && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-[15px]">
            {artifact.description}
          </p>
        </div>
      )}

      {/* YouTube video */}
      {artifact.video_url && (
        <div className="mb-10">
          <LiteYouTubePlayer url={artifact.video_url} title={artifact.title} />
        </div>
      )}

      {/* File actions */}
      {hasFile && (
        <div className="mb-10 flex flex-wrap gap-3">
          {isPdf && (
            <button
              onClick={onOpenPdf}
              className="inline-flex items-center gap-2 bg-ppg-600 hover:bg-ppg-700 text-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Baca File Artefak
            </button>
          )}
          {isImage && (
            <button
              onClick={() => setShowLightbox(true)}
              className="inline-flex items-center gap-2 bg-ppg-600 hover:bg-ppg-700 text-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Lihat Foto Artefak
            </button>
          )}
          <a
            href={normalizeDirectUrl(artifact.file_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2.5 text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {isDoc ? 'Buka Dokumen di Tab Baru' : 'Buka di Tab Baru'}
          </a>
        </div>
      )}

      {/* Lightbox for image artifacts */}
      {showLightbox && isImage && (
        <Lightbox
          images={[{ url: normalizeImageUrl(artifact.file_url), caption: artifact.title }]}
          index={0}
          onClose={() => setShowLightbox(false)}
          onNavigate={() => {}}
        />
      )}

      {/* Divider before analysis */}
      <div className="border-t border-gray-200 pt-8">
        {!hasAnalysis ? (
          <p className="text-gray-400 text-sm italic">Analisis artefak belum diisi.</p>
        ) : (
          <div className="space-y-8">
            {sections.map((section) => (
              <DetailSection key={section.label} label={section.label} text={section.text} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailSection({ label, text }: { label: string; text: string }) {
  if (!text || !text.trim()) return null;

  return (
    <div>
      <h2 className="font-bold text-gray-900 text-base mb-2">{label}</h2>
      <p className="text-gray-700 leading-relaxed text-[15px] whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}
