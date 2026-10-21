/*
# Create refleksi_pengalaman table

1. New Tables
- `refleksi_pengalaman` — stores the final reflection content about the PPG experience.
  - `id` (uuid, primary key)
  - `education_view` (text) — Section A: Pandangan tentang pendidikan di Indonesia setelah PPG
  - `professional_effort` (text) — Section B: Upaya menjadi guru yang profesional
  - `rtl_1_title` (text) — RTL 1 title
  - `rtl_1_action` (text) — RTL 1 tindakan yang akan dilakukan
  - `rtl_1_goal` (text) — RTL 1 tujuan
  - `rtl_1_indicator` (text) — RTL 1 indikator keberhasilan
  - `rtl_1_timeframe` (text) — RTL 1 waktu pelaksanaan
  - `rtl_2_title` (text) — RTL 2 title
  - `rtl_2_action` (text) — RTL 2 tindakan
  - `rtl_2_goal` (text) — RTL 2 tujuan
  - `rtl_2_indicator` (text) — RTL 2 indikator
  - `rtl_2_timeframe` (text) — RTL 2 waktu
  - `rtl_3_title` (text) — RTL 3 title
  - `rtl_3_action` (text) — RTL 3 tindakan
  - `rtl_3_goal` (text) — RTL 3 tujuan
  - `rtl_3_indicator` (text) — RTL 3 indikator
  - `rtl_3_timeframe` (text) — RTL 3 waktu
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `refleksi_pengalaman`.
- Public read for anon + authenticated (portfolio is public).
- Write restricted to authenticated users (admin via Kelola).

3. Initial Data
- Inserts one default row with the full reflection content as provided by the user.
*/

CREATE TABLE IF NOT EXISTS refleksi_pengalaman (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  education_view text DEFAULT '',
  professional_effort text DEFAULT '',
  rtl_1_title text DEFAULT '',
  rtl_1_action text DEFAULT '',
  rtl_1_goal text DEFAULT '',
  rtl_1_indicator text DEFAULT '',
  rtl_1_timeframe text DEFAULT '',
  rtl_2_title text DEFAULT '',
  rtl_2_action text DEFAULT '',
  rtl_2_goal text DEFAULT '',
  rtl_2_indicator text DEFAULT '',
  rtl_2_timeframe text DEFAULT '',
  rtl_3_title text DEFAULT '',
  rtl_3_action text DEFAULT '',
  rtl_3_goal text DEFAULT '',
  rtl_3_indicator text DEFAULT '',
  rtl_3_timeframe text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE refleksi_pengalaman ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_refleksi_pengalaman" ON refleksi_pengalaman;
CREATE POLICY "read_refleksi_pengalaman"
  ON refleksi_pengalaman FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_refleksi_pengalaman" ON refleksi_pengalaman;
CREATE POLICY "insert_refleksi_pengalaman"
  ON refleksi_pengalaman FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_refleksi_pengalaman" ON refleksi_pengalaman;
CREATE POLICY "update_refleksi_pengalaman"
  ON refleksi_pengalaman FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_refleksi_pengalaman" ON refleksi_pengalaman;
CREATE POLICY "delete_refleksi_pengalaman"
  ON refleksi_pengalaman FOR DELETE
  TO authenticated USING (true);

-- Insert default content if table is empty
INSERT INTO refleksi_pengalaman (
  education_view,
  professional_effort,
  rtl_1_title,
  rtl_1_action,
  rtl_1_goal,
  rtl_1_indicator,
  rtl_1_timeframe,
  rtl_2_title,
  rtl_2_action,
  rtl_2_goal,
  rtl_2_indicator,
  rtl_2_timeframe,
  rtl_3_title,
  rtl_3_action,
  rtl_3_goal,
  rtl_3_indicator,
  rtl_3_timeframe
)
SELECT
  'Selama mengikuti program PPG Prajabatan, pemahaman saya tentang pendidikan di Indonesia telah berkembang dari sekadar penguasaan materi menuju kesadaran bahwa pendidikan harus berpusat pada kebutuhan dan perkembangan peserta didik. Saya menyadari bahwa pembelajaran yang bermakna tidak hanya men-transfer pengetahuan, tetapi juga membantu peserta didik membangun pemahaman yang mendalam, merasa nyaman dan menyenangkan dalam belajar, serta melihat keterkaitan apa yang dipelajari dengan kehidupan nyata.

Setiap peserta didik memiliki karakteristik, kesiapan belajar, minat, dan latar belakang yang berbeda. Memahami keragaman ini menjadi langkah awal yang penting sebelum merancang pembelajaran. Pembelajaran berdiferensiasi dan pembelajaran yang inklusif bukan lagi sekadar konsep, melainkan pendekatan yang perlu saya terapkan agar setiap peserta didik mendapatkan kesempatan yang sama untuk berkembang sesuai kapasitasnya.

Peran guru tidak terbatas pada menyampaikan materi. Guru juga membangun karakter, kemandirian, tanggung jawab, kemampuan bekerja sama, dan kemampuan berpikir kritis peserta didik. Asesmen tidak boleh hanya berorientasi pada nilai akhir, tetapi juga memantau perkembangan proses belajar sehingga saya dapat menyesuaikan strategi mengajar. Teknologi memiliki peran sebagai pendukung pembelajaran, bukan tujuan utama — ia membantu visualisasi, umpan balik, dan motivasi, tetapi tidak menggantikan interaksi sosial dan aktivitas fisik yang penting dalam PJOK.

Yang paling saya pegang adalah pentingnya menciptakan lingkungan belajar yang aman, menghargai perbedaan, dan memberikan kesempatan yang adil bagi setiap peserta didik. Lingkungan seperti itulah yang memungkinkan peserta didik berkembang secara optimal, baik secara akademik maupun personal.',

  'Menjadi guru profesional adalah proses belajar sepanjang hayat yang memerlukan kemauan untuk terus berkembang dan memperbaiki diri. Setelah mengikuti PPG Prajabatan, saya menyadari bahwa profesionalisme guru mencakup beberapa langkah konkret yang akan saya jalankan.

Pertama, saya akan terus meningkatkan kompetensi pedagogik, profesional, sosial, dan kepribadian. Keempat kompetensi ini saling berkaitan dan tidak bisa ditinggalkan. Kedua, saya akan merancang pembelajaran berdasarkan kebutuhan dan karakteristik peserta didik, bukan sekadar mengikuti rutinitas mengajar. Ketiga, saya akan menerapkan pembelajaran mendalam dan pembelajaran berdiferensiasi secara tepat, sehingga setiap peserta didik dapat belajar sesuai cara dan kecepatannya.

Keempat, saya akan melaksanakan asesmen diagnostik, formatif, dan sumatif sesuai kebutuhan pembelajaran. Asesmen diagnostik membantu saya memahami titik awal peserta didik, asesmen formatif memantau perkembangan, dan asesmen sumatif mengukur pencapaian. Kelima, saya akan melakukan refleksi setelah setiap pembelajaran untuk mengetahui apa yang berhasil dan apa yang perlu diperbaiki.

Keenam, saya akan meminta umpan balik dari rekan sejawat, guru senior, dan pihak sekolah. Masukan dari orang lain membantu saya melihat sudut pandang yang mungkin terlewat. Ketujuh, saya akan mengikuti pelatihan, seminar, komunitas belajar, dan kegiatan pengembangan keprofesian berkelanjutan agar pengetahuan dan keterampilan saya tidak usang.

Kedelapan, saya akan memanfaatkan teknologi secara bijak untuk meningkatkan kualitas pembelajaran, tanpa menjadikannya tujuan utama. Kesembilan, saya akan menjaga etika profesi, kedisiplinan, tanggung jawab, komunikasi, dan keteladanan. Kesepuluh, saya akan terus mengembangkan kemampuan menyesuaikan strategi mengajar berdasarkan hasil evaluasi dan perkembangan peserta didik.

Profesionalisme guru bukan gelar yang diperoleh sekali, melainkan komitmen untuk terus belajar dan memperbaiki diri setiap hari.',

  'RTL 1 — Merancang dan Melaksanakan Pembelajaran yang Berpusat pada Peserta Didik',
  'Saya akan memetakan karakteristik, kebutuhan, dan kemampuan awal peserta didik, kemudian merancang pembelajaran yang sesuai dengan kondisi mereka. Saya akan menerapkan pembelajaran mendalam, strategi berdiferensiasi, serta asesmen yang membantu memantau perkembangan belajar.',
  'Menciptakan pembelajaran yang relevan, bermakna, dan sesuai dengan kebutuhan setiap peserta didik sehingga semua dapat berkembang secara optimal.',
  'Peserta didik menunjukkan keterlibatan aktif dalam pembelajaran, hasil asesmen formatif menunjukkan perkembangan, dan peserta didik mampu menerapkan apa yang dipelajari dalam konteks nyata.',
  'Setiap awal semester dan berkelanjutan sepanjang tahun ajaran.',

  'RTL 2 — Melaksanakan Refleksi dan Pengembangan Kompetensi secara Berkelanjutan',
  'Saya akan melakukan refleksi secara rutin setelah pembelajaran, mencatat hal-hal yang berhasil dan yang perlu diperbaiki, serta meminta masukan dari rekan sejawat atau guru senior. Saya juga akan mengikuti komunitas belajar dan pelatihan yang relevan untuk meningkatkan kompetensi sebagai guru profesional.',
  'Membentuk kebiasaan refleksi yang konsisten dan terus meningkatkan kualitas mengajar melalui umpan balik dan pengembangan keprofesian.',
  'Tersedia catatan refleksi setelah setiap pembelajaran, terdapat perbaikan strategi mengajar berdasarkan refleksi tersebut, dan terdapat partisipasi reguler dalam kegiatan pengembangan keprofesian.',
  'Setiap hari setelah pembelajaran, evaluasi mingguan, dan partisipasi dalam komunitas belajar minimal sebulan sekali.',

  'RTL 3 — Membangun Lingkungan Belajar yang Positif dan Mengembangkan Karakter Peserta Didik',
  'Saya akan menciptakan suasana pembelajaran yang aman, inklusif, disiplin, dan menyenangkan. Saya akan membiasakan sikap tanggung jawab, kerja sama, sportivitas, saling menghargai, dan kemandirian. Dalam pembelajaran PJOK, saya akan menghubungkan aktivitas jasmani dengan pembentukan karakter dan penerapan nilai-nilai positif dalam kehidupan sehari-hari.',
  'Membentuk peserta didik yang berkarakter, memiliki rasa tanggung jawab, mampu bekerja sama, dan menerapkan nilai-nilai positif dalam kehidupan sehari-hari.',
  'Peserta didik menunjukkan sikap saling menghargai, aktif bekerja sama dalam kelompok, menjaga disiplin dan kebersihan, serta mampu menerapkan nilai-nilai PJOK dalam aktivitas sehari-hari.',
  'Setiap pembelajaran dan diberkelanjutan sepanjang tahun ajaran.'
WHERE NOT EXISTS (SELECT 1 FROM refleksi_pengalaman);
