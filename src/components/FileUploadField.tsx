import { useRef, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import {
  formatFileSize,
  isImageFile,
  type UploadResult,
} from '@/lib/upload';

type Props = {
  label: string;
  accept: string;
  currentUrl?: string;
  currentFileName?: string;
  onUpload: (file: File) => Promise<UploadResult>;
  onClear: () => void;
  bucket: string;
  hint?: string;
};

export default function FileUploadField({
  label,
  accept,
  currentUrl,
  currentFileName,
  onUpload,
  onClear,
  bucket,
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '');
  const [fileName, setFileName] = useState(currentFileName || '');
  const [fileSize, setFileSize] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);
    setUploading(true);

    try {
      const result = await onUpload(file);
      setPreviewUrl(result.publicUrl);
      setFileName(result.fileName);
      setFileSize(result.fileSize);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengunggah file.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleClear = () => {
    setPreviewUrl('');
    setFileName('');
    setFileSize(null);
    setError(null);
    setSuccess(false);
    onClear();
  };

  const showImagePreview = previewUrl && isImageFile(fileName, '');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {!previewUrl && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 hover:border-ppg-400 hover:bg-ppg-50/30 transition-colors px-4 py-6 text-center"
        >
          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <span className="text-sm text-gray-600 font-medium">Pilih File</span>
          {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </button>
      )}

      {uploading && (
        <div className="border-2 border-dashed border-ppg-300 bg-ppg-50/30 px-4 py-6 text-center">
          <Loader2 className="w-6 h-6 text-ppg-500 mx-auto mb-2 animate-spin" />
          <span className="text-sm text-gray-600">Mengunggah…</span>
        </div>
      )}

      {previewUrl && !uploading && (
        <div className="border border-gray-200 bg-white p-4">
          <div className="flex items-start gap-3">
            {showImagePreview ? (
              <img
                src={previewUrl}
                alt={fileName}
                className="w-20 h-20 object-cover border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-100 border border-gray-200 shrink-0">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                {showImagePreview ? (
                  <ImageIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                )}
                <p className="text-sm font-medium text-gray-800 truncate">{fileName}</p>
              </div>
              {fileSize !== null && (
                <p className="text-xs text-gray-400 mb-2">{formatFileSize(fileSize)}</p>
              )}
              {success && (
                <p className="text-xs text-green-600 flex items-center gap-1 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  File berhasil diunggah
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-xs text-ppg-600 hover:text-ppg-700 font-medium"
                >
                  Ganti File
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  Hapus File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-start gap-1.5 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
