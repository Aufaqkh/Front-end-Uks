<template>
  <div class="obat-container-premium">
    <div class="obat-header-premium">
      <div class="header-title-zone">
        <h2>Manajemen Stok Obat</h2>
        <p>Pantau ketersediaan dan kategori obat di UKS</p>
      </div>
      <button class="btn-add-premium" @click="showModal = true">
        <span class="btn-icon">💊</span> Tambah Obat Baru
      </button>
    </div>

    <div class="table-card-premium">
      <div class="table-responsive">
        <table class="obat-table-premium">
          <thead>
            <tr>
              <th>Nama Obat</th>
              <th>Stok Tersedia</th>
              <th>Kategori</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" style="text-align: center; padding: 30px; color: #64748b;">
                Memuat data stok obat... ⏳
              </td>
            </tr>
            <tr v-else-if="obatList.length === 0">
              <td colspan="4" style="text-align: center; padding: 30px; color: #64748b;">
                Belum ada data obat di inventaris bray.
              </td>
            </tr>
            <tr v-else v-for="obat in obatList" :key="obat.id">
              <td class="td-nama-obat">
                <div class="avatar-obat-sm" :class="obat.stok <= 10 ? 'status-tipis' : 'status-aman'">
                  {{ obat.stok <= 10 ? '🧪' : '💊' }}
                </div>
                <div>
                  <strong>{{ obat.nama }}</strong>
                  <p class="sub-text">ID Obat: #{{ obat.id }}</p>
                </div>
              </td>
              <td>
                <span class="badge-stok" :class="obat.stok <= 10 ? 'badge-warning' : 'badge-success'">
                  {{ obat.stok }} Pcs
                </span>
              </td>
              <td><span class="badge-kategori">{{ obat.kategori }}</span></td>
              <td>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay-premium">
      <div class="modal-content-premium">
        <div class="modal-header-premium">
          <div class="modal-title-group">
            <h3>Tambah Stok Obat</h3>
            <p>Masukkan data obat baru ke inventaris UKS</p>
          </div>
          <button class="close-x-premium" @click="showModal = false">&times;</button>
        </div>
        
        <form @submit.prevent="saveObat" class="modal-form-premium">
          <div class="form-group-premium">
            <label>Nama Obat</label>
            <input v-model="newObat.nama_obat" type="text" placeholder="Contoh: Amoxicillin 500mg" required>
          </div>
          
          <div class="form-group-premium">
            <label>Jumlah Stok</label>
            <input v-model.number="newObat.stok" type="number" placeholder="Contoh: 50" required>
          </div>

          <div class="form-group-premium">
            <label>Kategori / Kegunaan Obat</label>
            <select v-model="newObat.kategori" class="select-premium">
              <option value="Obat Demam / Pusing">Obat Demam / Pusing</option>
              <option value="Obat Maag / Lambung">Obat Maag / Lambung</option>
              <option value="Obat Luar / Luka">Obat Luar / Luka</option>
              <option value="Suplemen / Vitamin">Suplemen / Vitamin</option>
            </select>
          </div>

          <div class="modal-actions-premium">
            <button type="button" class="btn-cancel-premium" @click="showModal = false">Batal</button>
            <button type="submit" :disabled="submitting" class="btn-save-premium">
              <span v-if="submitting">Menyimpan... ⏳</span>
              <span v-else>Simpan Obat</span>
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
const obatList = ref([]);

const newObat = ref({
  nama_obat: '',
  stok: null,
  kategori: 'Obat Demam / Pusing'
});

const fetchObat = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token'); 
    
    const response = await api.get('/obats', {
      headers: { Authorization: `Bearer ${token}` }
    }); 
    
    if (response.data && response.data.data) {
      obatList.value = response.data.data;
    } else {
      obatList.value = response.data;
    }
  } catch (error) {
    console.error('Gagal mengambil data obat bray:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchObat();
});

const saveObat = async () => {
  submitting.value = true;
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

    await api.post('/obats', {
      nama_obat: newObat.value.nama_obat, 
      stok: newObat.value.stok,
      kategori: newObat.value.kategori
    }, {
      headers: { Authorization: `Bearer ${token}` } 
    });

    alert(`Berhasil menyimpan obat: ${newObat.value.nama_obat} 🎉`);
    
    showModal.value = false;
    newObat.value = { nama_obat: '', stok: null, kategori: 'Obat Demam / Pusing' };
    
    fetchObat(); 

  } catch (error) {
    console.error(error);
    alert('Gagal menyimpan obat! Periksa koneksi backend bre.');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* CSS LAMA MASIH SAMA */
.obat-container-premium { display: flex; flex-direction: column; gap: 25px; }
.obat-header-premium { display: flex; justify-content: space-between; align-items: center; background: white; padding: 24px 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.01); }
.header-title-zone h2 { margin: 0; font-size: 24px; color: #0f172a; font-weight: 700; text-align: left; }
.header-title-zone p { margin: 5px 0 0 0; color: #64748b; font-size: 14px; text-align: left; }

.btn-add-premium { background: #059669; color: white; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2); }
.btn-add-premium:hover { background: #047857; transform: translateY(-2px); }

.table-card-premium { background: white; border-radius: 20px; padding: 15px 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
.table-responsive { overflow-x: auto; }

.obat-table-premium { width: 100%; border-collapse: collapse; text-align: left; }
.obat-table-premium th { padding: 16px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
.obat-table-premium td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; vertical-align: middle; }
.obat-table-premium tr:hover td { background-color: #f8fafc; }

.td-nama-obat { display: flex; align-items: center; gap: 14px; text-align: left; }
.sub-text { margin: 2px 0 0 0; font-size: 12px; color: #94a3b8; }

.avatar-obat-sm { width: 36px; height: 36px; border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 16px; }
.status-aman { background: #e2f5ea; }
.status-tipis { background: #fffbeb; }

.badge-stok { padding: 5px 10px; border-radius: 6px; font-size: 13px; font-weight: 700; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-warning { background: #fef9c3; color: #ca8a04; }
.badge-kategori { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px; }

.action-buttons-premium { display: flex; gap: 8px; }
.btn-action { border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
.btn-edit-premium { background: #eff6ff; color: #2563eb; }
.btn-edit-premium:hover { background: #dbeafe; }
.btn-delete-premium { background: #fff5f5; color: #e11d48; }
.btn-delete-premium:hover { background: #ffe4e6; }

.modal-overlay-premium { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content-premium { background: white; width: 100%; max-width: 500px; padding: 30px; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative; box-sizing: border-box; }
.modal-header-premium { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
.modal-title-group h3 { margin: 0; color: #0f172a; font-size: 20px; font-weight: 700; text-align: left; }
.modal-title-group p { margin: 4px 0 0 0; color: #64748b; font-size: 13px; text-align: left; }
.close-x-premium { background: none; border: none; font-size: 24px; cursor: pointer; color: #94a3b8; }

.modal-form-premium { display: flex; flex-direction: column; gap: 18px; }
.form-group-premium { display: flex; flex-direction: column; gap: 6px; text-align: left; width: 100%; }
.form-group-premium label { font-size: 13px; font-weight: 600; color: #475569; }
.form-group-premium input, .select-premium { padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; width: 100%; box-sizing: border-box; transition: all 0.2s; background: white; }
.form-group-premium input:focus, .select-premium:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15); }

.modal-actions-premium { display: flex; justify-content: flex-end; gap: 12px; margin-top: 15px; }
.btn-cancel-premium { background: #f1f5f9; color: #475569; border: none; padding: 11px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-save-premium { background: #059669; color: white; border: none; padding: 11px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; }
.btn-save-premium:hover { background: #047857; }
.btn-save-premium:disabled { background: #94a3b8; cursor: not-allowed; }
</style>