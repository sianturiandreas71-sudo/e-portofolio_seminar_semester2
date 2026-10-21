import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, FileText, Camera, User, Plus, Save, Trash2, Edit3, X, Wrench, Upload, Loader2, Lightbulb } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type Reflection, type Artifact, type Documentation, type Profile, type KaitanPraktis, type KaitanPraktisItem, type RefleksiPengalaman, type DesainKarya } from '@/lib/supabase';
import { normalizeImageUrl } from '@/lib/imageUrl';
import {
  uploadDocFile,
  uploadImageFile,
  uploadPdfFile,
  uploadDocPhotoFile,
  deleteFile,
  extractStoragePath,
  formatFileSize,
  isImageFile,
  isPdfFile,
  ACCEPTED_DOC_TYPES,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPES,
  type UploadResult,
} from '@/lib/upload';
import FileUploadField from '@/components/FileUploadField';
import LiteYouTubePlayer from '@/components/LiteYouTubePlayer';
import { isValidYouTubeUrl } from '@/lib/youtube';

type Tab = 'refleksi' | 'kaitan' | 'artefak' | 'refleksi-pengalaman' | 'desain-karya' | 'dokumentasi' | 'profil';

export default function Kelola() {
  const { session, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('refleksi');

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/login');
    }
  }, [session, authLoading, navigate]);

  if (authLoading || !session) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center text-gray-400">
        Memuat…
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof BookOpen }[] = [
    { key: 'refleksi', label: 'Refleksi', icon: BookOpen },
    { key: 'kaitan', label: 'Kaitan Praktis', icon: Wrench },
    { key: 'artefak', label: 'Artefak', icon: FileText },
    { key: 'refleksi-pengalaman', label: 'Refleksi Pengalaman', icon: BookOpen },
    { key: 'desain-karya', label: 'Desain Karya', icon: Lightbulb },
    { key: 'dokumentasi', label: 'Dokumentasi', icon: Camera },
    { key: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Portofolio</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola refleksi, kaitan praktis, artefak, dokumentasi, dan profil.
          </p>
        </div>
        <button
          onClick={async () => {
            await signOut();
            navigate('/');
          }}
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-300 px-3 py-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>

      {/* Tabs */}
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

      {tab === 'refleksi' && <RefleksiManager />}
      {tab === 'kaitan' && <KaitanPraktisManager />}
      {tab === 'artefak' && <ArtefakManager />}
      {tab === 'refleksi-pengalaman' && <RefleksiPengalamanManager />}
      {tab === 'desain-karya' && <DesainKaryaManager />}
      {tab === 'dokumentasi' && <DokumentasiManager />}
      {tab === 'profil' && <ProfilManager />}
    </div>
  );
}

/* ============ Refleksi Manager ============ */

function RefleksiManager() {
  const [items, setItems] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Reflection | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    supabase
      .from('reflections')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data as Reflection[]);
        setLoading(false);
      });
  };

  useEffect(load, []);

  const handleSave = async (updated: Partial<Reflection> & { id?: string }) => {
    setSaving(true);
    if (updated.id) {
      const { id, created_at, updated_at, ...rest } = updated;
      void created_at;
      void updated_at;
      await supabase.from('reflections').update(rest).eq('id', id);
    } else {
      await supabase.from('reflections').insert({
        course: updated.course || 'Mata Kuliah Baru',
        description: updated.description || '',
        focus: updated.focus || '',
        pdf_url: updated.pdf_url || '',
        summary_connection: updated.summary_connection || '',
        summary_challenge: updated.summary_challenge || '',
        summary_concept: updated.summary_concept || '',
        summary_change: updated.summary_change || '',
        artifact_analysis_summary: updated.artifact_analysis_summary || '',
        artifact_analysis_reason: updated.artifact_analysis_reason || '',
        artifact_analysis_meaning: updated.artifact_analysis_meaning || '',
        sort_order: updated.sort_order || items.length + 1,
      });
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  if (loading) return <p className="text-gray-400">Memuat…</p>;

  return (
    <div>
      {editing ? (
        <RefleksiEditor
          reflection={editing}
          isNew={!editing.id}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{items.length} refleksi</p>
            <button
              onClick={() => setEditing({} as Reflection)}
              className="inline-flex items-center gap-1.5 bg-ppg-600 hover:bg-ppg-700 text-white px-3 py-2 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Refleksi
            </button>
          </div>
          <div className="space-y-2">
            {items.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between border border-gray-200 bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{r.course}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {r.pdf_url ? 'PDF telah diunggah' : 'PDF belum diunggah'}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditing(r)}
                    className="p-2 text-gray-500 hover:text-ppg-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Hapus refleksi "${r.course}"?`)) {
                        await supabase.from('reflections').delete().eq('id', r.id);
                        load();
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RefleksiEditor({
  reflection,
  isNew,
  onSave,
  onCancel,
  saving,
}: {
  reflection: Partial<Reflection>;
  isNew: boolean;
  onSave: (r: Partial<Reflection> & { id?: string }) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<Reflection>>(reflection);
  const [pdfFileName, setPdfFileName] = useState('');

  const textFields: { key: keyof Reflection; label: string; area?: boolean }[] = [
    { key: 'course', label: 'Nama Mata Kuliah' },
    { key: 'description', label: 'Gambaran Umum Mata Kuliah', area: true },
    { key: 'focus', label: 'Fokus Pembelajaran (ringkas)', area: true },
    { key: 'image_url', label: 'URL Gambar (opsional)' },
  ];

  const summaryFields: { key: keyof Reflection; label: string; hint: string }[] = [
    { key: 'summary_connection', label: 'Connection', hint: 'Keterkaitan materi dengan pengalaman dan pengetahuan sebelumnya' },
    { key: 'summary_challenge', label: 'Challenge', hint: 'Tantangan yang dihadapi selama pembelajaran' },
    { key: 'summary_concept', label: 'Concept', hint: 'Konsep utama yang dipelajari' },
    { key: 'summary_change', label: 'Change', hint: 'Perubahan pemahaman atau pendekatan setelah pembelajaran' },
  ];

  const analysisFields: { key: keyof Reflection; label: string }[] = [
    { key: 'artifact_analysis_summary', label: 'Ringkasan Analisis Artefak' },
    { key: 'artifact_analysis_reason', label: 'Alasan Pemilihan Artefak' },
    { key: 'artifact_analysis_meaning', label: 'Makna Artefak' },
  ];

  const handlePdfUpload = async (file: File): Promise<UploadResult> => {
    const result = await uploadPdfFile(file);
    setForm((prev) => ({ ...prev, pdf_url: result.publicUrl }));
    setPdfFileName(result.fileName);
    return result;
  };

  const handlePdfClear = () => {
    setForm((prev) => ({ ...prev, pdf_url: '' }));
    setPdfFileName('');
  };

  return (
    <div className="border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900">{isNew ? 'Tambah Refleksi' : 'Edit Refleksi'}</h3>
        <button onClick={onCancel} className="p-1.5 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        {textFields.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            {f.area ? (
              <textarea
                value={(form[f.key] as string) || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors resize-y"
              />
            ) : (
              <input
                type="text"
                value={(form[f.key] as string) || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors"
              />
            )}
          </div>
        ))}

        <FileUploadField
          label="PDF Refleksi"
          accept={ACCEPTED_PDF_TYPES.join(',')}
          currentUrl={form.pdf_url || ''}
          currentFileName={pdfFileName || (form.pdf_url ? 'PDF refleksi' : '')}
          onUpload={handlePdfUpload}
          onClear={handlePdfClear}
          bucket="reflections"
          hint="Format PDF, maksimal 25 MB"
        />

        {/* 4C Summary */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-bold text-gray-900 mb-1">Ringkasan 4C</p>
          <p className="text-xs text-gray-400 mb-3">Ringkasan isi PDF menggunakan pendekatan 4C.</p>
          <div className="space-y-4">
            {summaryFields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <p className="text-xs text-gray-400 mb-1">{f.hint}</p>
                <textarea
                  value={(form[f.key] as string) || ''}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors resize-y"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Artifact Analysis */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-bold text-gray-900 mb-1">Analisis Artefak</p>
          <p className="text-xs text-gray-400 mb-3">Ringkasan analisis artefak yang terdapat dalam PDF refleksi.</p>
          <div className="space-y-4">
            {analysisFields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <textarea
                  value={(form[f.key] as string) || ''}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors resize-y"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
          <input
            type="number"
            value={form.sort_order ?? 0}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
            className="w-24 px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onSave({ ...form, id: reflection.id })}
            disabled={saving}
            className="inline-flex items-center gap-1.5 bg-ppg-600 hover:bg-ppg-700 text-white px-4 py-2 text-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 text-sm transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ Kaitan Praktis Manager ============ */

/* ============ Kaitan Praktis Manager ============ */

function KaitanPraktisManager() {
  const [items, setItems] = useState<KaitanPraktisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<KaitanPraktisItem | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    supabase
      .from('kaitan_praktis_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data as KaitanPraktisItem[]);
        setLoading(false);
      });
  };

  useEffect(load, []);

  const handleSave = async (updated: Partial<KaitanPraktisItem> & { id?: string }) => {
    setSaving(true);
    if (updated.id) {
      const { id, created_at, updated_at, ...rest } = updated;
      void id;
      void created_at;
      void updated_at;
      await supabase.from('kaitan_praktis_items').update(rest).eq('id', updated.id);
    } else {
      await supabase.from('kaitan_praktis_items').insert({
        course: updated.course || 'Mata Kuliah Baru',
        main_concepts: updated.main_concepts || '',
        future_changes: updated.future_changes || '',
        sort_order: updated.sort_order || items.length + 1,
      });
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  if (loading) return <p className="text-gray-400">Memuat…</p>;

  if (editing) {
    return (
      <KaitanPraktisEditor
        item={editing}
        isNew={!editing.id}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
        saving={saving}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {items.length} mata kuliah
        </p>
        <button
          onClick={() => setEditing({} as KaitanPraktisItem)}
          className="inline-flex items-center gap-1.5 bg-ppg-600 hover:bg-ppg-700 text-white px-3 py-2 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Mata Kuliah
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border border-gray-200 bg-white px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{item.course || 'Tanpa judul'}</p>
              <p className="text-xs text-gray-400 truncate">
                {item.main_concepts ? 'Konsep telah diisi' : 'Konsep belum diisi'}
                {' · '}
                {item.future_changes ? 'Perubahan telah diisi' : 'Perubahan belum diisi'}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setEditing(item)}
                className="p-2 text-gray-500 hover:text-ppg-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={async () => {
                  if (confirm(`Hapus kaitan praktis untuk "${item.course}"?`)) {
                    await supabase.from('kaitan_praktis_items').delete().eq('id', item.id);
                    load();
                  }
                }}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KaitanPraktisEditor({
  item,
  isNew,
  onSave,
  onCancel,
  saving,
}: {
  item: Partial<KaitanPraktisItem>;
  isNew: boolean;
  onSave: (item: Partial<KaitanPraktisItem> & { id?: string }) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<KaitanPraktisItem>>(item);

  return (
    <div className="border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900">
          {isNew ? 'Tambah Kaitan Praktis' : 'Edit Kaitan Praktis'}
        </h3>
        <button onClick={onCancel} className="p-1.5 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Kuliah</label>
          <input
            type="text"
            value={form.course || ''}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            A. Konsep Utama yang Saya Pelajari
          </label>
          <textarea
            value={form.main_concepts || ''}
            onChange={(e) => setForm({ ...form, main_concepts: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors resize-y"
            placeholder="Konsep-konsep utama yang dipelajari, hubungan dengan PJOK, penerapan di kelas, manfaat bagi peserta didik…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            B. Perubahan yang Ingin Saya Lakukan di Masa Depan
          </label>
          <textarea
            value={form.future_changes || ''}
            onChange={(e) => setForm({ ...form, future_changes: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors resize-y"
            placeholder="Perubahan dalam merancang pembelajaran, cara mengajar, rencana penerapan, komitmen pengembangan diri…"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 bg-ppg-600 hover:bg-ppg-700 text-white px-4 py-2 text-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 text-sm transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ Artefak Manager ============ */

function ArtefakManager() {
  const [items, setItems] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Artifact | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    supabase
      .from('artifacts')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data as Artifact[]);
        setLoading(false);
      });
  };

  useEffect(load, []);

  const handleSave = async (updated: Partial<Artifact> & { id?: string }) => {
    setSaving(true);
    if (updated.id) {
      const { id, created_at, updated_at, ...rest } = updated;
      void created_at;
      void updated_at;
      await supabase.from('artifacts').update(rest).eq('id', id);
    } else {
      await supabase.from('artifacts').insert({
        title: updated.title || 'Artefak Baru',
        course: updated.course || '',
        type: updated.type || '',
        description: updated.description || '',
        file_url: updated.file_url || '',
        file_type: updated.file_type || 'pdf',
        preview_url: updated.preview_url || '',
        video_url: updated.video_url || '',
        artifact_reason: updated.artifact_reason || '',
        evidence_shown: updated.evidence_shown || '',
        artifact_meaning: updated.artifact_meaning || '',
        learning_from_artifact: updated.learning_from_artifact || '',
        practical_connection: updated.practical_connection || '',
        sort_order: updated.sort_order || items.length + 1,
      });
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  if (loading) return <p className="text-gray-400">Memuat…</p>;

  return (
    <div>
      {editing ? (
        <ArtefakEditor
          artifact={editing}
          isNew={!editing.id}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{items.length} artefak</p>
            <button
              onClick={() => setEditing({} as Artifact)}
              className="inline-flex items-center gap-1.5 bg-ppg-600 hover:bg-ppg-700 text-white px-3 py-2 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Artefak
            </button>
          </div>
          <div className="space-y-2">
            {items.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between border border-gray-200 bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{a.title}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {a.type} · {a.course || 'Tanpa mata kuliah'}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditing(a)}
                    className="p-2 text-gray-500 hover:text-ppg-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Hapus artefak "${a.title}"?`)) {
                        await supabase.from('artifacts').delete().eq('id', a.id);
                        load();
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ArtefakEditor({
  artifact,
  isNew,
  onSave,
  onCancel,
  saving,
}: {
  artifact: Partial<Artifact>;
  isNew: boolean;
  onSave: (a: Partial<Artifact> & { id?: string }) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<Artifact>>(artifact);
  const [fileFileName, setFileFileName] = useState('');
  const [previewFileName, setPreviewFileName] = useState('');

  const textFields: { key: keyof Artifact; label: string; area?: boolean }[] = [
    { key: 'title', label: 'Judul Artefak' },
    { key: 'course', label: 'Mata Kuliah / Siklus' },
    { key: 'type', label: 'Jenis Artefak (Modul Ajar, LKPD, dll.)' },
    { key: 'description', label: 'Deskripsi Artefak', area: true },
  ];

  const analysisFields: { key: keyof Artifact; label: string }[] = [
    { key: 'artifact_reason', label: 'A. Alasan Pemilihan' },
    { key: 'evidence_shown', label: 'B. Bukti Pembelajaran' },
    { key: 'artifact_meaning', label: 'C. Makna' },
    { key: 'learning_from_artifact', label: 'D. Pembelajaran yang Saya Dapatkan' },
    { key: 'practical_connection', label: 'E. Kaitan dengan Praktik' },
  ];

  const handleFileUpload = async (file: File): Promise<UploadResult> => {
    if (isPdfFile(file.name, file.type)) {
      const result = await uploadDocFile(file, 'documents');
      setForm((prev) => ({ ...prev, file_url: result.publicUrl, file_type: 'pdf' }));
      setFileFileName(result.fileName);
      return result;
    } else {
      const result = await uploadImageFile(file, 'images');
      setForm((prev) => ({ ...prev, file_url: result.publicUrl, file_type: 'image' }));
      setFileFileName(result.fileName);
      return result;
    }
  };

  const handleFileClear = () => {
    setForm((prev) => ({ ...prev, file_url: '', file_type: '' }));
    setFileFileName('');
  };

  const handlePreviewUpload = async (file: File): Promise<UploadResult> => {
    const result = await uploadImageFile(file, 'previews');
    setForm((prev) => ({ ...prev, preview_url: result.publicUrl }));
    setPreviewFileName(result.fileName);
    return result;
  };

  const handlePreviewClear = () => {
    setForm((prev) => ({ ...prev, preview_url: '' }));
    setPreviewFileName('');
  };

  return (
    <div className="border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900">{isNew ? 'Tambah Artefak' : 'Edit Artefak'}</h3>
        <button onClick={onCancel} className="p-1.5 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        {/* Basic info */}
        {textFields.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            {f.area ? (
              <textarea
                value={(form[f.key] as string) || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors resize-y"
              />
            ) : (
              <input
                type="text"
                value={(form[f.key] as string) || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors"
              />
            )}
          </div>
        ))}

        {/* File upload */}
        <FileUploadField
          label="File Artefak"
          accept={[...ACCEPTED_DOC_TYPES, ...ACCEPTED_IMAGE_TYPES].join(',')}
          currentUrl={form.file_url || ''}
          currentFileName={fileFileName || (form.file_url ? 'File artefak' : '')}
          onUpload={handleFileUpload}
          onClear={handleFileClear}
          bucket="artifacts"
          hint="Format PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP — maksimal 25 MB"
        />

        {/* Preview image upload */}
        <FileUploadField
          label="Gambar Pratinjau (opsional)"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          currentUrl={form.preview_url || ''}
          currentFileName={previewFileName || (form.preview_url ? 'Gambar pratinjau' : '')}
          onUpload={handlePreviewUpload}
          onClear={handlePreviewClear}
          bucket="artifacts"
          hint="Format JPG, JPEG, PNG, WEBP — maksimal 25 MB"
        />

        {/* YouTube URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Video YouTube (opsional)</label>
          <input
            type="text"
            value={form.video_url || ''}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors"
          />
          {form.video_url && !isValidYouTubeUrl(form.video_url) && (
            <p className="text-xs text-red-500 mt-1">URL YouTube tidak valid. Harap periksa kembali link Anda.</p>
          )}
          {form.video_url && isValidYouTubeUrl(form.video_url) && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Pratinjau Video:</p>
              <LiteYouTubePlayer url={form.video_url} title="Pratinjau Video YouTube" />
            </div>
          )}
        </div>

        {/* Analysis sections */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-bold text-gray-900 mb-3">Analisis Artefak</p>
          <div className="space-y-4">
            {analysisFields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <textarea
                  value={(form[f.key] as string) || ''}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors resize-y"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
          <input
            type="number"
            value={form.sort_order ?? 0}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
            className="w-24 px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onSave({ ...form, id: artifact.id })}
            disabled={saving}
            className="inline-flex items-center gap-1.5 bg-ppg-600 hover:bg-ppg-700 text-white px-4 py-2 text-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 text-sm transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ Refleksi Pengalaman Manager ============ */

function RefleksiPengalamanManager() {
  const [data, setData] = useState<RefleksiPengalaman | null>(null);
  const [form, setForm] = useState<Partial<RefleksiPengalaman>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from('refleksi_pengalaman')
      .select('*')
      .maybeSingle()
      .then(({ data: result }) => {
        if (result) {
          setData(result as RefleksiPengalaman);
          setForm(result as RefleksiPengalaman);
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (data?.id) {
      const { id, updated_at, ...rest } = form as RefleksiPengalaman;
      void id;
      void updated_at;
      await supabase.from('refleksi_pengalaman').update(rest).eq('id', data.id);
    } else {
      await supabase.from('refleksi_pengalaman').insert(form);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections: { key: keyof RefleksiPengalaman; label: string; rows: number }[] = [
    { key: 'education_view', label: 'A. Pandangan tentang Pendidikan di Indonesia', rows: 8 },
    { key: 'professional_effort', label: 'B. Upaya Menjadi Guru Profesional', rows: 8 },
  ];

  const rtlFields: { key: keyof RefleksiPengalaman; label: string }[] = [
    { key: 'rtl_1_title', label: 'RTL 1 — Judul' },
    { key: 'rtl_1_action', label: 'RTL 1 — Tindakan' },
    { key: 'rtl_1_goal', label: 'RTL 1 — Tujuan' },
    { key: 'rtl_1_indicator', label: 'RTL 1 — Indikator Keberhasilan' },
    { key: 'rtl_1_timeframe', label: 'RTL 1 — Waktu Pelaksanaan' },
    { key: 'rtl_2_title', label: 'RTL 2 — Judul' },
    { key: 'rtl_2_action', label: 'RTL 2 — Tindakan' },
    { key: 'rtl_2_goal', label: 'RTL 2 — Tujuan' },
    { key: 'rtl_2_indicator', label: 'RTL 2 — Indikator Keberhasilan' },
    { key: 'rtl_2_timeframe', label: 'RTL 2 — Waktu Pelaksanaan' },
    { key: 'rtl_3_title', label: 'RTL 3 — Judul' },
    { key: 'rtl_3_action', label: 'RTL 3 — Tindakan' },
    { key: 'rtl_3_goal', label: 'RTL 3 — Tujuan' },
    { key: 'rtl_3_indicator', label: 'RTL 3 — Indikator Keberhasilan' },
    { key: 'rtl_3_timeframe', label: 'RTL 3 — Waktu Pelaksanaan' },
  ];

  return (
    <div className="space-y-6">
      {/* Sections A & B */}
      <div className="border border-gray-200 bg-white p-6">
        <h3 className="font-bold text-gray-900 mb-4">Bagian A & B</h3>
        <div className="space-y-4">
          {sections.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <textarea
                value={(form[f.key] as string) || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                rows={f.rows}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors resize-y"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section C — RTL */}
      <div className="border border-gray-200 bg-white p-6">
        <h3 className="font-bold text-gray-900 mb-4">C. Rencana Tindak Lanjut (RTL)</h3>
        <div className="space-y-4">
          {rtlFields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <textarea
                value={(form[f.key] as string) || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors resize-y"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 bg-ppg-600 hover:bg-ppg-700 text-white px-4 py-2 text-sm transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Menyimpan…' : 'Simpan'}
        </button>
        {saved && <span className="text-sm text-green-600 self-center">Tersimpan</span>}
      </div>
    </div>
  );
}

/* ============ Desain Karya Manager ============ */

function DesainKaryaManager() {
  const [data, setData] = useState<DesainKarya | null>(null);
  const [form, setForm] = useState<Partial<DesainKarya>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from('desain_karya')
      .select('*')
      .maybeSingle()
      .then(({ data: result }) => {
        if (result) {
          setData(result as DesainKarya);
          setForm(result as DesainKarya);
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (data?.id) {
      const { id, updated_at, ...rest } = form as DesainKarya;
      void id;
      void updated_at;
      await supabase.from('desain_karya').update(rest).eq('id', data.id);
    } else {
      await supabase.from('desain_karya').insert(form);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const textAreas: { key: keyof DesainKarya; label: string; rows: number }[] = [
    { key: 'intro', label: 'Pengantar Halaman', rows: 4 },
    { key: 'work_name', label: 'A. Nama Karya Inovatif', rows: 2 },
    { key: 'target_audience', label: 'A. Sasaran Inovasi', rows: 3 },
    { key: 'challenge', label: 'B. Tantangan atau Permasalahan', rows: 4 },
    { key: 'solution_idea', label: 'B. Gagasan Solusi', rows: 4 },
    { key: 'research_result', label: 'B. Hasil Riset Sederhana', rows: 4 },
    { key: 'prototype_desc', label: 'C. Rancangan atau Prototipe', rows: 4 },
    { key: 'how_it_works', label: 'C. Cara Kerja atau Bentuk Karya', rows: 4 },
    { key: 'implementation_plan', label: 'C. Rencana Implementasi di Kelas', rows: 4 },
    { key: 'eval_stages', label: 'D. Tahapan Evaluasi', rows: 4 },
    { key: 'novelty_indicator', label: 'D. Indikator Kebaruan', rows: 3 },
    { key: 'creativity_indicator', label: 'D. Indikator Kreativitas', rows: 3 },
    { key: 'usefulness_indicator', label: 'D. Indikator Kebermanfaatan', rows: 3 },
    { key: 'evidence_method', label: 'D. Cara Mengumpulkan Bukti atau Data Evaluasi', rows: 4 },
  ];

  const linkFields: { urlKey: keyof DesainKarya; labelKey: keyof DesainKarya; num: number }[] = [
    { urlKey: 'link_url_1', labelKey: 'link_label_1', num: 1 },
    { urlKey: 'link_url_2', labelKey: 'link_label_2', num: 2 },
    { urlKey: 'link_url_3', labelKey: 'link_label_3', num: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Content fields */}
      <div className="border border-gray-200 bg-white p-6">
        <h3 className="font-bold text-gray-900 mb-4">Konten Desain Karya Inovatif</h3>
        <div className="space-y-4">
          {textAreas.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <textarea
                value={(form[f.key] as string) || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                rows={f.rows}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors resize-y"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Link fields */}
      <div className="border border-gray-200 bg-white p-6">
        <h3 className="font-bold text-gray-900 mb-1">Tautan Pendukung</h3>
        <p className="text-xs text-gray-400 mb-4">
          Tambahkan tautan prototipe, dokumen rancangan, media, atau karya digital.
        </p>
        <div className="space-y-4">
          {linkFields.map((l) => (
            <div key={l.num} className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tautan {l.num} — URL
                </label>
                <input
                  type="text"
                  value={(form[l.urlKey] as string) || ''}
                  onChange={(e) => setForm({ ...form, [l.urlKey]: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tautan {l.num} — Label
                </label>
                <input
                  type="text"
                  value={(form[l.labelKey] as string) || ''}
                  onChange={(e) => setForm({ ...form, [l.labelKey]: e.target.value })}
                  placeholder="Contoh: Lihat Prototipe"
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 bg-ppg-600 hover:bg-ppg-700 text-white px-4 py-2 text-sm transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Menyimpan…' : 'Simpan'}
        </button>
        {saved && <span className="text-sm text-green-600 self-center">Tersimpan</span>}
      </div>
    </div>
  );
}

/* ============ Dokumentasi Manager ============ */

function DokumentasiManager() {
  const [items, setItems] = useState<Documentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    supabase
      .from('documentation')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data as Documentation[]);
        setLoading(false);
      });
  };

  useEffect(load, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadError(null);
    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    let successCount = 0;
    let lastError: string | null = null;

    for (let i = 0; i < files.length; i++) {
      setUploadProgress({ current: i, total: files.length });
      try {
        const result = await uploadDocPhotoFile(files[i]);
        await supabase.from('documentation').insert({
          image_url: result.publicUrl,
          caption: 'Dokumentasi Semester 2',
          sort_order: items.length + i + 1,
        });
        successCount++;
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Gagal mengunggah foto.';
      }
    }

    setUploadProgress({ current: files.length, total: files.length });
    setUploading(false);
    setUploadProgress(null);

    if (lastError && successCount === 0) {
      setUploadError(lastError);
    } else if (lastError && successCount > 0) {
      setUploadError(`${successCount} foto berhasil diunggah, ${files.length - successCount} gagal.`);
    }

    if (inputRef.current) inputRef.current.value = '';
    load();
  };

  if (loading) return <p className="text-gray-400">Memuat…</p>;

  return (
    <div>
      {/* Upload area */}
      <div className="border border-gray-200 bg-white p-4 mb-6">
        <h3 className="font-bold text-gray-900 text-sm mb-3">Upload Foto Dokumentasi</h3>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {!uploading ? (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 hover:border-ppg-400 hover:bg-ppg-50/30 transition-colors px-4 py-6 text-center"
          >
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600 font-medium">Pilih Foto</span>
            <p className="text-xs text-gray-400 mt-1">
              Bisa memilih beberapa foto sekaligus. Format JPG, JPEG, PNG, WEBP — maksimal 25 MB per foto.
            </p>
          </button>
        ) : (
          <div className="border-2 border-dashed border-ppg-300 bg-ppg-50/30 px-4 py-6 text-center">
            <Loader2 className="w-6 h-6 text-ppg-500 mx-auto mb-2 animate-spin" />
            <span className="text-sm text-gray-600">
              Mengunggah {(uploadProgress?.current ?? 0) + 1} dari {uploadProgress?.total ?? 0}…
            </span>
          </div>
        )}
        {uploadError && (
          <p className="text-xs text-red-600 mt-2">{uploadError}</p>
        )}
      </div>

      {/* Photo grid */}
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Belum ada foto dokumentasi.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((d) => (
            <div key={d.id} className="relative group border border-gray-200 bg-white">
              <img
                src={normalizeImageUrl(d.image_url)}
                alt={d.caption}
                className="w-full aspect-[4/3] object-cover"
              />
              <button
                onClick={async () => {
                  if (confirm('Hapus foto ini?')) {
                    const path = extractStoragePath(d.image_url, 'documentation');
                    if (path) await deleteFile('documentation', path);
                    await supabase.from('documentation').delete().eq('id', d.id);
                    load();
                  }
                }}
                className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ Profil Manager ============ */

function ProfilManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile(data as Profile);
          setForm(data as Profile);
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (profile?.id) {
      const { id, updated_at, ...rest } = form as Profile;
      void updated_at;
      void id;
      await supabase.from('profile').update(rest).eq('id', profile.id);
    } else {
      await supabase.from('profile').insert(form);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields: { key: keyof Profile; label: string }[] = [
    { key: 'name', label: 'Nama' },
    { key: 'program', label: 'Program' },
    { key: 'field', label: 'Bidang' },
    { key: 'semester', label: 'Semester' },
    { key: 'year', label: 'Tahun' },
    { key: 'photo_url', label: 'URL Foto Profil' },
  ];

  const textAreas: { key: keyof Profile; label: string; rows?: number }[] = [
    { key: 'short_bio', label: 'Bio Singkat (halaman Home/Tentang)', rows: 3 },
    { key: 'vision_education', label: 'Visi dalam Pendidikan', rows: 3 },
    { key: 'vision_as_teacher', label: 'Visi sebagai Calon Guru', rows: 3 },
    { key: 'facilitator_paragraph', label: 'Prinsip Penggunaan Teknologi', rows: 6 },
    { key: 'education_principle', label: 'Prinsip Tambahan (opsional)', rows: 4 },
    { key: 'self_development', label: 'Langkah Pengembangan Diri', rows: 4 },
    { key: 'personal_reflection', label: 'Refleksi Pribadi sebagai Calon Guru', rows: 5 },
    { key: 'bio', label: 'Bio Lengkap', rows: 4 },
  ];

  return (
    <div className="border border-gray-200 bg-white p-6">
      <h3 className="font-bold text-gray-900 mb-6">Edit Profil</h3>
      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input
              type="text"
              value={(form[f.key] as string) || ''}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors"
            />
          </div>
        ))}
        {textAreas.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <textarea
              value={(form[f.key] as string) || ''}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              rows={f.rows || 4}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-ppg-500 focus:ring-1 focus:ring-ppg-500 outline-none transition-colors resize-y"
            />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 bg-ppg-600 hover:bg-ppg-700 text-white px-4 py-2 text-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
          {saved && <span className="text-sm text-green-600 self-center">Tersimpan</span>}
        </div>
      </div>
    </div>
  );
}
