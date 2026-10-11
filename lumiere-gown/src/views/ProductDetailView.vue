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
    <main class="max-w-7xl mx-auto px-6 py-10 w-full flex-grow">
      <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <!-- Left Column: Image -->
        <div class="bg-gray-50 rounded-sm overflow-hidden aspect-[3/4]">
          <img 
            :src="product.image_url" 
            :alt="product.name" 
            class="w-full h-full object-cover"
            @error="$event.target.src = '/images/women.jpg'"
          />
        </div>

        <!-- Right Column: Product Info -->
        <div class="space-y-6 lg:pl-6">
          <div>
            <h1 class="text-2xl md:text-3xl font-serif tracking-wide text-gray-900 mb-2">
              {{ product.name }}
            </h1>
            <p class="text-lg font-medium text-gray-800">
              ฿{{ product.price?.toLocaleString() }}
            </p>
          </div>

          <!-- Color & Size Form -->
          <form @submit.prevent="handleAddToCart" class="space-y-6">
            
            <!-- Color Selection -->
            <div class="space-y-3">
              <p class="text-xs font-semibold tracking-widest uppercase text-gray-500">
                SELECT COLOR
              </p>
              <div class="flex items-center space-x-3">
                <label 
                  v-for="c in computedColors" 
                  :key="c" 
                  :title="getColorInfo(c).name"
                  class="cursor-pointer relative"
                >
                  <input 
                    type="radio" 
                    name="color" 
                    :value="c" 
                    v-model="selectedColor"
                    class="sr-only peer"
                  />
                  <span 
                    class="block w-7 h-7 rounded-full border transition-all peer-checked:ring-2 peer-checked:ring-black peer-checked:ring-offset-2"
                    :style="{ 
                      backgroundColor: getColorInfo(c).hex, 
                      borderColor: getColorInfo(c).border 
                    }"
                  ></span>
                </label>
              </div>
            </div>

            <!-- Size Selection -->
            <div class="space-y-3">
              <p class="text-xs font-semibold tracking-widest uppercase text-gray-500">
                SELECT SIZE
              </p>
              <div class="flex flex-wrap gap-2">
                <label 
                  v-for="s in computedSizes" 
                  :key="s" 
                  class="cursor-pointer"
                >
                  <input 
                    type="radio" 
                    name="size" 
                    :value="s" 
                    v-model="selectedSize"
                    class="sr-only peer"
                  />
                  <span 
                    class="inline-block px-4 py-2 text-xs font-medium border border-gray-200 rounded-sm uppercase tracking-wider transition-colors peer-checked:bg-black peer-checked:text-white peer-checked:border-black hover:border-gray-400"
                  >
                    {{ s.toUpperCase() }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button 
              type="submit" 
              class="w-full py-3.5 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors cursor-pointer"
            >
              ADD TO CART
            </button>
          </form>

          <hr class="border-gray-100" />

          <!-- Details Accordion -->
          <div class="border border-gray-200 rounded-sm">
            <button 
              @click="isDetailsOpen = !isDetailsOpen" 
              type="button"
              class="w-full p-4 flex justify-between items-center text-xs font-semibold tracking-widest uppercase text-gray-800 cursor-pointer bg-white"
            >
              <span>DETAILS</span>
              <i 
                class="bi transition-transform duration-200 text-sm"
                :class="isDetailsOpen ? 'bi-chevron-up' : 'bi-chevron-down'"
              ></i>
            </button>

            <div v-show="isDetailsOpen" class="p-4 pt-0 text-xs font-light text-gray-600 leading-relaxed border-t border-gray-100">
              <ul v-if="descriptionLines.length > 1" class="list-disc pl-4 space-y-1">
                <li v-for="(line, idx) in descriptionLines" :key="idx">{{ line }}</li>
              </ul>
              <p v-else-if="descriptionLines.length === 1">
                {{ descriptionLines[0] }}
              </p>
              <p v-else class="italic text-gray-400">
                No details available.
              </p>
            </div>
          </div>

        </div>

      </div>

      <!-- Empty State -->
      <div v-else class="py-20 text-center text-gray-400">
        <p class="text-sm italic">Product not found.</p>
      </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Drawer from '../components/Drawer.vue'

const route = useRoute()
const router = useRouter()

const isDrawerOpen = ref(false)
const isDetailsOpen = ref(true)
const categories = ['NEW', 'WOMEN', 'MEN', 'GIRLS', 'BOYS']

const product = ref(null)
const selectedColor = ref('')
const selectedSize = ref('')

// Mock Color Map
const colorMap = {
  'white': { name: 'White', hex: '#FFFFFF', border: '#e5e7eb' },
  'pearl-white': { name: 'Pearl White', hex: '#F9F6EE', border: '#e5e7eb' },
  'black': { name: 'Black', hex: '#1a1a1a', border: 'transparent' },
  'dark-grey': { name: 'Dark Grey', hex: '#383838', border: 'transparent' },
  'camel': { name: 'Camel', hex: '#dfd8cb', border: 'transparent' },
  'pink': { name: 'Pink', hex: '#FFD1DC', border: 'transparent' },
  'blue': { name: 'Blue', hex: '#1E3A8A', border: 'transparent' },
  'cream': { name: 'Cream', hex: '#FDF5E6', border: '#e5e7eb' }
}

const getColorInfo = (c) => {
  return colorMap[c] || { name: c, hex: '#cccccc', border: 'transparent' }
}

// Mock dataset (ในอนาคตจะเปลี่ยนเป็นเรียก API GET `/api/products/${route.params.id}`)
const mockProducts = [
  { 
    id: 1, 
    name: 'Silky Silk Evening Gown', 
    price: 12500, 
    image_url: '/images/women.jpg', 
    category_name: 'WOMEN',
    description: 'Crafted from 100% Mulberry silk.\nFlattering cowl neckline.\nInvisible back zipper closure.\nFloor-length silhouette.'
  },
  { 
    id: 2, 
    name: 'Elegance Lace Bridal Dress', 
    price: 24900, 
    image_url: '/images/newpage.jpg', 
    category_name: 'NEW',
    description: 'Intricate French lace detailing.\nSweethart neckline with cap sleeves.\nBreathable cotton lining.'
  },
  { 
    id: 3, 
    name: 'Velvet Midnight Suit', 
    price: 18900, 
    image_url: '/images/men.jpg', 
    category_name: 'MEN',
    description: 'Premium cotton-velvet fabric.\nTailored slim fit silhouette.\nSatin lapels.'
  }
]

onMounted(() => {
  const productId = Number(route.params.id)
  const found = mockProducts.find(p => p.id === productId) || mockProducts[0]
  product.value = found

  if (computedColors.value.length > 0) {
    selectedColor.value = computedColors.value[0]
  }
  if (computedSizes.value.length > 0) {
    selectedSize.value = computedSizes.value[0]
  }
})

// Compute Colors
const computedColors = computed(() => {
  if (!product.value) return ['white', 'black']
  const catName = (product.value.category_name || '').toUpperCase()
  if (catName === 'WOMEN' || catName === 'GIRLS') {
    return ['white', 'pearl-white']
  }
  return ['black', 'dark-grey', 'white']
})

// Compute Sizes
const computedSizes = computed(() => {
  return ['xs', 's', 'm', 'l', 'xl']
})

// Split Description
const descriptionLines = computed(() => {
  if (!product.value?.description) return []
  return product.value.description
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
})

// Add to Cart
const handleAddToCart = () => {
  if (!product.value) return

  const cartItem = {
    id: `${product.value.name}-${selectedColor.value}-${selectedSize.value}`,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image_url,
    color: selectedColor.value,
    size: selectedSize.value,
    qty: 1
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || []
  const existingIndex = cart.findIndex(item => item.id === cartItem.id)

  if (existingIndex !== -1) {
    cart[existingIndex].qty += 1
  } else {
    cart.push(cartItem)
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  router.push('/cart')
}
</script>