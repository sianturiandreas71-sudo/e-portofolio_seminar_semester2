import { useEffect, useState } from 'react';
import { BookOpen, FileText, Camera, TrendingUp, GraduationCap, ChevronDown, Eye, Target, Cpu, TrendingUp as TrendUp, PenLine } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabase';
import { normalizeImageUrl } from '@/lib/imageUrl';
import PPGLogo from '@/components/PPGLogo';

const educationHistory = [
  { name: 'SD Lae Parira', level: 'Sekolah Dasar' },
  { name: 'SMPN Lae Parira', level: 'Sekolah Menengah Pertama' },
  { name: 'SMAN Lae Parira', level: 'Sekolah Menengah Atas' },
  { name: 'S1 PJKR — Universitas Negeri Medan', level: 'Sarjana' },
  { name: 'PPG Prajabatan', level: 'Profesi Guru' },
];

const portfolioContents = [
  {
    icon: BookOpen,
    title: 'Pengalaman Belajar',
    desc: 'Dokumentasi pengalaman selama mengikuti pembelajaran di lima mata kuliah Semester 2.',
  },
  {
    icon: TrendingUp,
    title: 'Refleksi',
    desc: 'Refleksi mendalam atas setiap mata kuliah dan bagaimana pembelajaran berkesan bagi saya.',
  },
  {
    icon: FileText,
    title: 'Artefak Pembelajaran',
    desc: 'Bukti dukung pembelajaran berupa modul ajar, LKPD, PPT, video, hasil asesmen, dan lainnya.',
  },
  {
    icon: Camera,
    title: 'Dokumentasi',
    desc: 'Foto kegiatan sepanjang Semester 2 yang menggambarkan perjalanan belajar.',
  },
];

export default function Tentang() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Page header */}
      <div className="text-center mb-16">
        <p className="text-ppg-600 text-sm tracking-widest uppercase mb-3">Tentang</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Profil Lengkap</h1>
        <div className="w-16 h-0.5 bg-ppg-600 mx-auto" />
      </div>

      {/* Biodata singkat */}
      <section className="mb-16">
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          <div className="shrink-0">
            {profile?.photo_url ? (
              <img
                src={normalizeImageUrl(profile.photo_url)}
                alt={profile.name}
                className="w-40 h-52 object-cover border border-gray-200"
              />
            ) : (
              <div className="w-40 h-52 bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-3">
                <PPGLogo className="w-16 h-16" />
                <p className="text-gray-400 text-xs text-center px-4">Foto profil</p>
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {profile?.name || 'Gomos Andreas Sianturi'}
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <dt className="text-gray-400 sm:w-28 shrink-0">Program</dt>
                <dd className="text-gray-700">{profile?.program || 'PPG Prajabatan'}</dd>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <dt className="text-gray-400 sm:w-28 shrink-0">Bidang</dt>
                <dd className="text-gray-700">
                  {profile?.field || 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)'}
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <dt className="text-gray-400 sm:w-28 shrink-0">Semester</dt>
                <dd className="text-gray-700">{profile?.semester || 'Semester 2'}</dd>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <dt className="text-gray-400 sm:w-28 shrink-0">Tahun</dt>
                <dd className="text-gray-700">{profile?.year || '2026'}</dd>
              </div>
            </dl>
            {profile?.short_bio && (
              <p className="mt-6 text-gray-600 leading-relaxed text-[15px]">{profile.short_bio}</p>
            )}
          </div>
        </div>
      </section>

      {/* Perjalanan pendidikan */}
      <section className="pt-8 border-t border-gray-200 mb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Perjalanan Pendidikan</h2>
        <p className="text-sm text-gray-500 mb-8">Jenjang pendidikan yang telah saya tempuh.</p>

        <div className="relative">
          {educationHistory.map((edu, i) => (
            <div key={i} className="relative flex gap-6 pb-10 last:pb-0">
              {i < educationHistory.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gray-200" />
              )}
              <div className="shrink-0 w-10 h-10 rounded-full bg-ppg-600 text-white flex items-center justify-center z-10">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="pt-1.5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{edu.level}</p>
                <p className="font-bold text-gray-900">{edu.name}</p>
              </div>
              {i < educationHistory.length - 1 && (
                <ChevronDown className="absolute left-3 top-12 w-2.5 h-2.5 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Visi Pendidikan */}
      <section className="pt-8 border-t border-gray-200 mb-16">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">Visi Saya dalam Pendidikan</h2>
        </div>
        <p className="text-gray-700 leading-relaxed italic ml-0 sm:ml-8">
          {profile?.vision_education ||
            'Mewujudkan pendidikan Indonesia yang adaptif terhadap perkembangan teknologi dan berpusat pada peserta didik.'}
        </p>
      </section>

      {/* Visi sebagai Calon Guru */}
      <section className="pt-8 border-t border-gray-200 mb-16">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">Visi Saya sebagai Calon Guru</h2>
        </div>
        <p className="text-gray-700 leading-relaxed italic ml-0 sm:ml-8">
          {profile?.vision_as_teacher ||
            'Menjadi guru yang adaptif, inovatif, dan melek teknologi serta mampu memanfaatkan teknologi untuk mendukung pembelajaran yang berpusat pada peserta didik.'}
        </p>
      </section>

      {/* Prinsip Penggunaan Teknologi */}
      <section className="pt-8 border-t border-gray-200 mb-16">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">Prinsip Penggunaan Teknologi</h2>
        </div>
        <p className="text-gray-700 leading-relaxed ml-0 sm:ml-8">
          {profile?.facilitator_paragraph ||
            'Saya ingin menjadi guru yang tidak hanya menyampaikan materi, tetapi juga menjadi fasilitator yang membantu peserta didik berkembang sesuai kemampuan, kebutuhan, dan potensinya. Dalam konteks PJOK, saya ingin memanfaatkan teknologi untuk membantu peserta didik memahami gerakan, memperoleh umpan balik, melakukan refleksi, dan meningkatkan motivasi. Namun, teknologi tetap menjadi alat bantu dan tidak menggantikan aktivitas fisik, interaksi sosial, kerja sama, serta nilai-nilai karakter dalam PJOK.'}
        </p>
        {profile?.education_principle && (
          <p className="text-gray-700 leading-relaxed ml-0 sm:ml-8 mt-4">
            {profile.education_principle}
          </p>
        )}
      </section>

      {/* Langkah Pengembangan Diri */}
      <section className="pt-8 border-t border-gray-200 mb-16">
        <div className="flex items-center gap-3 mb-4">
          <TrendUp className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">Langkah Pengembangan Diri</h2>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap ml-0 sm:ml-8">
          {profile?.self_development || '[Tuliskan langkah pengembangan diri di sini]'}
        </p>
      </section>

      {/* Refleksi Pribadi sebagai Calon Guru */}
      <section className="pt-8 border-t border-gray-200 mb-16">
        <div className="flex items-center gap-3 mb-4">
          <PenLine className="w-5 h-5 text-ppg-600" />
          <h2 className="text-xl font-bold text-gray-900">Refleksi Pribadi sebagai Calon Guru</h2>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap ml-0 sm:ml-8">
          {profile?.personal_reflection || '[Tuliskan refleksi pribadi sebagai calon guru di sini]'}
        </p>
      </section>

      {/* Tentang E-Portofolio Ini */}
      <section className="pt-8 border-t border-gray-200 mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang E-Portofolio Ini</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Website ini merupakan dokumentasi perjalanan belajar selama Semester 2 PPG Prajabatan
          bidang Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK).
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mb-12">
          Portofolio ini dibuat untuk menunjukkan perkembangan saya sebagai calon guru PJOK,
          bukan sekadar kumpulan tugas. Setiap halaman dalam website ini menggambarkan proses
          belajar, refleksi, dan penerapan pembelajaran dalam praktik.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {portfolioContents.map((item) => (
            <div key={item.title} className="border border-gray-200 bg-white p-6">
              <item.icon className="w-7 h-7 text-ppg-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Alur Portofolio */}
      <section className="pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Alur Portofolio</h2>
        <div className="space-y-3 text-gray-700">
          <p className="flex flex-wrap items-center gap-3">
            <span className="text-ppg-600 font-bold">Beranda</span>
            <span className="text-gray-400">→</span>
            <span>Refleksi</span>
            <span className="text-gray-400">→</span>
            <span>Artefak</span>
            <span className="text-gray-400">→</span>
            <span>Dokumentasi</span>
          </p>
          <p className="text-sm text-gray-500">
            Pada halaman Refleksi: Pengalaman Belajar → Refleksi → Kaitan Praktis → Perubahan
            yang Ingin Saya Lakukan.
          </p>
          <p className="text-sm text-gray-500">
            Pada menu Artefak: Artefak → Bukti Pembelajaran → Analisis Artefak → Makna →
            Kaitan dengan Praktik.
          </p>
        </div>
      </section>
    </div>
  );
}
