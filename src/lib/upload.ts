import { supabase } from '@/lib/supabase';

export type UploadResult = {
  path: string;
  publicUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
};

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export const ACCEPTED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ACCEPTED_PDF_TYPES = ['application/pdf'];

const DOC_EXTENSIONS = ['pdf', 'doc', 'docx'];
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const PDF_EXTENSIONS = ['pdf'];

function getExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

function getMimeType(file: File): string {
  if (file.type) return file.type;
  const ext = getExtension(file.name);
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'doc') return 'application/msword';
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  return '';
}

export function validateFile(
  file: File,
  allowedTypes: string[],
  allowedExtensions: string[],
  maxSize: number = MAX_FILE_SIZE
): string | null {
  const mime = getMimeType(file);
  const ext = getExtension(file.name);

  if (!allowedTypes.includes(mime) && !allowedExtensions.includes(ext)) {
    return `Jenis file tidak didukung. Format yang diterima: ${allowedExtensions.join(', ').toUpperCase()}`;
  }

  if (file.size > maxSize) {
    return `Ukuran file terlalu besar. Maksimal ${Math.round(maxSize / (1024 * 1024))} MB.`;
  }

  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function generateFilePath(file: File, prefix: string): string {
  const ext = getExtension(file.name);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}/${timestamp}-${random}.${ext}`;
}

export async function uploadFile(
  file: File,
  bucket: string,
  prefix: string,
  allowedTypes: string[],
  allowedExtensions: string[]
): Promise<UploadResult> {
  const error = validateFile(file, allowedTypes, allowedExtensions);
  if (error) throw new Error(error);

  const filePath = generateFilePath(file, prefix);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: urlData.publicUrl,
    fileName: file.name,
    fileSize: file.size,
    fileType: getMimeType(file),
  };
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  if (!path) return;
  await supabase.storage.from(bucket).remove([path]);
}

export async function uploadDocFile(file: File, prefix: string = 'documents'): Promise<UploadResult> {
  return uploadFile(file, 'artifacts', prefix, ACCEPTED_DOC_TYPES, DOC_EXTENSIONS);
}

export async function uploadImageFile(file: File, prefix: string = 'images'): Promise<UploadResult> {
  return uploadFile(file, 'artifacts', prefix, ACCEPTED_IMAGE_TYPES, IMAGE_EXTENSIONS);
}

export async function uploadPdfFile(file: File, prefix: string = 'pdfs'): Promise<UploadResult> {
  return uploadFile(file, 'reflections', prefix, ACCEPTED_PDF_TYPES, PDF_EXTENSIONS);
}

export async function uploadDocPhotoFile(file: File, prefix: string = 'photos'): Promise<UploadResult> {
  return uploadFile(file, 'documentation', prefix, ACCEPTED_IMAGE_TYPES, IMAGE_EXTENSIONS);
}

export function isImageFile(fileName: string, fileType: string): boolean {
  const ext = getExtension(fileName);
  return ACCEPTED_IMAGE_TYPES.includes(fileType) || IMAGE_EXTENSIONS.includes(ext);
}

export function isPdfFile(fileName: string, fileType: string): boolean {
  const ext = getExtension(fileName);
  return ACCEPTED_PDF_TYPES.includes(fileType) || PDF_EXTENSIONS.includes(ext);
}

/**
 * Extracts the storage path from a public URL.
 * Returns null if the URL doesn't look like a Supabase Storage URL.
 */
export function extractStoragePath(publicUrl: string, bucket: string): string | null {
  if (!publicUrl) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.substring(idx + marker.length);
}
