<template>
  <header class="dash-header-premium">
    <div class="header-text-zone">
      <h1>Halo, {{ userData.name }}! 👋</h1>
      <p>Sistem Pemantauan Kesehatan Siswa UKS Digital</p>
    </div>
    
    <div class="header-profile-zone">
      <div class="notification-bell" @click="toggleNotification">
        <span class="bell-icon">🔔</span>
        <span class="bell-badge">2</span>

        <div v-if="showNotification" class="bell-dropdown" @click.stop>
          <div class="dropdown-header">
            <h4>Pemberitahuan</h4>
          </div>
          <div class="dropdown-body">
            <div class="dropdown-item unread">
              <span class="dot"></span>
              <p>Pasien baru <strong>Budi Santoso</strong> sedang menunggu penanganan.</p>
              <span class="time">2 mnt lalu</span>
            </div>
            <div class="dropdown-item">
              <p>Stok obat <strong>Antasid Doen</strong> tersisa kurang dari 10 Pcs!</p>
              <span class="time">1 jam lalu</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="profile-divider"></div>

      <div class="profile-card-top">
        <div class="avatar-circle-premium">
          <span>{{ userData.name ? userData.name.charAt(0).toUpperCase() : 'P' }}</span>
        </div>
        <div class="profile-info-text">
          <h4>{{ userData.name }}</h4>
          <p>{{ userData.role || 'Petugas UKS' }}</p>
        </div>
      </div>

      <button @click="handleLogout" class="btn-logout-minimal" title="Keluar Aplikasi">🔒 Logout</button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import api from '../../API/api.js';

const router = useRouter();
const showNotification = ref(false);
const userData = ref({ name: 'User', role: 'Petugas UKS' });

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    userData.value = user;
  }
});

const toggleNotification = () => {
  showNotification.value = !showNotification.value;
};

const handleLogout = async () => {
  try {
    await api.post('/logout'); 
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Berhasil keluar aplikasi bray! Sampai jumpa 👋');
    router.push('/login');
  }
};
</script>

<style scoped>
/* CSS tetap sama kayak sebelumnya biar tampilan premium lu nggak berubah */
.dash-header-premium { display: flex; justify-content: space-between; align-items: center; background: white; padding: 18px 30px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); width: 100%; box-sizing: border-box; position: relative; z-index: 99999 !important; }
.header-text-zone h1 { margin: 0; font-size: 24px; color: #0f172a; font-weight: 700; text-align: left; }
.header-text-zone p { margin: 4px 0 0 0; color: #64748b; font-size: 14px; text-align: left; }
.header-profile-zone { display: flex; align-items: center; gap: 18px; position: relative; z-index: 99999 !important; }
.notification-bell { position: relative; cursor: pointer; font-size: 20px; padding: 5px; transition: transform 0.2s; z-index: 99999 !important; }
.notification-bell:hover { transform: scale(1.1); }
.bell-badge { position: absolute; top: 0; right: 0; background: #ef4444; color: white; font-size: 10px; font-weight: bold; padding: 2px 5px; border-radius: 50%; z-index: 2; }
.bell-dropdown { position: absolute; top: 45px; right: -50px; background: white; width: 300px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25); border: 1px solid #f1f5f9; cursor: default; font-size: 14px; z-index: 100000 !important; }
.dropdown-header { padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
.dropdown-header h4 { margin: 0; color: #0f172a; font-weight: 700; text-align: left; font-size: 15px; }
.dropdown-body { display: flex; flex-direction: column; max-height: 250px; overflow-y: auto; }
.dropdown-item { padding: 14px 18px; border-bottom: 1px solid #f8fafc; display: flex; flex-direction: column; gap: 4px; text-align: left; position: relative; }
.dropdown-item:hover { background-color: #f8fafc; }
.dropdown-item p { margin: 0; color: #475569; font-size: 13px; line-height: 1.4; text-align: left; }
.dropdown-item .time { font-size: 11px; color: #94a3b8; text-align: left; }
.dropdown-item.unread { background-color: #f0fdf4; }
.dropdown-item.unread p { color: #0f172a; }
.dropdown-item.unread .dot { position: absolute; top: 18px; right: 14px; width: 6px; height: 6px; background-color: #22c55e; border-radius: 50%; }
.profile-divider { width: 1px; height: 28px; background-color: #e2e8f0; }
.profile-card-top { display: flex; align-items: center; gap: 12px; }
.avatar-circle-premium { width: 42px; height: 42px; background: #059669; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 16px; box-shadow: 0 4px 10px rgba(5, 150, 105, 0.25); }
.profile-info-text { text-align: left; }
.profile-info-text h4 { margin: 0; font-size: 14px; color: #1e293b; font-weight: 600; }
.profile-info-text p { margin: 2px 0 0 0; font-size: 12px; color: #94a3b8; font-weight: 500; }
.btn-logout-minimal { background: #fff5f5; color: #e11d48; border: none; padding: 8px 14px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; }
.btn-logout-minimal:hover { background: #ffe4e6; }
</style>