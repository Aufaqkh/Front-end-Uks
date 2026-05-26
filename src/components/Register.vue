<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="login-header">
        <div class="logo-circle">➕</div>
        <h2>Daftar Akun Baru</h2>
        <p>Aplikasi Digital UKS</p>
      </div>

      <form @submit.prevent="handleRegister" class="login-form">
        <div class="input-group">
          <label>Nama Lengkap</label>
          <input type="text" v-model="form.name" placeholder="Masukkan nama..." required />
        </div>

        <div class="input-group">
          <label>Email</label>
          <input type="email" v-model="form.email" placeholder="Masukkan email..." required />
        </div>

        <div class="input-group">
          <label>NISN / Nomor Identitas</label>
          <input type="text" v-model="form.nisn" placeholder="Masukkan NISN atau nomor unik..." required />
        </div>

        <div class="input-group">
          <label>Hak Akses (Role)</label>
          <select v-model="form.role" class="select-premium" required>
            <option value="" disabled>--- Pilih Hak Akses ---</option>
            <option value="petugas">Petugas UKS</option>
            <option value="admin">Admin</option>
            <option value="siswa">Pasien / Siswa</option>
          </select>
        </div>

        <div class="input-group" v-if="form.role === 'siswa'">
          <label>Kelas</label>
          <input type="text" v-model="form.kelas" placeholder="Contoh: XI TJKT 3" />
        </div>

        <div class="input-group">
          <label>Password</label>
          <input type="password" v-model="form.password" placeholder="Minimal 8 karakter..." required />
        </div>

        <div class="input-group">
          <label>Konfirmasi Password</label>
          <input type="password" v-model="form.password_confirmation" placeholder="Ulangi password..." required />
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
  email: '',
  nisn: '',
  role: '',
  kelas: '',
  password: '',
  password_confirmation: ''
});

const handleRegister = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    alert('Password dan Konfirmasi Password tidak cocok bray! ❌');
    return;
  }

  loading.value = true;
  try {
   const response = await axios.post('http://localhost:8000/api/register', {
      name: form.value.name,
      email: form.value.email,
      nisn: form.value.nisn || '22222',
      role: form.value.role,
      
      // 💡 PASTIKAN BARIS INI UDAH KAYA GINI, PAKE TANDA STRIP '-'
      kelas: form.value.role === 'siswa' ? form.value.kelas : '-', 
      
      password: form.value.password,
      password_confirmation: form.value.password_confirmation
    });

    alert('Akun berhasil terdaftar secara resmi di sistem Laravel, bray! 🎉');
    if (router) router.push('/login');

  } catch (error) {
    console.error("Gagal daftar:", error);
    const laravelErrors = error.response?.data?.errors;
    if (laravelErrors) {
      alert(Object.values(laravelErrors).flat().join('\n'));
    } else {
      alert(error.response?.data?.message || 'Gagal daftar! Periksa kembali data kamu bray.');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex; justify-content: center; align-items: center;
  min-height: 100vh; width: 100vw; background: #f0fdf4;
  padding: 40px 0; box-sizing: border-box;
}
.login-box {
  background: white; padding: 40px; border-radius: 24px;
  box-shadow: 0 10px 40px rgba(5, 150, 105, 0.08);
  width: 100%; max-width: 450px; box-sizing: border-box;
}
.login-header { text-align: center; margin-bottom: 25px; }
.logo-circle {
  font-size: 28px; background: #059669; color: white;
  width: 60px; height: 60px; border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  margin: 0 auto 15px auto; box-shadow: 0 8px 20px rgba(5, 150, 105, 0.2);
}
.login-header h2 { margin: 0; color: #0f172a; font-size: 24px; font-weight: 700; }
.login-header p { margin: 8px 0 0 0; color: #64748b; font-size: 14px; }
.login-form { display: flex; flex-direction: column; gap: 16px; }
.input-group { display: flex; flex-direction: column; gap: 6px; text-align: left; }
.input-group label { font-size: 14px; font-weight: 600; color: #334155; }
.input-group input, .select-premium {
  padding: 12px 16px; border-radius: 12px; border: 1px solid #cbd5e1;
  font-size: 14px; outline: none; transition: all 0.2s; background: white;
}
.input-group input:focus, .select-premium:focus { border-color: #059669; box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.1); }
.btn-login-premium {
  background: #059669; color: white; border: none; padding: 14px;
  border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer;
  transition: all 0.2s; margin-top: 10px;
}
.btn-login-premium:hover { background: #047857; transform: translateY(-2px); }
.btn-login-premium:disabled { background: #94a3b8; cursor: not-allowed; transform: none; }
.auth-link { font-size: 14px; text-align: center; color: #64748b; margin-top: 5px; }
.auth-link a { color: #059669; font-weight: 600; text-decoration: none; }
.auth-link a:hover { text-decoration: underline; }
</style>