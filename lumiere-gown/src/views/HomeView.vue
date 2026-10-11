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

      <router-link to="/" class="text-xl font-serif tracking-widest  uppercase">
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

    <!-- Hero Carousel Section -->
    <section class="relative w-full overflow-hidden bg-gray-100">
      <div class="relative h-[60vh] md:h-[75vh] w-full">
        <!-- Carousel Slides -->
        <div 
          v-for="(slide, index) in heroSlides" 
          :key="index"
          class="absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-center"
          :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'"
        >
          <img 
            :src="slide.image" 
            :alt="slide.title" 
            class="w-full h-full object-cover"
          />
          
        </div>

        <!-- Carousel Indicators -->
        <div class="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
          <button 
            v-for="(_, index) in heroSlides" 
            :key="index"
            @click="currentSlide = index"
            class="w-8 h-1 rounded-full transition-all cursor-pointer"
            :class="currentSlide === index ? 'bg-white scale-105' : 'bg-white/50 hover:bg-white/80'"
            :aria-label="`Slide ${index + 1}`"
          ></button>
        </div>

        <!-- Controls -->
        <button 
          @click="prevSlide" 
          class="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white text-2xl p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <button 
          @click="nextSlide" 
          class="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white text-2xl p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="max-w-7xl mx-auto px-6 py-12 w-full">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <router-link 
          v-for="product in featuredProducts" 
          :key="product.id" 
          :to="`/product/${product.id}`"
          class="group block space-y-3"
        >
          <div class="overflow-hidden bg-gray-50 rounded-sm aspect-[3/4]">
            <img 
              :src="product.image_url" 
              :alt="product.name" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h3 class="text-sm font-medium text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-1">
            {{ product.name }}
          </h3>
          <p class="text-xs text-gray-600 font-light">฿{{ product.price?.toLocaleString() }}</p>
        </router-link>
      </div>
    </section>

    <!-- New Arrivals Section -->
    <section class="max-w-7xl mx-auto px-6 py-12 w-full border-t border-gray-100">
      <div class="flex items-center justify-between mb-8">
        <h4 class="text-xl font-serif tracking-widest text-gray-900 uppercase">NEW ARRIVALS</h4>
        <router-link 
          to="/new" 
          class="text-xs font-semibold tracking-wider text-gray-500 hover:text-black uppercase border-b border-gray-400 pb-0.5"
        >
          VIEW ALL
        </router-link>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <router-link 
          v-for="product in newArrivals" 
          :key="product.id" 
          :to="`/product/${product.id}`"
          class="group block space-y-3"
        >
          <div class="overflow-hidden bg-gray-50 rounded-sm aspect-[3/4]">
            <img 
              :src="product.image_url" 
              :alt="product.name" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h3 class="text-sm font-medium text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-1">
            {{ product.name }}
          </h3>
          <p class="text-xs text-gray-600 font-light">฿{{ product.price?.toLocaleString() }}</p>
        </router-link>
      </div>
    </section>

    <!-- Editorial Section -->
    <section class="relative my-8 overflow-hidden">
      <img 
        src="/images/home4.jpg" 
        alt="Bridal Sanctuary" 
        class="w-full h-[50vh] md:h-[65vh] object-cover"
      />
      <div class="absolute inset-0 bg-black/25 flex flex-col items-center justify-center text-white text-center p-6">
        <p class="text-xs tracking-[0.3em] font-light uppercase mb-2">THE EDIT</p>
        <h2 class="text-3xl md:text-5xl font-serif tracking-wide font-normal">Bridal Sanctuary</h2>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-10 border-t border-gray-100 text-center space-y-4">
      <h2 class="text-lg font-serif tracking-widest uppercase">LUMIÈRE GOWN</h2>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Drawer from '@/components/Drawer.vue'

const isDrawerOpen = ref(false)
const categories = ['NEW', 'WOMEN', 'MEN', 'GIRLS', 'BOYS']

// Carousel Logic
const currentSlide = ref(0)
const heroSlides = [
  { image: '/images/home1.jpg', title: 'Lumière Gown' },
  { image: '/images/home2.jpg', title: 'Lumière Gown' },
  { image: '/images/home3.jpg', title: 'Lumière Gown' }
]

let timer = null
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.length
}
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + heroSlides.length) % heroSlides.length
}

onMounted(() => {
  timer = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// Mock Products Data 
const products = ref([
  { id: 5, name: 'Silky Silk Evening Gown', price: 12500, image_url: '/images/women.jpg', category_name: 'WOMEN' },
  { id: 10, name: 'Elegance Lace Bridal Dress', price: 24900, image_url: '/images/newpage.jpg', category_name: 'NEW' },
  { id: 15, name: 'Velvet Midnight Suit', price: 18900, image_url: '/images/men.jpg', category_name: 'MEN' },
  { id: 25, name: 'Floral Princess Dress', price: 6500, image_url: '/images/girls.JPG', category_name: 'GIRLS' },
  { id: 101, name: 'Chiffon Pleated Gown', price: 14200, image_url: '/images/girlspage.jpg', category_name: 'NEW' },
  { id: 102, name: 'Satin Minimalist Gown', price: 16800, image_url: '/images/women.jpg', category_name: 'NEW' }
])

const featuredIds = [5, 10, 15, 25, 30, 35, 40, 45, 50, 55, 60]

const featuredProducts = computed(() => {
  return products.value.filter(p => featuredIds.includes(p.id))
})

const newArrivals = computed(() => {
  return products.value.filter(p => p.category_name?.toLowerCase() === 'new')
})
</script>