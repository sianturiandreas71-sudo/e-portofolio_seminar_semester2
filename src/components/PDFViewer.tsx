import { useEffect, useState, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, ExternalLink, AlertCircle, Download, Loader2 } from 'lucide-react';
import { normalizeEmbedUrl, normalizeDirectUrl } from '@/lib/imageUrl';

type Props = {
  url: string;
  title: string;
  onClose: () => void;
  fullscreen?: boolean;
};

export default function PDFViewer({ url, title, onClose, fullscreen: initialFullscreen = false }: Props) {
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [fullscreen, setFullscreen] = useState(initialFullscreen);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const directUrl = normalizeDirectUrl(url);
  const isGoogleDrive = normalizeEmbedUrl(url) !== url;

  // Fetch PDF as blob to bypass X-Frame-Options on Supabase Storage
  useEffect(() => {
    let cancelled = false;

    // Clean up previous blob URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setLoaded(false);
    setLoading(true);
    setLoadFailed(false);
    setBlobUrl(null);

    // Google Drive URLs use the embed URL directly — no blob fetch needed
    if (isGoogleDrive) {
      setBlobUrl(normalizeEmbedUrl(url));
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        if (cancelled) return;
        if (blob.type !== 'application/pdf' && !blob.type.includes('pdf')) {
          // Still try to use it — some servers return generic MIME types
        }
        const objUrl = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(objUrl);
          return;
        }
        objectUrlRef.current = objUrl;
        setBlobUrl(objUrl);
        setLoading(false);
      } catch {
        if (cancelled) return;
        // Fallback to Google Docs Viewer
        const fallbackUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        setBlobUrl(fallbackUrl);
        setLoading(false);
        // We can't know if the fallback loaded, so set a timeout to detect failure
        const timer = setTimeout(() => {
          if (!cancelled) setLoaded((prev) => {
            if (!prev) setLoadFailed(true);
            return prev;
          });
        }, 15000);
        return () => clearTimeout(timer);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, isGoogleDrive]);

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  // For Google Drive embeds, detect if the iframe fails to load
  useEffect(() => {
    if (!isGoogleDrive) return;
    setLoaded(false);
    setLoadFailed(false);
    const timer = setTimeout(() => {
      setLoaded((prev) => {
        if (!prev) setLoadFailed(true);
        return prev;
      });
    }, 12000);
    return () => clearTimeout(timer);
  }, [url, isGoogleDrive]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setPage((p) => Math.max(1, p - 1));
      if (e.key === 'ArrowRight') setPage((p) => Math.min(numPages || p, p + 1));
    },
    [numPages, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const viewer = blobUrl
    ? isGoogleDrive
      ? blobUrl
      : `${blobUrl}#page=${page}&zoom=${Math.round(scale * 100)}`
    : '';

  return (
    <div
      className={`${
        fullscreen ? 'fixed inset-0 z-[100] bg-gray-900' : 'fixed inset-0 z-50 bg-black/70'
      } flex flex-col`}
      role="dialog"
      aria-modal="true"
    >
      {/* Toolbar */}
      <div
        className={`flex items-center justify-between px-4 py-3 shrink-0 ${
          fullscreen ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 border-b border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              fullscreen ? 'hover:bg-gray-700' : ''
            }`}
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold truncate">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {!isGoogleDrive && !loading && !loadFailed && (
            <>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm tabular-nums px-2">
                {loaded ? `${page} / ${numPages || '?'}` : 'Memuat…'}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(numPages || p, p + 1))}
                disabled={numPages > 0 && page >= numPages}
                className="p-1.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className={`w-px h-6 mx-1 ${fullscreen ? 'bg-gray-600' : 'bg-gray-300'}`} />

              <button
                onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
                className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm tabular-nums w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(3, s + 0.25))}
                className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </>
          )}

          <div className={`w-px h-6 mx-1 ${fullscreen ? 'bg-gray-600' : 'bg-gray-300'}`} />

          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              fullscreen ? 'hover:bg-gray-700' : ''
            }`}
            aria-label="Buka di tab baru"
            title="Buka di Tab Baru"
          >
            <ExternalLink className="w-5 h-5" />
          </a>

          <a
            href={directUrl}
            download
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              fullscreen ? 'hover:bg-gray-700' : ''
            }`}
            aria-label="Unduh PDF"
            title="Unduh PDF"
          >
            <Download className="w-5 h-5" />
          </a>

          <button
            onClick={() => setFullscreen((f) => !f)}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            aria-label="Layar penuh"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF content area */}
      <div className="flex-1 overflow-hidden bg-gray-200 relative">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-8 h-8 text-ppg-500 animate-spin" />
            <div className="text-gray-600 text-sm">Memuat PDF…</div>
          </div>
        )}

        {/* Fallback / error state */}
        {loadFailed && (
          <div className="flex items-center justify-center h-full px-8">
            <div className="text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">
                Dokumen tidak dapat ditampilkan langsung di website.
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Anda dapat membuka atau mengunduh dokumen ini langsung.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-ppg-600 hover:bg-ppg-700 text-white px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka di Tab Baru
                </a>
                <a
                  href={directUrl}
                  download
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Unduh PDF
                </a>
              </div>
            </div>
          </div>
        )}

        {/* PDF iframe */}
        {!loading && !loadFailed && blobUrl && (
          <iframe
            key={viewer}
            src={viewer}
            className={`w-full h-full border-0 ${loaded ? 'block' : 'hidden'}`}
            title={title}
            onLoad={() => {
              setLoaded(true);
              setNumPages((prev) => prev || 1);
            }}
          />
        )}

        {/* Iframe still loading (blob ready but onLoad hasn't fired) */}
        {!loading && !loadFailed && blobUrl && !loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-200">
            <Loader2 className="w-8 h-8 text-ppg-500 animate-spin" />
            <div className="text-gray-600 text-sm">Menyiapkan dokumen…</div>
          </div>
        )}
      </div>
    </div>
  );
}
