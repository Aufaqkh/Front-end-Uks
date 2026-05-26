<template>
  <nav class="main-navbar">
    <router-link to="/" class="nav-link">Dashboard</router-link>
    <router-link to="/pasien" class="nav-link">Data Pasien</router-link> <router-link to="/kunjungan" class="nav-link">Form Kunjungan</router-link>
    <router-link to="/obat" class="nav-link">Stok Obat</router-link>
  </nav>
</template>

<style scoped>
.main-navbar {
  background-color: #ffffff;
  padding: 15px 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20px;
}
.nav-link {
  color: #15803d;
  font-weight: bold;
  text-decoration: none;
  font-size: 16px;
}
.nav-link:hover {
  text-decoration: underline;
}
/* Style otomatis aktif saat menu diklik */
.router-link-active {
  border-bottom: 2px solid #15803d;
}
</style>