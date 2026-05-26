<template>
  <div class="kunjungan-container-premium">
    <div class="kunjungan-header-premium">
      <div class="header-title-zone">
        <h2>Pencatatan Kunjungan UKS</h2>
        <p>Catat data keluhan siswa, tindakan, serta penggunaan obat baru</p>
      </div>
    </div>

    <div class="form-card-premium">
      <form @submit.prevent="submitKunjungan" class="modal-form-premium">
        
        <div class="form-group-premium">
          <label>Nama Pasien / Siswa</label>
          <input v-model="form.nama_pasien" type="text" required placeholder="Masukkan nama lengkap siswa">
        </div>

        <div class="form-group-premium">
          <label>Umur (Tahun)</label>
          <input v-model.number="form.umur" type="number" required placeholder="Contoh: 16">
        </div>

        <div class="form-group-premium">
          <label>Keluhan / Alasan Ke UKS</label>
          <textarea v-model="form.keluhan" rows="4" required placeholder="Jelaskan detail keluhan (misal: Pusing, mual, lemas...)"></textarea>
        </div>

        <div class="form-group-premium">
          <label>Kebutuhan Obat (Opsional)</label>
          <input v-model="form.butuh_obat" type="text" placeholder="Contoh: Paracetamol 500mg (1 tablet)">
        </div>

        <div class="form-row-premium">
          <div class="form-group-premium">
            <label>Status Penjemputan Ortu</label>
            <select v-model="form.status_jemput" class="select-premium">
              <option value="datang">Datang / Dijemput</option>
              <option value="jemput">Perlu Dijemput</option>
            </select>
          </div>

          <div class="form-group-premium">
            <label>Status Penanganan</label>
            <select v-model="form.status" class="select-premium">
              <option value="menunggu">Menunggu</option>
              <option value="proses">Proses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        <div class="modal-actions-premium">
          <button type="button" class="btn-cancel-premium">Batal</button>
          <button type="submit" class="btn-save-premium">✨ Simpan Data Kunjungan</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../API/api.js';

const form = ref({
  nama_pasien: '',
  umur: null,
  keluhan: '',
  butuh_obat: '',
  status_jemput: 'datang',
  status: 'menunggu'
});

const submitKunjungan = async () => {
  try {
    // 1. Ambil token dari memori browser bray
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

    // 2. Langsung lempar seluruh isi form (jangan dipotong!) dan selipin tokennya
    const response = await api.post('/kunjungan', form.value, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    
    alert('Data kunjungan berhasil disimpan ke database bray! 🎉');
    
    // Reset isi form balik ke kosongan
    form.value = { 
      nama_pasien: '', 
      umur: null, 
      keluhan: '', 
      butuh_obat: '', 
      status_jemput: 'datang', 
      status: 'menunggu' 
    };

  } catch (error) {
    console.error("Error kirim data:", error);
    
    // Alert super pinter buat ngebongkar rahasia eror Laravel
    if (error.response?.status === 401) {
      alert('Sesi login kamu habis bray! Silakan Logout dulu terus Login ulang akun petugasmu ya. 🔒');
    } else if (error.response?.data?.errors) {
      const laravelErrors = error.response.data.errors;
      alert(Object.values(laravelErrors).flat().join('\n'));
    } else {
      alert(error.response?.data?.message || 'Gagal menyimpan data kunjungan bray!');
    }
  }
};
</script>

<style scoped>
.kunjungan-container-premium {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Header Style */
.kunjungan-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 24px 30px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.01);
}
.header-title-zone h2 { margin: 0; font-size: 24px; color: #0f172a; font-weight: 700; text-align: left; }
.header-title-zone p { margin: 5px 0 0 0; color: #64748b; font-size: 14px; text-align: left; }

/* Wrapper Kotak Form Utama */
.form-card-premium {
  background: white;
  max-width: 650px;
  width: 100%;
  margin: 10px auto 40px auto;
  padding: 35px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
}

/* Form Layouting */
.modal-form-premium {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group-premium {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
  width: 100%;
}

.form-group-premium label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

/* Style Untuk Form Input, Textarea, & Select Dropdown */
.form-group-premium input, 
.form-group-premium textarea, 
.select-premium {
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;
  font-size: 14px;
  background-color: #ffffff;
  color: #334155;
  font-family: inherit;
}

/* Efek Glow Hijau saat Inputan di-Klik bray */
.form-group-premium input:focus, 
.form-group-premium textarea:focus, 
.select-premium:focus {
  border-color: #059669;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15);
}

.form-row-premium {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 500px) {
  .form-row-premium {
    grid-template-columns: 1fr;
  }
}

/* Bagian Tombol */
.modal-actions-premium {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 15px;
}

.btn-cancel-premium {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;
}
.btn-cancel-premium:hover {
  background: #e2e8f0;
}

.btn-save-premium {
  background: #059669;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);
  transition: all 0.2s;
}
.btn-save-premium:hover {
  background: #047857;
  transform: translateY(-1px);
}
</style>