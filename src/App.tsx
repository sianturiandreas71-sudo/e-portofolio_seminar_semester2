import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import Layout from '@/components/Layout';
import Beranda from '@/pages/Beranda';
import RefleksiList from '@/pages/RefleksiList';
import KaitanPraktis from '@/pages/KaitanPraktis';
import Artefak from '@/pages/Artefak';
import RefleksiPengalaman from '@/pages/RefleksiPengalaman';
import DesainKaryaInovatif from '@/pages/DesainKaryaInovatif';
import Dokumentasi from '@/pages/Dokumentasi';
import Tentang from '@/pages/Tentang';
import TentangSaya from '@/pages/TentangSaya';
import Login from '@/pages/Login';
import Kelola from '@/pages/Kelola';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Beranda />} />
            <Route path="/refleksi" element={<RefleksiList />} />
            <Route path="/kaitan-praktis" element={<KaitanPraktis />} />
            <Route path="/artefak" element={<Artefak />} />
            <Route path="/refleksi-pengalaman" element={<RefleksiPengalaman />} />
            <Route path="/desain-karya" element={<DesainKaryaInovatif />} />
            <Route path="/dokumentasi" element={<Dokumentasi />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="/tentang-saya" element={<TentangSaya />} />
            <Route path="/login" element={<Login />} />
            <Route path="/kelola" element={<Kelola />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
