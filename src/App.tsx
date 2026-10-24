import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import Layout from '@/components/Layout';
import Beranda from '@/pages/Beranda';
import Tentang from '@/pages/Tentang';
import RefleksiList from '@/pages/RefleksiList';
import RefleksiPengalaman from '@/pages/RefleksiPengalaman';
import KaitanPraktis from '@/pages/KaitanPraktis';
import DesainKaryaInovatif from '@/pages/DesainKaryaInovatif';
import Dokumentasi from '@/pages/Dokumentasi';
import Artefak from '@/pages/Artefak';
import Kelola from '@/pages/Kelola';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Beranda />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="/refleksi" element={<RefleksiList />} />
            <Route path="/refleksi-pengalaman" element={<RefleksiPengalaman />} />
            <Route path="/kaitan-praktis" element={<KaitanPraktis />} />
            <Route path="/desain-karya" element={<DesainKaryaInovatif />} />
            <Route path="/dokumentasi" element={<Dokumentasi />} />
            <Route path="/artefak" element={<Artefak />} />
            <Route path="/kelola" element={<Kelola />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
