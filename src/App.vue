<template>
  <div class="app-container">
    <aside v-if="!isAuthPage" class="sidebar-wrapper">
      <div class="brand">
        <span class="icon">➕</span> UKS Digital
      </div>
      <nav class="menu-list">
        <router-link to="/" class="menu-item">Dashboard</router-link>
        <router-link to="/pasien" class="menu-item">Data Pasien</router-link>
        
        <router-link to="/riwayat-kunjungan" class="menu-item">Data Kunjungan</router-link>
        
        <router-link to="/obat" class="menu-item">Stok Obat</router-link>
      </nav>
    </aside>

    <main class="main-content" :class="{ 'full-width': isAuthPage }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Logika mendeteksi: Apakah sekarang lagi di halaman login atau register?
const isAuthPage = computed(() => {
  return route.name === 'Login' || route.name === 'Register' || route.path === '/login' || route.path === '/register';
});
</script>

<style>
/* Reset dasar bray */
body, html { margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, sans-serif; background: #f8fafc; }

.app-container { display: flex; min-height: 100vh; }

/* Styling Sidebar kamu bray */
.sidebar-wrapper {
  width: 260px; background: #064e3b; color: white;
  display: flex; flex-direction: column; padding: 25px 15px; box-sizing: border-box;
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
.user-info p { margin: 0; }
.user-info .name { font-size: 14px; font-weight: 600; }
.user-info .role { font-size: 12px; color: #a7f3d0; }

/* Konten utama bray */
.main-content { flex: 1; padding: 30px; box-sizing: border-box; }
/* Kalau di halaman login/regis, buat dia penuh 100% tanpa ketahan sidebar bray */
.main-content.full-width { padding: 0; width: 100vw; height: 100vh; }
</style>