<template>
  <div class="text-center mt-4">
    <h1>::: ini landing :::</h1>
    <router-link :to="{ name: 'posts' }" class="btn btn-primary mt-3">
      Buat Todo
    </router-link>
  </div>
  <div class="container mt-5">
    <h1 class="text-center">Todo</h1>
    <table class="table table-bordered">
      <thead class="bg-dark text-white">
        <tr>
          <th scope="col">nama</th>
        </tr>
      </thead>
      <tbody class="table table-bordered table-striped w-auto mx-auto">
        <tr v-for="(item) in todo" :key="item.id">
          <td class="border px-4 py-2 capitalize">{{ item.judul }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup >

import { ref, onMounted } from 'vue'
import API from '../API/api.js'

const todo = ref([])

onMounted(async () => {
    try {
        const response = await API.get('todo')
        todo.value = response.data.data

    } catch (error) {
        console.error('Gagal mengambil data todo:', error)
    }
})
</script>

<style lang="css" scoped>

</style>