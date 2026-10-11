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
      >
        {{ cat }}
      </router-link>
    </nav>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-6 py-12 w-full flex-grow space-y-12">
      <h1 class="text-2xl md:text-4xl font-serif tracking-widest text-center uppercase text-gray-900">
        CONTACT US
      </h1>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-gray-100 py-10">
        
        <!-- Address -->
        <div class="space-y-2">
          <p class="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
            Address
          </p>
          <p class="text-sm font-light text-gray-800 leading-relaxed">
            RX22+57P, Sukhothai 5 Alley, Tambon Su Thep, Mueang Chiang Mai District,<br />
            Chiang Mai 50200, Thailand
          </p>
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <p class="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
            Email
          </p>
          <p class="text-sm font-light">
            <a 
              href="mailto:contact@lumieregown.com" 
              class="text-gray-800 hover:text-amber-700 transition-colors underline underline-offset-4"
            >
              contact@lumieregown.com
            </a>
          </p>
        </div>

        <!-- Phone -->
        <div class="space-y-2">
          <p class="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
            Phone
          </p>
          <p class="text-sm font-light text-gray-800">
            +66 53-920299
          </p>
        </div>

        <!-- Hours -->
        <div class="space-y-2">
          <p class="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
            Hours
          </p>
          <p class="text-sm font-light text-gray-800 leading-relaxed">
            Mon - Fri 10:00 - 19:00<br />
            Sat - Sun 10:00 - 17:00
          </p>
        </div>

      </div>

      <!-- Map Section -->
      <section class="space-y-4">
        <p class="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
          Our Location
        </p>
        <div class="w-full h-80 md:h-96 bg-gray-50 border border-gray-200 rounded-sm overflow-hidden">
          <iframe 
            v-if="mapUrl"
            :src="mapUrl" 
            class="w-full h-full border-0" 
            loading="lazy" 
            allowfullscreen 
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
            <i class="bi bi-geo-alt text-3xl"></i>
            <p class="text-xs uppercase tracking-wider">Chiang Mai, Thailand (18.8012, 98.9506)</p>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="py-10 border-t border-gray-100 text-center space-y-4">
      <h2 class="text-sm font-serif tracking-widest uppercase text-gray-800">LUMIÈRE GOWN</h2>
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
import { ref, computed } from 'vue'
import Drawer from '../components/Drawer.vue'

const isDrawerOpen = ref(false)
const categories = ['NEW', 'WOMEN', 'MEN', 'GIRLS', 'BOYS']

// อ่านค่า Maps API Key จาก Vite environment variable (.env)
const apiKey = import.meta.env.VITE_MAPS_API_KEY || ''

const mapUrl = computed(() => {
  if (apiKey) {
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=18.801264728985803,98.95069303196284`
  }
  // Standard OpenStreetMap Embed เป็น Fallback กรณีไม่มี Google API Key
  return 'https://maps.google.com/maps?q=18.8012647,98.950693&z=15&output=embed'
})
</script>