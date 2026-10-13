<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans flex flex-col justify-between">
    <!-- Header / Navbar -->
    <header class="h-16 px-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-30">
      <button 
        @click="isDrawerOpen = true" 
        class="text-2xl text-gray-800 hover:text-black cursor-pointer p-1"
        aria-label="Open menu"
      >
        <i class="bi bi-list"></i>
      </button>

      <router-link to="/" class="text-xl font-serif tracking-widest uppercase">
        LUMIÈRE GOWN
      </router-link>

      <div class="flex items-center space-x-4 text-xl">
        <router-link to="/account" class="text-gray-800 hover:text-amber-600 transition-colors">
          <i class="bi bi-person"></i>
        </router-link>
        <router-link to="/cart" class="text-gray-800 hover:text-amber-600 transition-colors">
          <i class="bi bi-bag"></i>
        </router-link>
      </div>
    </header>

    <!-- Subnav Categories -->
    <nav class="flex justify-center space-x-6 py-3 border-b border-gray-100 text-xs tracking-widest font-medium uppercase text-gray-600">
      <router-link 
        v-for="cat in categories" 
        :key="cat" 
        :to="`/${cat.toLowerCase()}`" 
        class="hover:text-black transition-colors"
        :class="{ 'text-black font-semibold': cat === 'NEW' }"
      >
        {{ cat }}
      </router-link>
    </nav>

    <!-- Hero Banner Section -->
    <section class="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
      <img 
        src="/images/newpage.jpg" 
        alt="New Collection" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center p-6 space-y-4">
        <h1 class="text-3xl md:text-5xl font-serif tracking-wider font-light">
          New Collection
        </h1>
        <button 
          @click="scrollToProducts"
          class="px-6 py-2.5 bg-white text-black text-xs font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-all cursor-pointer"
        >
          EXPLORE NOW
        </button>
      </div>
    </section>

    <!-- Search Input Bar -->
    <div class="max-w-7xl mx-auto px-6 pt-8 w-full">
      <div class="relative max-w-md mx-auto">
        <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search products..." 
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
        />
      </div>
    </div>

    <!-- Products Grid Section -->
    <section id="products" class="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <router-link 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :to="`/product/${product.id}`"
          class="group block space-y-3"
        >
          <div class="overflow-hidden bg-gray-50 rounded-sm aspect-[3/4]">
            <img 
              :src="product.image_url" 
              :alt="product.name" 
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h3 class="text-sm font-medium text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-1">
            {{ product.name }}
          </h3>
          <p class="text-xs text-gray-600 font-light">฿{{ product.price?.toLocaleString() }}</p>
        </router-link>
      </div>

      <!-- Empty Search Result -->
      <div v-else class="text-center py-16 text-gray-500">
        <p class="text-sm">No products found matching "{{ searchQuery }}"</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-10 border-t border-gray-100 text-center space-y-4">
      <div class="flex justify-center space-x-6 text-xl text-gray-700">
        <a href="#" class="hover:text-black"><i class="bi bi-instagram"></i></a>
        <a href="#" class="hover:text-black"><i class="bi bi-facebook"></i></a>
        <a href="#" class="hover:text-black"><i class="bi bi-envelope"></i></a>
      </div>
      <p class="text-xs text-gray-400 font-light tracking-wider">© 2026 LUMIERE GOWN. ALL RIGHTS RESERVED.</p>
    </footer>

    <!-- Navigation Drawer Component -->
    <Drawer :is-open="isDrawerOpen" @close="isDrawerOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Drawer from '../components/Drawer.vue' // (หรือ Drawer.vue ตามที่แต่ละไฟล์เรียกใช้)

const isDrawerOpen = ref(false)
const searchQuery = ref('')
const categories = ['NEW', 'WOMEN', 'MEN', 'GIRLS', 'BOYS']

const currentCategoryName = 'NEW' 

const products = ref([])

onMounted(async () => {
  try {
    // 1. ดึงข้อมูล Category เพื่อหา ID ของหมวดหมู่นี้
    const catRes = await axios.get('http://127.0.0.1:8000/categories/')
    const catObj = catRes.data.find(c => c.name.toUpperCase() === currentCategoryName)
    
    // 2. ดึงสินค้าทั้งหมด
    const prodRes = await axios.get('http://127.0.0.1:8000/products/')
    
    // 3. กรองเอาเฉพาะสินค้าที่ตรงกับ Category ID
    if (catObj) {
      products.value = prodRes.data.filter(p => p.category_id === catObj.id)
    }
  } catch (err) {
    console.error("Error fetching products:", err)
  }
})

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(p => (p.name || '').toLowerCase().includes(query))
})

const scrollToProducts = () => {
  const el = document.getElementById('products')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>