<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="login-header">
        <div class="logo-circle">➕</div>
        <h2>UKS Digital</h2>
        <p>Silakan masuk untuk mengelola data kesehatan siswa</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label>Email Petugas</label>
          <input 
            type="email" 
            v-model="email" 
            placeholder="Masukkan email anda..." 
            required
          />
        </div>

        <div class="input-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="Masukkan password anda..." 
            required
          />
        </div>

        <button type="submit" :disabled="loading" class="btn-login-premium">
          <span v-if="loading">Memproses... ⏳</span>
          <span v-else>Masuk Aplikasi 🔒</span>
        </button>

        <p class="auth-link">
          Belum punya akun petugas? 
          <router-link to="/register">Daftar di sini</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../API/api.js'; // <-- DI SINI KONEKSI KE AXIOS-NYA BRAY!

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);

// 1. PASTIKAN KAMU IMPORT AXIOS POLOSAN DI ATAS PUCUK SCRIPT YA BRAY:
import axios from 'axios';

const handleLogin = async () => {
  loading.value = true;
  try {
    // KITA PAKAI AXIOS POLOSAN BRAY, BIAR GAK DICEGAT INTERCEPTOR TOKEN!
    const response = await axios.post('http://localhost:8000/api/login', {
      email: email.value,
      password: password.value,
    });

    // Kalau Laravel bilang akunnya ada dan cocok:
    if (response.data.status === 'success' || response.data.token) {
      
      // Ambil token dan data usernya bray
      const token = response.data.token;
      const userData = response.data.user || response.data.data;

      // Simpan di koper browser (localStorage) agar dibaca FormKunjungan & api.js
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      alert('Login Berhasil! Halo bray 👋');

      // Langsung lempar petugas ke halaman Dashboard utama!
      router.push('/');
    }
  } catch (error) {
    console.error("Eror pas login bray:", error);
    alert(error.response?.data?.message || 'Email atau password salah bray!');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Style premium warna hijau murni UKS bray */
.login-wrapper {
  display: flex; justify-content: center; align-items: center;
  min-height: 100vh; width: 100vw; background: #f0fdf4;
  position: fixed; top: 0; left: 0; z-index: 999999;
}
.login-box {
  background: white; padding: 40px; border-radius: 24px;
  box-shadow: 0 10px 40px rgba(5, 150, 105, 0.08);
  width: 100%; max-width: 420px; box-sizing: border-box;
}
.login-header { text-align: center; margin-bottom: 30px; }
.logo-circle {
  font-size: 28px; background: #059669; color: white;
  width: 60px; height: 60px; border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  margin: 0 auto 15px auto; box-shadow: 0 8px 20px rgba(5, 150, 105, 0.2);
}
.login-header h2 { margin: 0; color: #0f172a; font-size: 24px; font-weight: 700; }
.login-header p { margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.5; }
.login-form { display: flex; flex-direction: column; gap: 20px; }
.input-group { display: flex; flex-direction: column; gap: 8px; text-align: left; }
.input-group label { font-size: 14px; font-weight: 600; color: #334155; }
.input-group input {
  padding: 14px 18px; border-radius: 12px; border: 1px solid #cbd5e1;
  font-size: 14px; outline: none; transition: all 0.2s;
}
.input-group input:focus { border-color: #059669; box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.1); }
.btn-login-premium {
  background: #059669; color: white; border: none; padding: 14px;
  border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer;
  transition: all 0.2s; margin-top: 10px;
}
.btn-login-premium:hover { background: #047857; transform: translateY(-2px); }
.btn-login-premium:disabled { background: #94a3b8; cursor: not-allowed; transform: none; }

/* 2. CSS TAMBAHAN BUAT TEKS LINK REGISTER NYA BRAY */
.auth-link { font-size: 14px; text-align: center; color: #64748b; margin-top: 10px; }
.auth-link a { color: #059669; font-weight: 600; text-decoration: none; }
.auth-link a:hover { text-decoration: underline; }
</style>