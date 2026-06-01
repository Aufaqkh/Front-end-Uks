<template>
  <div class="pasien-container-premium">
    
    <div class="pasien-header-premium">
      <div class="header-title-zone">
        <h2>Database Pasien UKS</h2>
        <p>Manajemen data master siswa dan guru yang terdaftar</p>
      </div>
      <button v-if="userRole !== 'siswa'" class="btn-add-premium" @click="showModal = true">
        <span class="btn-icon">➕</span> Tambah Pasien Baru
      </button>
    </div>

    <div class="table-card-premium">
      <div class="table-responsive">
        <table class="pasien-table-premium">
          <thead>
            <tr>
              <th>NISN</th>
              <th>Nama Lengkap</th>
              <th>Kelas & Jurusan</th>
              <th>No. HP Orang Tua</th>
            </tr>
          </thead>
          <tbody>
            
            <tr v-if="userRole === 'siswa'">
              <td colspan="4" class="locked-data-cell">
                <div class="lock-icon">🔒</div>
                <h3>Data Diproteksi</h3>
                <p>Data rekam medis disembunyikan untuk menjaga privasi pasien bre. Hanya petugas UKS yang memiliki wewenang untuk melihatnya.</p>
              </td>
            </tr>

            <template v-else>
              <tr v-if="loading">
                <td colspan="5" style="text-align: center; padding: 30px; color: #64748b;">
                  Memuat data pasien... ⏳
                </td>
              </tr>
              <tr v-else-if="pasienList.length === 0">
                <td colspan="5" style="text-align: center; padding: 30px; color: #64748b;">
                  Belum ada data pasien terdaftar bray.
                </td>
              </tr>
              <tr v-else v-for="pasien in pasienList" :key="pasien.id">
                <td class="td-nisn">{{ pasien.nisn }}</td>
                <td class="td-nama">
                  <div class="avatar-sm">
                    {{ pasien.nama_lengkap ? pasien.nama_lengkap.substring(0, 2).toUpperCase() : 'PS' }}
                  </div>
                  <strong>{{ pasien.nama_lengkap }}</strong>
                </td>
                <td>
                  <span class="badge-kelas">
                    {{ pasien.kelas }}
                  </span>
                </td>
                <td class="td-hp">{{ pasien.no_hp || '-' }}</td>
                <td>
                </td>
              </tr>
            </template>

          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal && userRole !== 'siswa'" class="modal-overlay-premium">
      <div class="modal-content-premium">
        <div class="modal-header-premium">
          <div class="modal-title-group">
            <h3>Registrasi Pasien Baru</h3>
            <p>Masukkan data valid siswa/guru ke sistem</p>
          </div>
          <button class="close-x-premium" @click="showModal = false">&times;</button>
        </div>
        
        <form @submit.prevent="savePasien" class="modal-form-premium">
          <div class="form-group-premium">
            <label>Nama Lengkap</label>
            <input v-model="newPasien.nama_lengkap" type="text" placeholder="Masukkan nama lengkap siswa" required>
          </div>

          <div class="form-group-premium">
            <label>NISN</label>
            <input v-model="newPasien.nisn" type="text" placeholder="Contoh: 0061234567" required>
          </div>
          
          <div class="form-row-premium">
            <div class="form-group-premium">
              <label>Kelas</label>
              <input v-model="newPasien.kelas" type="text" placeholder="Contoh: XI TJKT 3" required>
            </div>
          </div>

          <div class="form-group-premium">
            <label>No. HP Orang Tua / Kontak Darurat</label>
            <input v-model="newPasien.no_hp" type="text" placeholder="Contoh: 0812345678" required>
          </div>

          <div class="modal-actions-premium">
            <button type="button" class="btn-cancel-premium" @click="showModal = false">Batal</button>
            <button type="submit" :disabled="submitting" class="btn-save-premium">
              <span v-if="submitting">Menyimpan... ⏳</span>
              <span v-else>Simpan Pasien</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../API/api.js'; 

const showModal = ref(false);
const loading = ref(false);
const submitting = ref(false);
const pasienList = ref([]); 
const userRole = ref('');

const newPasien = ref({
  nama_lengkap: '',
  nisn: '',
  kelas: '',
  no_hp: ''
});

const fetchPasien = async () => {
  // Kalau Siswa, gausah narik data biar gak kena error 403
  if (userRole.value === 'siswa') return;

  loading.value = true;
  try {
    const response = await api.get('/pasien');
    pasienList.value = response.data.data || response.data;
  } catch (error) {
    console.error('Gagal mengambil data pasien bray:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    userRole.value = user.role;
  }
  fetchPasien();
});

const savePasien = async () => {
  submitting.value = true;
  try {
    await api.post('/pasien', {
      nama_lengkap: newPasien.value.nama_lengkap,
      nisn: newPasien.value.nisn,
      kelas: newPasien.value.kelas,
      no_hp: newPasien.value.no_hp
    });

    alert(`Berhasil menambah pasien: ${newPasien.value.nama_lengkap} 🎉`);
    showModal.value = false;
    newPasien.value = { nama_lengkap: '', nisn: '', kelas: '', no_hp: '' };
    fetchPasien(); 

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Gagal menyimpan! Periksa kembali apakah NISN sudah terdaftar bray.');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.pasien-container-premium { display: flex; flex-direction: column; gap: 25px; }

.pasien-header-premium { display: flex; justify-content: space-between; align-items: center; background: white; padding: 24px 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.01); }
.header-title-zone h2 { margin: 0; font-size: 24px; color: #0f172a; font-weight: 700; text-align: left; }
.header-title-zone p { margin: 5px 0 0 0; color: #64748b; font-size: 14px; text-align: left; }

.btn-add-premium { background: #059669; color: white; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2); }
.btn-add-premium:hover { background: #047857; transform: translateY(-2px); }

.table-card-premium { background: white; border-radius: 20px; padding: 15px 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
.table-responsive { overflow-x: auto; }

.pasien-table-premium { width: 100%; border-collapse: collapse; text-align: left; }
.pasien-table-premium th { padding: 16px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
.pasien-table-premium td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; vertical-align: middle; }
.pasien-table-premium tr:hover td { background-color: #f8fafc; }

.td-nisn { font-family: monospace; font-size: 15px !important; color: #64748b !important; }
.td-nama { display: flex; align-items: center; gap: 12px; }
.avatar-sm { width: 32px; height: 32px; background: #e2f5ea; color: #059669; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 12px; font-weight: bold; }
.badge-kelas { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px; }

.action-buttons-premium { display: flex; gap: 8px; justify-content: flex-start; }
.btn-action { border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
.btn-edit-premium { background: #eff6ff; color: #2563eb; }
.btn-edit-premium:hover { background: #dbeafe; }
.btn-delete-premium { background: #fff5f5; color: #e11d48; }
.btn-delete-premium:hover { background: #ffe4e6; }

/* 🔥 GAYA BARU BUAT DATA YANG DIGEMBOK (KHUSUS SISWA) 🔥 */
.locked-data-cell { text-align: center; padding: 60px 20px !important; color: #64748b; background: #f8fafc !important; }
.lock-icon { font-size: 45px; margin-bottom: 15px; opacity: 0.8; }
.locked-data-cell h3 { margin: 0 0 8px 0; color: #334155; font-size: 18px; }
.locked-data-cell p { margin: 0 auto; max-width: 400px; font-size: 14px; line-height: 1.6; }

.modal-overlay-premium { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content-premium { background: white; width: 100%; max-width: 500px; padding: 30px; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); position: relative; box-sizing: border-box; }
.modal-header-premium { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
.modal-title-group h3 { margin: 0; color: #0f172a; font-size: 20px; font-weight: 700; text-align: left; }
.modal-title-group p { margin: 4px 0 0 0; color: #64748b; font-size: 13px; text-align: left; }
.close-x-premium { background: none; border: none; font-size: 24px; cursor: pointer; color: #94a3b8; }

.modal-form-premium { display: flex; flex-direction: column; gap: 18px; }
.form-group-premium { display: flex; flex-direction: column; gap: 6px; text-align: left; width: 100%; }
.form-group-premium label { font-size: 13px; font-weight: 600; color: #475569; }
.form-group-premium input { padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; width: 100%; box-sizing: border-box; transition: all 0.2s; }
.form-group-premium input:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15); }
.form-row-premium { display: grid; grid-template-columns: 1fr; gap: 15px; width: 100%; box-sizing: border-box; }

.modal-actions-premium { display: flex; justify-content: flex-end; gap: 12px; margin-top: 15px; }
.btn-cancel-premium { background: #f1f5f9; color: #475569; border: none; padding: 11px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-cancel-premium:hover { background: #e2e8f0; }
.btn-save-premium { background: #059669; color: white; border: none; padding: 11px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; }
.btn-save-premium:hover { background: #047857; }
.btn-save-premium:disabled { background: #94a3b8; cursor: not-allowed; }
</style>