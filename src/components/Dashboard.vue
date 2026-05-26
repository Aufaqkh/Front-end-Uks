<template>
  <div class="dashboard-wrapper">
    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>

    <div class="dashboard-container">
      <TopBar />

      <div class="stats-grid-premium">
        <div class="card-premium card-teal">
          <div class="card-glass-effect"></div>
          <div class="card-info">
            <p class="card-label">Kunjungan Hari Ini</p>
            <p class="card-number">{{ stats.kunjungan_hari_ini }}</p>
            <div class="mini-graph"><span class="trend-text">Pasien datang</span></div>
          </div>
          <div class="card-icon-box bg-box-teal">📅</div>
        </div>

        <div class="card-premium card-amber">
          <div class="card-glass-effect"></div>
          <div class="card-info">
            <p class="card-label">Pasien Mengantre</p>
            <p class="card-number">{{ stats.pasien_mengantre }}</p>
            <div class="mini-graph"><span class="trend-text">Menunggu/Proses</span></div>
          </div>
          <div class="card-icon-box bg-box-amber">👤</div>
        </div>

        <div class="card-premium card-rose">
          <div class="card-glass-effect"></div>
          <div class="card-info">
            <p class="card-label">Total Stok Obat</p>
            <p class="card-number">{{ stats.stok_obat }}</p>
            <div class="mini-graph"><span class="trend-text">Pcs Tersedia</span></div>
          </div>
          <div class="card-icon-box bg-box-rose">💊</div>
        </div>
      </div>

      <div class="activity-section">
        <div class="section-header">
          <h3>Aktivitas Kunjungan Terbaru</h3>
          <router-link to="/kunjungan" class="btn-view-all">Lihat Semua</router-link>
        </div>
        
        <div class="activity-list" v-if="stats.kunjungan_terbaru.length > 0">
          <div v-for="k in stats.kunjungan_terbaru" :key="k.id" class="activity-item status-menunggu-bg">
            <div class="activity-status status-menunggu">🩺</div>
            <div class="activity-details">
              <h4>{{ k.nama_pasien }}</h4>
              <p>Keluhan: {{ k.keluhan }}</p>
            </div>
            <span class="activity-time">{{ k.status }}</span>
          </div>
        </div>
        <p v-else style="color: #64748b; text-align: center;">Belum ada kunjungan terbaru bre.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../API/api.js'; // Sesuaikan path ini jika perlu
import TopBar from './Layout/TopBar.vue';

const stats = ref({
  kunjungan_hari_ini: 0,
  pasien_mengantre: 0,
  stok_obat: 0,
  kunjungan_terbaru: []
});

const fetchDashboard = async () => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const response = await api.get('/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    stats.value = response.data;
  } catch (error) {
    console.error('Gagal ngambil data dashboard:', error);
  }
};

onMounted(() => {
  fetchDashboard();
});
</script>

<style scoped>
/* CSS LAMA MASIH SAMA, GAK USAH DIUBAH BRE */
.dashboard-wrapper { position: relative; width: 100%; min-height: 100%; }
.bg-glow { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.15; z-index: 1; pointer-events: none; }
.glow-1 { top: -10%; right: 10%; width: 400px; height: 400px; background: #34d399; }
.glow-2 { bottom: 10%; left: -5%; width: 350px; height: 350px; background: #fbbf24; }
.dashboard-container { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 30px; }
.stats-grid-premium { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.card-premium { border-radius: 24px; padding: 26px; color: white; position: relative; overflow: hidden; display: flex; justify-content: space-between; align-items: flex-start; transition: all 0.3s ease; }
.card-premium:hover { transform: translateY(-8px); }
.card-glass-effect { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%); transform: rotate(25deg); pointer-events: none; }
.card-teal { background: linear-gradient(135deg, #0f5147 0%, #1a8a7a 100%); box-shadow: 0 15px 30px rgba(20, 110, 98, 0.25); }
.card-amber { background: linear-gradient(135deg, #c2882a 0%, #e0ab4f 100%); box-shadow: 0 15px 30px rgba(224, 171, 79, 0.25); }
.card-rose { background: linear-gradient(135deg, #b8374d 0%, #e05c73 100%); box-shadow: 0 15px 30px rgba(224, 92, 115, 0.25); }
.card-info { display: flex; flex-direction: column; text-align: left; flex: 1; }
.card-label { margin: 0; font-size: 14px; font-weight: 500; opacity: 0.9; }
.card-number { margin: 10px 0 2px 0; font-size: 34px; font-weight: 700; }
.mini-graph { display: flex; align-items: center; gap: 15px; margin-top: 5px; }
.trend-text { font-size: 12px; opacity: 0.75; white-space: nowrap; }
.card-icon-box { width: 44px; height: 44px; border-radius: 14px; display: flex; justify-content: center; align-items: center; font-size: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
.bg-box-teal { background: #136f62; }
.bg-box-amber { background: #b07d25; }
.bg-box-rose { background: #a32d41; }
.activity-section { background: white; border-radius: 20px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-header h3 { margin: 0; color: #0f172a; font-size: 18px; font-weight: 700; }
.btn-view-all { color: #059669; text-decoration: none; font-size: 14px; font-weight: 600; }
.activity-list { display: flex; flex-direction: column; gap: 16px; }
.activity-item { display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 12px; }
.status-menunggu-bg { background: #f8fafc; }
.activity-status { width: 40px; height: 40px; border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 18px; }
.status-menunggu { background: #e2e8f0; }
.activity-details { flex: 1; text-align: left; }
.activity-details h4 { margin: 0; font-size: 15px; color: #1e293b; font-weight: 700; }
.activity-details p { margin: 4px 0 0 0; font-size: 13px; color: #64748b; }
.activity-time { font-size: 12px; color: #94a3b8; }
</style>