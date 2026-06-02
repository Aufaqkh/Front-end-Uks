<template>
  <div class="kunjungan-container-premium">
    <div class="kunjungan-header-premium">
      <div class="header-title-zone">
        <h2>Riwayat Kunjungan UKS</h2>
        <p v-if="userRole !== 'siswa'">Daftar riwayat keluhan pasien yang sedang atau sudah ditangani</p>
        <p v-else>Layanan pelaporan kesehatan siswa UKS Digital</p>
      </div>
      
      <button class="btn-add-premium" @click="tampilModal = true">
        <span class="btn-icon">➕</span> Tambah Kunjungan
      </button>
    </div>

    <div v-if="userRole !== 'siswa'" class="table-card-premium">
      <div class="table-responsive">
        <table class="kunjungan-table-premium">
          <thead>
            <tr>
              <th>Nama Pasien</th>
              <th>Umur</th>
              <th>Keluhan & Lokasi</th>
              <th>Status Penanganan</th>
              <th>Info Penjemputan</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" style="text-align: center; padding: 30px; color: #64748b;">Memuat riwayat kunjungan... ⏳</td>
            </tr>
            <tr v-else-if="kunjunganList.length === 0">
              <td colspan="6" style="text-align: center; padding: 30px; color: #64748b;">Belum ada riwayat kunjungan bre. UKS masih sepi!</td>
            </tr>
            <tr v-else v-for="kunjungan in kunjunganList" :key="kunjungan.id">
              <td class="td-nama">
                <div class="avatar-sm">🩺</div>
                <strong>{{ kunjungan.nama_pasien }}</strong>
              </td>
              <td>{{ kunjungan.umur }} Tahun</td>
              <td class="td-keluhan" :title="kunjungan.keluhan">{{ kunjungan.keluhan }}</td>
              <td>
                <span class="badge-status" :class="kunjungan.status || 'menunggu'">
                  {{ kunjungan.status || 'menunggu' }}
                </span>
              </td>
              <td>
                <span class="badge-jemput" :class="kunjungan.status_jemput">
                  {{ kunjungan.status_jemput === 'jemput' ? 'Butuh Dijemput 🚨' : (kunjungan.status_jemput === 'disetujui' ? 'Petugas OTW 🟢' : 'Jalan Sendiri') }}
                </span>
              </td>
              <td>
                <div class="action-buttons-premium">
                  <button class="btn-action btn-detail-premium" title="Detail Lengkap" @click="bukaDetail(kunjungan)">👁️ Detail</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-premium" v-if="kunjunganList.length > 0">
        <button class="btn-page" :disabled="currentPage === 1" @click="fetchKunjungan(currentPage - 1)">⬅️ Sebelumnya</button>
        <span class="page-info">Halaman {{ currentPage }} dari {{ lastPage }}</span>
        <button class="btn-page" :disabled="currentPage === lastPage" @click="fetchKunjungan(currentPage + 1)">Selanjutnya ➡️</button>
      </div>
    </div>

    <div v-else class="student-view-card">
      <template v-if="!kunjunganAktif">
        <div class="student-icon">🚑</div>
        <h3>Butuh Bantuan Medis?</h3>
        <p>Jika kamu merasa kurang enak badan atau butuh obat, silakan laporkan keluhanmu dengan menekan tombol <strong>+ Tambah Kunjungan</strong> di atas ya!</p>
      </template>

      <template v-else-if="kunjunganAktif.status_jemput === 'jemput'">
        <div class="student-icon pulse-kuning">🚨</div>
        <h3 style="color: #b91c1c;">Laporan Jemputan Terkirim!</h3>
        <p>Laporanmu sudah masuk ke sistem UKS. <strong>Tetap di posisimu sekarang bray!</strong> Petugas medis sedang memeriksa laporanmu.</p>
        <div class="lokasi-badge-info">📍 Posisi Kamu: <strong>{{ kunjunganAktif.lokasi_jemput || 'Tidak diisi' }}</strong></div>
      </template>

      <template v-else-if="kunjunganAktif.status_jemput === 'disetujui'">
        <div class="student-icon pulse-hijau">🚑💨</div>
        <h3 style="color: #059669;">Petugas Sedang OTW Menjemput!</h3>
        <p><b>Kabar baik bre!</b> Petugas UKS sudah mengonfirmasi laporanmu dan saat ini sedang meluncur ke lokasimu. Siap-siap ya!</p>
        <div class="lokasi-badge-info sukses">📍 Petugas OTW ke: <strong>{{ kunjunganAktif.lokasi_jemput }}</strong></div>
      </template>

      <template v-else-if="kunjunganAktif.status_jemput === 'datang'">
        <div class="student-icon">🚶</div>
        <h3 style="color: #0f172a;">Laporan Diterima</h3>
        <p>Laporan keluhanmu sudah masuk. Silakan langsung jalan ke ruang UKS ya bre, petugas sudah siap melayani.</p>
      </template>
    </div>

    <div v-if="tampilModal" class="modal-overlay">
      <div class="modal-content-premium">
        <div class="modal-header">
          <h3>Tambah Data Kunjungan</h3>
          <button class="btn-close" @click="tampilModal = false">✖</button>
        </div>
        
        <form @submit.prevent="simpanData">
          <div class="input-group">
            <label>Nama Lengkap</label>
            <input v-model="formData.nama_pasien" type="text" placeholder="Masukkan namamu..." required />
          </div>
          <div class="input-group">
            <label>Umur (Tahun)</label>
            <input v-model="formData.umur" type="number" placeholder="Contoh: 16" required />
          </div>
          <div class="input-group">
            <label>Keluhan </label>
            <textarea v-model="formData.keluhan" placeholder="Contoh: Pusing berat..." rows="2" required></textarea>
          </div>
          <div class="input-group" v-if="userRole !== 'siswa'">
            <label>Status Penanganan</label>
            <select v-model="formData.status" required>
              <option value="menunggu">Menunggu 🟡</option>
              <option value="proses">Dalam Proses 🔵</option>
              <option value="selesai">Selesai Berobat 🟢</option>
            </select>
          </div>
          <div class="input-group">
            <label>Butuh Dijemput ke UKS?</label>
            <select v-model="formData.status_jemput" required>
              <option value="datang">Tidak, saya bisa jalan sendiri ke UKS 🚶</option>
              <option value="jemput">Ya, tolong jemput saya ke lokasi 🚑</option>
            </select>
          </div>
          
          <div class="input-group" v-if="formData.status_jemput === 'jemput'">
            <label>Posisi / Lokasi Jemput</label>
            <input v-model="formData.lokasi_jemput" type="text" placeholder="Contoh: Kelas XI RPL 2, Lapangan..." required />
          </div>

          <div class="modal-actions">
            <button type="button" @click="tampilModal = false" class="btn-batal">Batal</button>
            <button type="submit" class="btn-simpan">Kirim Laporan</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="tampilModalDetail" class="modal-overlay">
      <div class="modal-content-premium">
        <div class="modal-header">
          <h3>Detail Pasien UKS</h3>
          <button class="btn-close" @click="tampilModalDetail = false">✖</button>
        </div>
        
        <div class="detail-body">
          <div class="detail-item">
            <span class="detail-label">Nama Pasien:</span>
            <span class="detail-value"><strong>{{ selectedKunjungan.nama_pasien }}</strong></span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Umur:</span>
            <span class="detail-value">{{ selectedKunjungan.umur }} Tahun</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Keluhan:</span>
            <span class="detail-value">{{ selectedKunjungan.keluhan }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status Penanganan:</span>
            <span class="detail-value">
              <span class="badge-status" :class="selectedKunjungan.status || 'menunggu'">
                {{ selectedKunjungan.status || 'menunggu' }}
              </span>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status Penjemputan:</span>
            <span class="detail-value">
              <span class="badge-jemput" :class="selectedKunjungan.status_jemput">
                {{ selectedKunjungan.status_jemput === 'jemput' ? '🚨 Siswa minta dijemput' : (selectedKunjungan.status_jemput === 'disetujui' ? '✅ Petugas sedang OTW menjemput' : '🚶 Datang sendiri ke UKS') }}
              </span>
            </span>
          </div>
          <div class="detail-item" v-if="selectedKunjungan.status_jemput !== 'datang'">
            <span class="detail-label">Lokasi Jemput:</span>
            <span class="detail-value">📍 <strong>{{ selectedKunjungan.lokasi_jemput || 'Tidak menyertakan lokasi' }}</strong></span>
          </div>
        </div>

        <div v-if="userRole !== 'siswa' && selectedKunjungan.status_jemput === 'jemput'" class="admin-action-section">
          <hr class="divider" />
          <p class="update-title">Aksi Penjemputan:</p>
          <button @click="accPenjemputan(selectedKunjungan)" class="btn-acc-action">
            🚑 Konfirmasi & Jemput Siswa Sekarang
          </button>
        </div>

        <div v-if="userRole !== 'siswa'" class="admin-action-section">
          <hr class="divider" />
          <p class="update-title">Update Status Penanganan:</p>
          <div class="status-buttons">
            <button @click="ubahStatus(selectedKunjungan.id, 'menunggu')" class="btn-status" :class="{ 'active-menunggu': selectedKunjungan.status === 'menunggu' }">Menunggu 🟡</button>
            <button @click="ubahStatus(selectedKunjungan.id, 'proses')" class="btn-status" :class="{ 'active-proses': selectedKunjungan.status === 'proses' }">Proses 🔵</button>
            <button @click="ubahStatus(selectedKunjungan.id, 'selesai')" class="btn-status" :class="{ 'active-selesai': selectedKunjungan.status === 'selesai' }">Selesai 🟢</button>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="tampilModalDetail = false" class="btn-batal">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'; // 🔥 Import onUnmounted
import api from '../API/api.js';

const loading = ref(false);
const kunjunganList = ref([]);
const userRole = ref('');
const currentPage = ref(1);
const lastPage = ref(1);

const tampilModal = ref(false);
const formData = ref({ nama_pasien: '', umur: '', keluhan: '', status: 'menunggu', status_jemput: 'datang', lokasi_jemput: '' });
const tampilModalDetail = ref(false);
const selectedKunjungan = ref({});

// 🔥 TRACKING STATUS KHUSUS SISWA & TIMER RADAR 🔥
const kunjunganAktif = ref(null);
let radarTimer = null;

const fetchKunjungan = async (page = 1) => {
  // 🔥 HAPUS LIMITASI SISWA: if (userRole.value === 'siswa') return;
  loading.value = true;
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const response = await api.get(`/kunjungan?page=${page}`, { headers: { Authorization: `Bearer ${token}` } });
    
    kunjunganList.value = response.data.data || response.data;
    if (response.data.current_page) {
      currentPage.value = response.data.current_page;
      lastPage.value = response.data.last_page;
    }

    // 🔥 LOGIKA MESIN RADAR & NOTIF ALERT UNTUK SISWA 🔥
    if (userRole.value === 'siswa' && kunjunganList.value.length > 0) {
      const dataTerbaru = kunjunganList.value[0]; // Ambil laporan paling baru dibikin siswa
      
      if (dataTerbaru.status !== 'selesai') {
        // Cek kalo pas timer muter, statusnya berubah dari 'jemput' ke 'disetujui'
        if (kunjunganAktif.value && kunjunganAktif.value.status_jemput === 'jemput' && dataTerbaru.status_jemput === 'disetujui') {
          alert('🚑 NOTIFIKASI UKS DIGITAL:\n\nTahan bre! Petugas UKS sudah mengonfirmasi laporanmu dan sekarang sedang OTW meluncur menjemputmu! 💨');
        }
        kunjunganAktif.value = dataTerbaru; // Update kartu tampilan
      } else {
        kunjunganAktif.value = null; // Kalo status udah 'selesai', balikin ke tampilan awal
      }
    }
  } catch (error) { console.error('Gagal:', error); } finally { loading.value = false; }
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) { userRole.value = user.role; }
  fetchKunjungan();

  // 🔥 NYALAIN RADAR TIAP 10 DETIK (KHUSUS SISWA) 🔥
  if (userRole.value === 'siswa') {
    radarTimer = setInterval(() => {
      fetchKunjungan();
    }, 10000); 
  }
});

// 🔥 BERSIHIN TIMER PAS PINDAH MENU BIAR GAK BERAT 🔥
onUnmounted(() => {
  if (radarTimer) clearInterval(radarTimer);
});

const simpanData = async () => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    await api.post('/kunjungan', formData.value, { headers: { Authorization: `Bearer ${token}` } });
    alert('Mantap bre! Laporan terkirim.');
    
    await fetchKunjungan(1); // Langsung refresh data biar UI update
    
    formData.value = { nama_pasien: '', umur: '', keluhan: '', status: 'menunggu', status_jemput: 'datang', lokasi_jemput: '' };
    tampilModal.value = false;
  } catch (error) { console.error('Gagal:', error); alert('Cek koneksi.'); }
};

const bukaDetail = (dataPasien) => { selectedKunjungan.value = dataPasien; tampilModalDetail.value = true; };

const ubahStatus = async (id, statusBaru) => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    await api.post(`/kunjungan/${id}/status`, { status: statusBaru }, { headers: { Authorization: `Bearer ${token}` } });
    alert(`Status berhasil diubah jadi ${statusBaru} bre! 🚀`);
    tampilModalDetail.value = false;
    fetchKunjungan(currentPage.value);
  } catch (error) { console.error(error); alert('Gagal ngubah status.'); }
};

const accPenjemputan = async (kunjungan) => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    await api.post(`/kunjungan/${kunjungan.id}/status`, { 
      status_jemput: 'disetujui' 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Siappp! Petugas UKS segera OTW meluncur ke lokasi siswa! 🚑💨');
    tampilModalDetail.value = false;
    fetchKunjungan(currentPage.value);
  } catch (error) {
    console.error('Gagal ACC penjemputan:', error);
    alert('Terciduk! Error POST ke status. Buka F12!');
  }
};
</script>

<style scoped>
.kunjungan-container-premium { display: flex; flex-direction: column; gap: 25px; }
.kunjungan-header-premium { display: flex; justify-content: space-between; align-items: center; background: white; padding: 24px 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.01); }
.header-title-zone h2 { margin: 0; font-size: 24px; color: #0f172a; font-weight: 700; text-align: left; }
.header-title-zone p { margin: 5px 0 0 0; color: #64748b; font-size: 14px; text-align: left; }
.btn-add-premium { background: #059669; color: white; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2); }
.btn-add-premium:hover { background: #047857; transform: translateY(-2px); }
.table-card-premium { background: white; border-radius: 20px; padding: 15px 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
.table-responsive { overflow-x: auto; }
.kunjungan-table-premium { width: 100%; border-collapse: collapse; text-align: left; }
.kunjungan-table-premium th { padding: 16px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
.kunjungan-table-premium td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; vertical-align: middle; }
.kunjungan-table-premium tr:hover td { background-color: #f8fafc; }
.td-nama { display: flex; align-items: center; gap: 12px; }
.avatar-sm { width: 32px; height: 32px; background: #e2f5ea; display: flex; justify-content: center; align-items: center; border-radius: 50%; font-size: 14px; }
.td-keluhan { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.badge-status { padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px; text-transform: capitalize; }
.badge-status.menunggu { background: #fef08a; color: #a16207; }
.badge-status.proses { background: #bfdbfe; color: #1d4ed8; }
.badge-status.selesai { background: #bbf7d0; color: #15803d; }
.badge-jemput { padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge-jemput.jemput { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
.badge-jemput.disetujui { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
.badge-jemput.datang { color: #64748b; background: #f1f5f9; }
.action-buttons-premium { display: flex; gap: 8px; justify-content: flex-start; }
.btn-action { border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
.btn-detail-premium { background: #f1f5f9; color: #475569; }
.btn-detail-premium:hover { background: #e2e8f0; }

.student-view-card { background: white; border-radius: 20px; padding: 50px 30px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.02); display: flex; flex-direction: column; align-items: center; gap: 15px; }
.student-icon { font-size: 60px; background: #e2f5ea; width: 100px; height: 100px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 10px; }
.student-view-card h3 { margin: 0; color: #0f172a; font-size: 24px; }
.student-view-card p { margin: 0; color: #64748b; max-width: 400px; line-height: 1.6; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 9999; }
.modal-content-premium { background: white; width: 100%; max-width: 450px; border-radius: 16px; padding: 25px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); animation: modalMuncul 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes modalMuncul { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
.modal-header h3 { margin: 0; color: #0f172a; font-size: 18px; }
.btn-close { background: transparent; border: none; font-size: 18px; color: #94a3b8; cursor: pointer; }
.btn-close:hover { color: #ef4444; }
.input-group { display: flex; flex-direction: column; margin-bottom: 15px; }
.input-group label { font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; text-align: left; }
.input-group input, .input-group textarea, .input-group select { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #334155; font-family: inherit; }
.input-group input:focus, .input-group textarea:focus, .input-group select:focus { outline: none; border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1); }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 25px; padding-top: 15px; border-top: 1px solid #f1f5f9; }
.btn-batal { background: white; color: #475569; border: 1px solid #cbd5e1; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-batal:hover { background: #f8fafc; }
.btn-simpan { background: #059669; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-simpan:hover { background: #047857; }

.detail-body { display: flex; flex-direction: column; gap: 15px; background: #f8fafc; padding: 20px; border-radius: 10px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.detail-value { font-size: 15px; color: #0f172a; }
.pagination-premium { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #f1f5f9; }
.btn-page { background: white; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; color: #475569; font-size: 13px; transition: all 0.2s; }
.btn-page:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; border-color: #94a3b8; }
.btn-page:disabled { opacity: 0.5; cursor: not-allowed; }
.page-info { font-size: 13px; color: #64748b; font-weight: 600; }

.admin-action-section { margin-top: 15px; }
.divider { border: 0; height: 1px; background: #cbd5e1; margin: 15px 0; }
.update-title { font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 10px; text-align: left;}
.status-buttons { display: flex; gap: 8px; }
.btn-status { flex: 1; padding: 8px 0; border-radius: 8px; border: 1px solid #cbd5e1; background: white; color: #64748b; font-weight: 600; font-size: 12px; cursor: pointer; transition: all 0.2s; }
.btn-status:hover { background: #f1f5f9; }
.btn-status.active-menunggu { background: #fef08a; color: #a16207; border-color: #fde047; }
.btn-status.active-proses { background: #bfdbfe; color: #1d4ed8; border-color: #93c5fd; }
.btn-status.active-selesai { background: #bbf7d0; color: #15803d; border-color: #86efac; }

.btn-acc-action { width: 100%; padding: 12px 0; border: none; border-radius: 8px; background: #dc2626; color: white; font-weight: bold; font-size: 14px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(220, 38, 38, 0.2); }
.btn-acc-action:hover { background: #b91c1c; transform: translateY(-1px); }

/* 🔥 TAMBAHAN CSS ANIMASI RADAR SISWA 🔥 */
.lokasi-badge-info { background: #fee2e2; color: #b91c1c; padding: 10px 15px; border-radius: 8px; font-weight: 600; margin-top: 10px; display: inline-block; font-size: 14px;}
.lokasi-badge-info.sukses { background: #dcfce7; color: #15803d; }

.pulse-kuning { animation: pulseKuningAnim 1.5s infinite; background: #fef08a !important; border-radius: 50%; width: 90px; height: 90px; display: flex; justify-content: center; align-items: center;}
@keyframes pulseKuningAnim {
  0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.5); }
  70% { box-shadow: 0 0 0 15px rgba(234, 179, 8, 0); }
  100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
}

.pulse-hijau { animation: pulseHijauAnim 1.5s infinite; background: #bbf7d0 !important; border-radius: 50%; width: 90px; height: 90px; display: flex; justify-content: center; align-items: center;}
@keyframes pulseHijauAnim {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
  70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
}
</style>