// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DashboardUKS from '../components/Dashboard.vue'
import ManajemenObat from '../components/Obat/ManajemenObat.vue'
import ManajemenPasien from '../components/Pasien/ManajemenPasien.vue'
import Login from '../components/Login.vue' 
import Register from '../components/Register.vue'
import DataKunjungan from '../components/DataKunjungan.vue'

const routes = [
  {
    path: '/login', 
    name: 'Login',
    component: Login
  },
  {
    path: '/register', // <-- 2. KITA SELIPIN RUTE JALAN REGISTER DI SINI BRAY!
    name: 'Register',
    component: Register
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardUKS
  },
  {
    path: '/obat',
    name: 'Obat',
    component: ManajemenObat
  },
  {
    path: '/pasien',
    name: 'Pasien',
    component: ManajemenPasien
  },
  {
  path: '/riwayat-kunjungan',
  name: 'RiwayatKunjungan',
  component: DataKunjungan
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 3. SATPAM GERBANG YANG SUDAH DIMODIFIKASI (Biar gak nendang orang mau daftar)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); 
  
  // Kalau BELUM login, tapi mau akses halaman selain Login dan Register, baru kita tendang!
  if (to.name !== 'Login' && to.name !== 'Register' && !token) {
    next({ name: 'Login' }); 
  } 
  // Kalau SUDAH login, tapi iseng mau balik ke halaman Login atau Register, balikin ke Dashboard
  else if ((to.name === 'Login' || to.name === 'Register') && token) {
    next({ name: 'Dashboard' }); 
  } 
  // Selain kondisi di atas, loloskan bray! (Termasuk orang mau ke halaman Register)
  else {
    next();
  }
});

export default router