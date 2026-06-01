<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="login-header">
        <div class="logo-circle">🩺</div>
        <h2>Login UKS Digital</h2>
        <p>Silakan masuk ke akun kamu bray</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        
        <div class="input-group">
          <label>NISN / Username</label>
          <input type="text" v-model="form.nisn" placeholder="Masukkan NISN atau Username..." required />
        </div>

        <div class="input-group">
          <label>Password</label>
          <input type="password" v-model="form.password" placeholder="Masukkan password..." required />
        </div>

        <button type="submit" :disabled="loading" class="btn-login-premium">
          <span v-if="loading">Memproses... ⏳</span>
          <span v-else>Masuk Sekarang 🚀</span>
        </button>

        <p class="auth-link">
          Belum punya akun? <router-link to="/register">Daftar di sini</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // Ganti api.js kalau lu pake api.js

const router = useRouter();
const loading = ref(false);

const form = ref({
  nisn: '',
  password: ''
  // role: '' udah dihapus dari sini juga
});

const handleLogin = async () => {
  loading.value = true;
  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      nisn: form.value.nisn,
      password: form.value.password
      // role gak dikirim lagi ke Laravel
    });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    alert(`Login Berhasil! Selamat datang ${response.data.user.name} 🚀`);
    router.push('/dashboard');

  } catch (error) {
    console.error(error);
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message);
    } else {
      alert('Gagal login bre! Cek username dan password lu.');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* CSS MASIH TETEP SAMA PREMIUMNYA */
.login-wrapper { display: flex; justify-content: center; align-items: center; min-height: 100vh; width: 100vw; background: #f0fdf4; padding: 40px 0; box-sizing: border-box; }
.login-box { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(5, 150, 105, 0.08); width: 100%; max-width: 420px; box-sizing: border-box; }
.login-header { text-align: center; margin-bottom: 25px; }
.logo-circle { font-size: 28px; background: #059669; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 15px auto; box-shadow: 0 8px 20px rgba(5, 150, 105, 0.2); }
.login-header h2 { margin: 0; color: #0f172a; font-size: 24px; font-weight: 700; }
.login-header p { margin: 8px 0 0 0; color: #64748b; font-size: 14px; }
.login-form { display: flex; flex-direction: column; gap: 16px; }
.input-group { display: flex; flex-direction: column; gap: 6px; text-align: left; }
.input-group label { font-size: 14px; font-weight: 600; color: #334155; }
.input-group input { padding: 12px 16px; border-radius: 12px; border: 1px solid #cbd5e1; font-size: 14px; outline: none; transition: all 0.2s; background: white; font-family: inherit; }
.input-group input:focus { border-color: #059669; box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.1); }
.btn-login-premium { background: #059669; color: white; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 10px; }
.btn-login-premium:hover { background: #047857; transform: translateY(-2px); }
.btn-login-premium:disabled { background: #94a3b8; cursor: not-allowed; transform: none; }
.auth-link { font-size: 14px; text-align: center; color: #64748b; margin-top: 5px; }
.auth-link a { color: #059669; font-weight: 600; text-decoration: none; }
.auth-link a:hover { text-decoration: underline; }
</style>