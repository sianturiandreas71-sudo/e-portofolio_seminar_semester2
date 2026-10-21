import { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { extractYouTubeId, isValidYouTubeUrl } from '@/lib/youtube';

type Props = {
  url: string;
  title?: string;
};

/**
 * Lite YouTube player — shows a thumbnail with a play button overlay
 * instead of loading an iframe immediately. On click, swaps in the
 * embed iframe with autoplay. This avoids sandbox / X-Frame-Options
 * issues in restricted environments like Bolt WebContainers.
 */
export default function LiteYouTubePlayer({ url, title = 'Video YouTube' }: Props) {
  const [activated, setActivated] = useState(false);

  if (!url || !isValidYouTubeUrl(url)) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
        URL YouTube tidak valid. Harap periksa kembali link Anda.
      </div>
    );
  }

  const videoId = extractYouTubeId(url)!;

  if (activated) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md border border-gray-200 bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="w-full h-full border-0"
          title={title}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 bg-black/70 hover:bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Buka di YouTube
        </a>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md border border-gray-200 group cursor-pointer bg-gray-900"
      aria-label={`Putar ${title}`}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-500 group-hover:scale-110 transition-all duration-200 shadow-lg">
          <Play className="w-7 h-7 text-white fill-white ml-0.5" />
        </span>
      </div>
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 bg-black/70 hover:bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Buka di YouTube
      </a>
    </button>
  );
}
