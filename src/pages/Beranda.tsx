import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, Camera, Wrench, Lightbulb, GraduationCap } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabase';
import { normalizeImageUrl } from '@/lib/imageUrl';
import PPGLogo from '@/components/PPGLogo';

export default function Beranda() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-ppg-600 text-sm tracking-widest uppercase mb-4">
                E-Portofolio PPG Prajabatan
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Perjalanan Belajar dan Refleksi Semester 2
              </h1>
              <p className="text-gray-600 text-lg mb-2">
                Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)
              </p>
              <p className="text-gray-500 text-base mb-8">
                {profile?.name || 'Gomos Andreas Sianturi'}
                {' · '}
                {profile?.program || 'PPG Prajabatan'}
                {' · '}
                {profile?.year || '2026'}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/refleksi"
                  className="inline-flex items-center gap-2 bg-ppg-600 hover:bg-ppg-700 text-white px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Lihat Refleksi
                </Link>
                <Link
                  to="/kaitan-praktis"
                  className="inline-flex items-center gap-2 border border-ppg-600 text-ppg-600 hover:bg-ppg-50 px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  <Wrench className="w-4 h-4" />
                  Kaitan Praktis
                </Link>
                <Link
                  to="/artefak"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Lihat Artefak
                </Link>
              </div>
            </div>

            <div className="relative">
              {profile?.photo_url ? (
                <img
                  src={normalizeImageUrl(profile.photo_url)}
                  alt={profile.name}
                  className="w-full aspect-[4/5] object-cover border border-gray-200"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-4">
                  <PPGLogo className="w-24 h-24" />
                  <p className="text-gray-400 text-sm text-center px-8">
                    Foto profil akan tampil di sini
                  </p>
                </div>
              )}
              <div className="absolute -bottom-4 -left-4 bg-ppg-600 text-white px-4 py-2 text-sm hidden sm:block">
                PJOK · Semester 2 · 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profil Saya */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <p className="text-ppg-600 text-sm tracking-widest uppercase mb-3">Profil</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Profil Saya</h2>
            <div className="w-16 h-0.5 bg-ppg-600 mx-auto" />
          </div>

          <div className="grid md:grid-cols-[280px_1fr] gap-8 sm:gap-12 items-start">
            {/* Photo */}
            <div className="mx-auto md:mx-0">
              {profile?.photo_url ? (
                <img
                  src={normalizeImageUrl(profile.photo_url)}
                  alt={profile.name}
                  className="w-56 sm:w-64 aspect-[4/5] object-cover border border-gray-200"
                />
              ) : (
                <div className="w-56 sm:w-64 aspect-[4/5] bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-3">
                  <PPGLogo className="w-20 h-20" />
                  <p className="text-gray-400 text-xs text-center px-6">
                    Foto profil akan tampil di sini
                  </p>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <dl className="space-y-3 mb-6">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <dt className="text-gray-400 text-sm sm:w-32 shrink-0">Nama</dt>
                  <dd className="text-gray-900 font-medium">
                    {profile?.name || 'Gomos Andreas Sianturi'}
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <dt className="text-gray-400 text-sm sm:w-32 shrink-0">Program</dt>
                  <dd className="text-gray-700">
                    {profile?.program || 'PPG Prajabatan'}
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <dt className="text-gray-400 text-sm sm:w-32 shrink-0">Bidang Studi</dt>
                  <dd className="text-gray-700">
                    {profile?.field || 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)'}
                  </dd>
                </div>
              </dl>

              <div className="space-y-5 mt-8">
                <div>
                  <h3 className="text-sm font-bold text-ppg-600 mb-1.5">
                    Visi Saya dalam Pendidikan
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-[15px] italic">
                    {profile?.vision_education ||
                      'Mewujudkan pendidikan Indonesia yang adaptif terhadap perkembangan teknologi dan berpusat pada peserta didik.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-ppg-600 mb-1.5">
                    Visi Saya sebagai Calon Guru
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-[15px] italic">
                    {profile?.vision_as_teacher ||
                      'Menjadi guru yang adaptif, inovatif, dan melek teknologi serta mampu memanfaatkan teknologi untuk mendukung pembelajaran yang berpusat pada peserta didik.'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-700 leading-relaxed text-[15px]">
                    {profile?.facilitator_paragraph ||
                      'Saya ingin menjadi guru yang tidak hanya menyampaikan materi, tetapi juga menjadi fasilitator yang membantu peserta didik berkembang sesuai kemampuan, kebutuhan, dan potensinya. Dalam konteks PJOK, saya ingin memanfaatkan teknologi untuk membantu peserta didik memahami gerakan, memperoleh umpan balik, melakukan refleksi, dan meningkatkan motivasi. Namun, teknologi tetap menjadi alat bantu dan tidak menggantikan aktivitas fisik, interaksi sosial, kerja sama, serta nilai-nilai karakter dalam PJOK.'}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <Link
                  to="/tentang"
                  className="inline-flex items-center gap-1.5 text-ppg-600 hover:text-ppg-700 text-sm font-medium transition-colors"
                >
                  Lihat Profil Lengkap
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pengantar E-Portofolio + Menu navigasi */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Tentang E-Portofolio Ini
          </h2>
          <div className="w-16 h-0.5 bg-ppg-600 mx-auto" />
        </div>
        <p className="text-gray-700 text-center text-lg leading-relaxed mb-12">
          Website ini merupakan dokumentasi perjalanan belajar selama Semester 2 PPG Prajabatan.
          Portofolio ini berisi refleksi pembelajaran, kaitan praktis, artefak, refleksi pengalaman,
          desain karya inovatif, dan dokumentasi kegiatan sebagai bagian dari perkembangan saya
          sebagai calon guru PJOK.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mt-16">
          <Link
            to="/refleksi"
            className="group border border-gray-200 bg-white p-6 hover:border-ppg-400 transition-colors"
          >
            <BookOpen className="w-8 h-8 text-ppg-600 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Refleksi</h3>
            <p className="text-sm text-gray-500 mb-3">
              Informasi lima mata kuliah dan PDF refleksi yang dibaca langsung di website.
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-ppg-600 group-hover:gap-2 transition-all">
              Baca Refleksi <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/kaitan-praktis"
            className="group border border-gray-200 bg-white p-6 hover:border-ppg-400 transition-colors"
          >
            <Wrench className="w-8 h-8 text-ppg-600 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Kaitan Praktis</h3>
            <p className="text-sm text-gray-500 mb-3">
              Konsep utama yang dipelajari dan perubahan yang ingin dilakukan di masa depan.
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-ppg-600 group-hover:gap-2 transition-all">
              Lihat Kaitan Praktis <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/artefak"
            className="group border border-gray-200 bg-white p-6 hover:border-ppg-400 transition-colors"
          >
            <FileText className="w-8 h-8 text-ppg-600 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Artefak</h3>
            <p className="text-sm text-gray-500 mb-3">
              Bukti hasil belajar beserta analisis setiap artefak.
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-ppg-600 group-hover:gap-2 transition-all">
              Lihat Artefak <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/refleksi-pengalaman"
            className="group border border-gray-200 bg-white p-6 hover:border-ppg-400 transition-colors"
          >
            <GraduationCap className="w-8 h-8 text-ppg-600 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Refleksi Pengalaman</h3>
            <p className="text-sm text-gray-500 mb-3">
              Refleksi akhir pengalaman belajar selama mengikuti PPG dan rencana tindak lanjut.
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-ppg-600 group-hover:gap-2 transition-all">
              Baca Refleksi Pengalaman <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/desain-karya"
            className="group border border-gray-200 bg-white p-6 hover:border-ppg-400 transition-colors"
          >
            <Lightbulb className="w-8 h-8 text-ppg-600 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Desain Karya Inovatif</h3>
            <p className="text-sm text-gray-500 mb-3">
              Penyusunan desain karya inovatif: gagasan, rancangan, implementasi, dan evaluasi.
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-ppg-600 group-hover:gap-2 transition-all">
              Lihat Desain Karya <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/dokumentasi"
            className="group border border-gray-200 bg-white p-6 hover:border-ppg-400 transition-colors"
          >
            <Camera className="w-8 h-8 text-ppg-600 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Dokumentasi</h3>
            <p className="text-sm text-gray-500 mb-3">
              Foto kegiatan sepanjang Semester 2 PPG Prajabatan.
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-ppg-600 group-hover:gap-2 transition-all">
              Lihat Dokumentasi <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
