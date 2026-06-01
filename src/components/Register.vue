<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="login-header">
        <div class="logo-circle">🩺</div>
        <h2>Daftar Pasien UKS</h2>
        <p>Silakan isi data diri kamu di bawah ini</p>
      </div>

      <form @submit.prevent="handleRegister" class="login-form">
        <div class="input-group">
          <label>Nama Lengkap</label>
          <input type="text" v-model="form.name" placeholder="Nama lengkap..." required />
        </div>

        <div class="input-group">
          <label>NISN / Nomor Induk</label>
          <input type="text" v-model="form.nisn" placeholder="Contoh: 12345" required />
        </div>

        <div class="input-group">
          <label>Kelas</label>
          <input type="text" v-model="form.kelas" placeholder="Contoh: XI TJKT 3" required />
        </div>

        <div class="input-group">
          <label>Buat Password</label>
          <input type="password" v-model="form.password" placeholder="Minimal 8 karakter..." required />
        </div>

        <button type="submit" :disabled="loading" class="btn-login-premium">
          <span v-if="loading">Mendaftar... ⏳</span>
          <span v-else>Daftar Sekarang 🚀</span>
        </button>

        <p class="auth-link">
          Sudah punya akun? <router-link to="/login">Login di sini</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; 

const router = useRouter();
const loading = ref(false);

const form = ref({
  name: '',
  nisn: '',
  kelas: '',
  password: '',
});

const handleRegister = async () => {
  loading.value = true;
  try {
    await axios.post('http://localhost:8000/api/register', {
      name: form.value.name,
      nisn: form.value.nisn,
      kelas: form.value.kelas,
      
      // 💡 OTOMATIS DIKIRIM KE BACKEND TANPA USER TAU:
      role: 'siswa', 
      password: form.value.password,
      password_confirmation: form.value.password 
    });

    alert('Berhasil daftar! Silakan login untuk membuat keluhan. 🎉');
    router.push('/login');

  } catch (error) {
    console.error("Full error:", error);
    
    // 🔥 INI DIA CCTV-NYA: Nangkep error asli dari Laravel 🔥
    if (error.response) {
        alert('Error dari Laravel: ' + JSON.stringify(error.response.data));
    } else {
        alert('Gagal daftar bre! Server mati atau ada error koneksi.');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* CSS MASIH SAMA, GAK ADA YANG BERUBAH BIAR TETEP PREMIUM */
.login-wrapper { display: flex; justify-content: center; align-items: center; min-height: 100vh; width: 100vw; background: #f0fdf4; padding: 40px 0; box-sizing: border-box; }
.login-box { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(5, 150, 105, 0.08); width: 100%; max-width: 420px; box-sizing: border-box; }
.login-header { text-align: center; margin-bottom: 25px; }
.logo-circle { font-size: 28px; background: #059669; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 15px auto; box-shadow: 0 8px 20px rgba(5, 150, 105, 0.2); }
.login-header h2 { margin: 0; color: #0f172a; font-size: 24px; font-weight: 700; }
.login-header p { margin: 8px 0 0 0; color: #64748b; font-size: 14px; }
.login-form { display: flex; flex-direction: column; gap: 16px; }
.input-group { display: flex; flex-direction: column; gap: 6px; text-align: left; }
.input-group label { font-size: 14px; font-weight: 600; color: #334155; }
.input-group input { padding: 12px 16px; border-radius: 12px; border: 1px solid #cbd5e1; font-size: 14px; outline: none; transition: all 0.2s; background: white; }
.input-group input:focus { border-color: #059669; box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.1); }
.btn-login-premium { background: #059669; color: white; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 10px; }
.btn-login-premium:hover { background: #047857; transform: translateY(-2px); }
.btn-login-premium:disabled { background: #94a3b8; cursor: not-allowed; transform: none; }
.auth-link { font-size: 14px; text-align: center; color: #64748b; margin-top: 5px; }
.auth-link a { color: #059669; font-weight: 600; text-decoration: none; }
.auth-link a:hover { text-decoration: underline; }
</style>