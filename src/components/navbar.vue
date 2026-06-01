<template>
  <aside class="sidebar-premium">
    <div class="brand">
      <span class="icon">➕</span> UKS Digital
    </div>
    
    <nav class="menu-list">
      <router-link to="/dashboard" class="menu-item">Dashboard</router-link>
      <router-link to="/riwayat-kunjungan" class="menu-item">Data Kunjungan</router-link>
      
      <router-link v-if="userRole === 'admin' || userRole === 'petugas'" to="/pasien" class="menu-item">Data Pasien</router-link>
      <router-link v-if="userRole === 'admin' || userRole === 'petugas'" to="/obat" class="menu-item">Stok Obat</router-link>
    </nav>

    <div class="user-profile">
      <div class="avatar">{{ userName.charAt(0).toUpperCase() }}</div>
      <div class="user-info">
        <p class="name">{{ userName }}</p>
        <p class="role">{{ formatRole(userRole) }}</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const userRole = ref('');
const userName = ref('User');

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    userRole.value = user.role;
    userName.value = user.name;
  }
});

const formatRole = (role) => role ? role.charAt(0).toUpperCase() + role.slice(1) : '';
</script>

<style scoped>
.sidebar-premium {
  width: 260px;
  min-width: 260px;
  background: #064e3b;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 25px 20px;
  height: 100vh;
  box-sizing: border-box;
}
.brand { font-size: 20px; font-weight: 700; margin-bottom: 40px; display: flex; align-items: center; gap: 10px; }
.menu-list { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.menu-item {
  color: #a7f3d0; text-decoration: none; padding: 12px 15px; border-radius: 10px;
  font-weight: 500; transition: all 0.2s;
}
.menu-item:hover, .router-link-active { background: #047857; color: white; }
.user-profile { display: flex; align-items: center; gap: 12px; border-top: 1px solid #047857; padding-top: 20px; }
.avatar { width: 40px; height: 40px; background: #10b981; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: 700; }
.user-info .name { font-size: 14px; font-weight: 600; margin: 0; }
.user-info .role { font-size: 12px; color: #a7f3d0; margin: 0; }
</style>