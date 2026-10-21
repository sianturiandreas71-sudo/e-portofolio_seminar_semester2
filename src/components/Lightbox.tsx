import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  images: { url: string; caption: string }[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export default function Lightbox({ images, index, onClose, onNavigate }: Props) {
  const current = images[index];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(index > 0 ? index - 1 : images.length - 1);
      if (e.key === 'ArrowRight') onNavigate(index < images.length - 1 ? index + 1 : 0);
    },
    [index, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm text-gray-300">
          {index + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded hover:bg-white/10 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Image */}
      <div
        className="flex-1 flex items-center justify-center px-4 pb-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onNavigate(index > 0 ? index - 1 : images.length - 1)}
          className="absolute left-2 sm:left-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <img
          src={current.url}
          alt={current.caption}
          className="max-w-full max-h-full object-contain"
        />

        <button
          onClick={() => onNavigate(index < images.length - 1 ? index + 1 : 0)}
          className="absolute right-2 sm:right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Berikutnya"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Caption */}
      <div className="text-center py-4 text-white/70 text-sm" onClick={(e) => e.stopPropagation()}>
        {current.caption}
      </div>
    </div>
  );
}
