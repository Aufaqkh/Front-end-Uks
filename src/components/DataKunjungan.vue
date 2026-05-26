<template>
  <div class="kunjungan-container-premium">
    <div class="kunjungan-header-premium">
      <div class="header-title-zone">
        <h2>Riwayat Kunjungan UKS</h2>
        <p>Daftar riwayat keluhan pasien yang sedang atau sudah ditangani</p>
      </div>
      <button class="btn-add-premium" @click="tampilModal = true">
        <span class="btn-icon">➕</span> Tambah Kunjungan
      </button>
    </div>

    <div class="table-card-premium">
      <div class="table-responsive">
        <table class="kunjungan-table-premium">
          <thead>
            <tr>
              <th>Nama Pasien</th>
              <th>Umur</th>
              <th>Keluhan / Alasan</th>
              <th>Status Penanganan</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" style="text-align: center; padding: 30px; color: #64748b;">
                Memuat riwayat kunjungan... ⏳
              </td>
            </tr>
            <tr v-else-if="kunjunganList.length === 0">
              <td colspan="5" style="text-align: center; padding: 30px; color: #64748b;">
                Belum ada riwayat kunjungan bre. UKS masih sepi!
              </td>
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
                <div class="action-buttons-premium">
                  <button class="btn-action btn-detail-premium" title="Detail Lengkap" @click="bukaDetail(kunjungan)">
                    👁️ Detail
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-premium" v-if="kunjunganList.length > 0">
        <button 
          class="btn-page" 
          :disabled="currentPage === 1" 
          @click="fetchKunjungan(currentPage - 1)">
          ⬅️ Sebelumnya
        </button>
        <span class="page-info">Halaman {{ currentPage }} dari {{ lastPage }}</span>
        <button 
          class="btn-page" 
          :disabled="currentPage === lastPage" 
          @click="fetchKunjungan(currentPage + 1)">
          Selanjutnya ➡️
        </button>
      </div>

    </div>

    <div v-if="tampilModal" class="modal-overlay">
      <div class="modal-content-premium">
        <div class="modal-header">
          <h3>Tambah Data Kunjungan</h3>
          <button class="btn-close" @click="tampilModal = false">✖</button>
        </div>
        
        <form @submit.prevent="simpanData">
          <div class="input-group">
            <label>Nama Pasien</label>
            <input v-model="formData.nama_pasien" type="text" placeholder="Masukkan nama pasien..." required />
          </div>

          <div class="input-group">
            <label>Umur (Tahun)</label>
            <input v-model="formData.umur" type="number" placeholder="Contoh: 16" required />
          </div>
          
          <div class="input-group">
            <label>Keluhan / Alasan</label>
            <textarea v-model="formData.keluhan" placeholder="Contoh: Pusing dan mual..." rows="2" required></textarea>
          </div>

          <div class="input-group">
            <label>Status Penanganan</label>
            <select v-model="formData.status" required>
              <option value="menunggu">Menunggu 🟡</option>
              <option value="proses">Dalam Proses 🔵</option>
              <option value="selesai">Selesai Berobat 🟢</option>
            </select>
          </div>

          <div class="input-group">
            <label>Status Penjemputan</label>
            <select v-model="formData.status_jemput" required>
              <option value="datang">Tidak (Kembali ke kelas)</option>
              <option value="jemput">Ya, Dijemput Pulang 🔴</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" @click="tampilModal = false" class="btn-batal">Batal</button>
            <button type="submit" class="btn-simpan">Simpan Data</button>
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
              <strong>{{ selectedKunjungan.status_jemput === 'jemput' ? 'Ya (Dijemput Pulang)' : 'Tidak (Kembali ke kelas)' }}</strong>
            </span>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="tampilModalDetail = false" class="btn-batal">Tutup Detail</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../API/api.js';

const loading = ref(false);
const kunjunganList = ref([]);

// 🔥 STATE BARU BUAT NAMPUNG HALAMAN
const currentPage = ref(1);
const lastPage = ref(1);

const tampilModal = ref(false);
const formData = ref({
  nama_pasien: '',
  umur: '',
  keluhan: '',
  status: 'menunggu', 
  status_jemput: 'datang' 
});

const tampilModalDetail = ref(false);
const selectedKunjungan = ref({});

// 🔥 FUNGSI FETCH SEKARANG NERIMA HALAMAN BERAPA
const fetchKunjungan = async (page = 1) => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    // Minta data ke Laravel khusus buat halaman (page) yang dipilih
    const response = await api.get(`/kunjungan?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Setel data ke tabel
    kunjunganList.value = response.data.data || response.data;
    
    // Update posisi halaman sekarang
    if (response.data.current_page) {
      currentPage.value = response.data.current_page;
      lastPage.value = response.data.last_page;
    }
  } catch (error) {
    console.error('Gagal mengambil data kunjungan bre:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchKunjungan();
});

const simpanData = async () => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    await api.post('/kunjungan', formData.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Mantap bre! Data berhasil disimpan ke database.');
    
    // Habis nambah data, otomatis balikin ke halaman 1
    await fetchKunjungan(1);
    
    formData.value = { nama_pasien: '', umur: '', keluhan: '', status: 'menunggu', status_jemput: 'datang' };
    tampilModal.value = false;
  } catch (error) {
    console.error('Gagal menyimpan data ke backend bray:', error);
    alert('Waduh error bre! Cek console F12 buat liat pesan error-nya.');
  }
};

const bukaDetail = (dataPasien) => {
  selectedKunjungan.value = dataPasien;
  tampilModalDetail.value = true;
};
</script>

<style scoped>
/* CSS LAMA */
.kunjungan-container-premium { display: flex; flex-direction: column; gap: 25px; }
.kunjungan-header-premium {
  display: flex; justify-content: space-between; align-items: center;
  background: white; padding: 24px 30px; border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.01);
}
.header-title-zone h2 { margin: 0; font-size: 24px; color: #0f172a; font-weight: 700; text-align: left; }
.header-title-zone p { margin: 5px 0 0 0; color: #64748b; font-size: 14px; text-align: left; }

.btn-add-premium {
  background: #059669; color: white; border: none; padding: 12px 20px;
  border-radius: 10px; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; gap: 8px; transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);
}
.btn-add-premium:hover { background: #047857; transform: translateY(-2px); }

.table-card-premium { background: white; border-radius: 20px; padding: 15px 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
.table-responsive { overflow-x: auto; }

.kunjungan-table-premium { width: 100%; border-collapse: collapse; text-align: left; }
.kunjungan-table-premium th {
  padding: 16px; border-bottom: 2px solid #f1f5f9; color: #64748b;
  font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;
}
.kunjungan-table-premium td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; vertical-align: middle; }
.kunjungan-table-premium tr:hover td { background-color: #f8fafc; }

.td-nama { display: flex; align-items: center; gap: 12px; }
.avatar-sm {
  width: 32px; height: 32px; background: #e2f5ea;
  display: flex; justify-content: center; align-items: center; border-radius: 50%; font-size: 14px;
}
.td-keluhan { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.badge-status { padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px; text-transform: capitalize; }
.badge-status.menunggu { background: #fef08a; color: #a16207; }
.badge-status.proses { background: #bfdbfe; color: #1d4ed8; }
.badge-status.selesai { background: #bbf7d0; color: #15803d; }

.action-buttons-premium { display: flex; gap: 8px; justify-content: flex-start; }
.btn-action { border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
.btn-detail-premium { background: #f1f5f9; color: #475569; }
.btn-detail-premium:hover { background: #e2e8f0; }

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 9999;
}
.modal-content-premium {
  background: white; width: 100%; max-width: 450px; border-radius: 16px; padding: 25px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: modalMuncul 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalMuncul {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
.modal-header h3 { margin: 0; color: #0f172a; font-size: 18px; }
.btn-close { background: transparent; border: none; font-size: 18px; color: #94a3b8; cursor: pointer; }
.btn-close:hover { color: #ef4444; }

.input-group { display: flex; flex-direction: column; margin-bottom: 15px; }
.input-group label { font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; text-align: left; }
.input-group input, .input-group textarea, .input-group select {
  padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #334155; font-family: inherit;
}
.input-group input:focus, .input-group textarea:focus, .input-group select:focus {
  outline: none; border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 25px; padding-top: 15px; border-top: 1px solid #f1f5f9; }
.btn-batal { background: white; color: #475569; border: 1px solid #cbd5e1; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-batal:hover { background: #f8fafc; }
.btn-simpan { background: #059669; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-simpan:hover { background: #047857; }

.detail-body { display: flex; flex-direction: column; gap: 15px; background: #f8fafc; padding: 20px; border-radius: 10px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.detail-value { font-size: 15px; color: #0f172a; }

/* 🔥 CSS BARU KHUSUS PAGINATION 🔥 */
.pagination-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #f1f5f9;
}
.btn-page {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #475569;
  font-size: 13px;
  transition: all 0.2s;
}
.btn-page:hover:not(:disabled) {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #94a3b8;
}
.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-info {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}
</style>