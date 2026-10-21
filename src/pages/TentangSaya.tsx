import { useEffect, useState } from 'react';
import { GraduationCap, ChevronDown } from 'lucide-react';
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

export default function TentangSaya() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <p className="text-ppg-600 text-sm tracking-widest uppercase mb-3">Profil</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tentang Saya</h1>
        <div className="w-16 h-0.5 bg-ppg-600 mx-auto" />
      </div>

      {/* Profile card */}
      <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start mb-16">
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
              <dt className="text-gray-400 sm:w-24 shrink-0">Program</dt>
              <dd className="text-gray-700">{profile?.program || 'PPG Prajabatan'}</dd>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
              <dt className="text-gray-400 sm:w-24 shrink-0">Bidang</dt>
              <dd className="text-gray-700">
                {profile?.field || 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)'}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
              <dt className="text-gray-400 sm:w-24 shrink-0">Semester</dt>
              <dd className="text-gray-700">{profile?.semester || 'Semester 2'}</dd>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
              <dt className="text-gray-400 sm:w-24 shrink-0">Tahun</dt>
              <dd className="text-gray-700">{profile?.year || '2026'}</dd>
            </div>
          </dl>
          {profile?.bio && (
            <p className="mt-6 text-gray-600 leading-relaxed text-[15px]">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Education timeline */}
      <div className="pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Riwayat Pendidikan</h2>
        <p className="text-sm text-gray-500 mb-8">Jenjang pendidikan yang telah saya tempuh.</p>

        <div className="relative">
          {educationHistory.map((edu, i) => (
            <div key={i} className="relative flex gap-6 pb-10 last:pb-0">
              {/* Line */}
              {i < educationHistory.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gray-200" />
              )}

              {/* Dot */}
              <div className="shrink-0 w-10 h-10 rounded-full bg-ppg-600 text-white flex items-center justify-center z-10">
                <GraduationCap className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="pt-1.5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {edu.level}
                </p>
                <p className="font-bold text-gray-900">{edu.name}</p>
              </div>

              {/* Arrow between items */}
              {i < educationHistory.length - 1 && (
                <ChevronDown className="absolute left-3 top-12 w-2.5 h-2.5 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
