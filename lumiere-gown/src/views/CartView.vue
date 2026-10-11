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
      <h1 class="text-2xl md:text-3xl font-serif tracking-widest uppercase text-gray-900 mb-8">
        Shopping Cart
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        <!-- Cart Items List -->
        <div class="lg:col-span-2 space-y-6">
          <template v-if="cart.length > 0">
            <div 
              v-for="item in cart" 
              :key="item.id" 
              class="flex items-center space-x-4 p-4 border border-gray-200 rounded-sm relative bg-white"
            >
              <!-- Item Image -->
              <div class="w-20 h-28 flex-shrink-0 bg-gray-50 overflow-hidden border border-gray-100 rounded-sm">
                <img 
                  :src="item.image" 
                  :alt="item.name" 
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Item Details -->
              <div class="flex-grow flex flex-col justify-between space-y-2">
                <div>
                  <h3 class="text-sm font-medium text-gray-800 pr-6">
                    {{ item.name }}
                  </h3>
                  <p class="text-xs text-gray-500 font-light mt-0.5">
                    Color: {{ item.color }}<br />
                    Size: {{ item.size }}
                  </p>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center space-x-3">
                  <button 
                    @click="changeQty(item, -1)" 
                    class="w-6 h-6 border border-gray-300 rounded-sm flex items-center justify-center text-xs text-gray-600 hover:border-black transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span class="text-xs font-medium w-4 text-center">{{ item.qty }}</span>
                  <button 
                    @click="changeQty(item, 1)" 
                    class="w-6 h-6 border border-gray-300 rounded-sm flex items-center justify-center text-xs text-gray-600 hover:border-black transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Price -->
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">
                  ฿{{ (item.price * item.qty).toLocaleString() }}.00
                </p>
              </div>

              <!-- Remove Button -->
              <button 
                @click="removeItem(item.id)" 
                class="absolute top-3 right-3 text-gray-400 hover:text-black text-xs p-1 cursor-pointer transition-colors"
                title="Remove"
              >
                ✕
              </button>
            </div>
          </template>

          <div v-else class="py-16 text-center border border-dashed border-gray-200 rounded-sm">
            <p class="text-sm text-gray-500">Your cart is empty.</p>
            <router-link 
              to="/women" 
              class="inline-block mt-4 px-6 py-2 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors"
            >
              Start Shopping
            </router-link>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <aside class="border border-gray-200 p-6 bg-white rounded-sm space-y-6">
          <p class="text-xs font-semibold tracking-widest uppercase text-gray-800 border-b border-gray-100 pb-3">
            ORDER SUMMARY
          </p>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span class="font-medium text-gray-900">฿{{ subtotal.toLocaleString() }}.00</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span class="text-emerald-700 font-medium text-xs uppercase tracking-wider">Free Shipping</span>
            </div>
          </div>

          <hr class="border-gray-100" />

          <div class="flex justify-between items-center text-base font-semibold text-gray-900">
            <span class="text-xs font-bold tracking-widest uppercase">TOTAL</span>
            <span class="font-sans">฿{{ subtotal.toLocaleString() }}.00</span>
          </div>

          <router-link 
            to="/checkout" 
            class="block w-full text-center py-3 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors"
            :class="{ 'pointer-events-none opacity-50': cart.length === 0 }"
          >
            CONTINUE TO CHECKOUT
          </router-link>
        </aside>

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
import Drawer from '../components/Drawer.vue'

const isDrawerOpen = ref(false)
const categories = ['NEW', 'WOMEN', 'MEN', 'GIRLS', 'BOYS']
const cart = ref([])

// Load cart from localStorage on component mount
onMounted(() => {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    try {
      cart.value = JSON.parse(savedCart)
    } catch (e) {
      cart.value = []
    }
  } else {
    // Default Mock Data ถ้าใน localStorage ยังไม่มีสินค้า
    cart.value = [
      {
        id: '1',
        name: 'Silky Silk Evening Gown',
        color: 'Ivory',
        size: 'M',
        price: 12500,
        qty: 1,
        image: '/images/women.jpg'
      }
    ]
    saveCart()
  }
})

// Save cart helper
const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

// Quantity Modifier
const changeQty = (item, delta) => {
  item.qty += delta
  if (item.qty < 1) item.qty = 1
  saveCart()
}

// Remove item
const removeItem = (id) => {
  cart.value = cart.value.filter(i => i.id !== id)
  saveCart()
}

// Calculate subtotal
const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
})
</script>