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
    <main class="max-w-3xl mx-auto px-6 py-10 w-full flex-grow space-y-10">
      
      <!-- Page Title -->
      <div class="text-center">
        <h1 class="text-2xl md:text-3xl font-serif tracking-widest uppercase text-gray-900">
          Welcome Back
        </h1>
      </div>

      <!-- Profile Area -->
      <div class="text-center space-y-4">
        <h2 class="text-lg font-serif tracking-wider uppercase text-gray-800">
          {{ user.first_name }} {{ user.last_name }}
        </h2>
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 text-3xl border border-gray-200">
          <i class="bi bi-person"></i>
        </div>
      </div>

      <!-- Information Section -->
      <section class="space-y-3">
        <h3 class="text-xs font-semibold tracking-widest uppercase text-gray-500 pl-1">
          Information
        </h3>
        <div class="border border-gray-200 p-6 md:p-8 bg-white rounded-sm space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-1">
                Full Name
              </p>
              <p class="text-sm font-medium text-gray-800">
                {{ user.first_name || user.full_name }} {{ user.last_name || '' }}
              </p>
            </div>
            <div>
              <p class="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-1">
                Email Address
              </p>
              <p class="text-sm font-medium text-gray-800">
                {{ user.email_address }}
              </p>
            </div>
            <div v-if="user.employee_id">
              <p class="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-1">
                Employee ID
              </p>
              <p class="text-sm font-medium text-gray-800">
                {{ user.employee_id }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Order History Section -->
      <section class="space-y-3">
        <h3 class="text-xs font-semibold tracking-widest uppercase text-gray-500 pl-1">
          Order History
        </h3>
        <div class="border border-gray-200 bg-white rounded-sm divide-y divide-gray-100">
          <template v-if="orders && orders.length > 0">
            <div 
              v-for="order in orders" 
              :key="order.transaction_id" 
              class="flex items-center justify-between p-4 md:p-5"
            >
              <div class="flex items-center space-x-4">
                <!-- First Item Thumbnail -->
                <div 
                  v-if="getFirstItem(order).image" 
                  class="w-12 h-15 flex-shrink-0 overflow-hidden border border-gray-200 rounded-sm bg-gray-50"
                >
                  <img 
                    :src="getFirstItem(order).image" 
                    alt="Product" 
                    class="w-full h-full object-cover"
                  />
                </div>
                <div 
                  v-else 
                  class="w-12 h-15 flex-shrink-0 bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 rounded-sm"
                >
                  <i class="bi bi-box text-sm"></i>
                </div>

                <!-- Order Details -->
                <div>
                  <p class="text-sm font-medium text-gray-800 mb-0.5">
                    <span class="text-gray-400 uppercase text-xs">Order</span>
                    #{{ order.transaction_id }}
                  </p>
                  <p class="text-xs text-gray-500 font-light">
                    {{ formatDate(order.created_at) }}
                    · ฿{{ Number(order.amount).toLocaleString() }}
                    <span v-if="parseItems(order.items).length > 0">
                      · {{ parseItems(order.items).length }} {{ parseItems(order.items).length > 1 ? 'items' : 'item' }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Order Status Badge -->
              <div>
                <span 
                  class="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-sm"
                  :class="getStatusBadgeClass(order.status)"
                >
                  {{ order.status || 'PROCESSING' }}
                </span>
              </div>
            </div>
          </template>

          <div v-else class="p-8 text-center text-xs text-gray-400 uppercase tracking-wider">
            No orders yet.
          </div>
        </div>
      </section>

      <!-- Logout Action -->
      <div class="text-center pt-2">
        <button 
          @click="handleLogout" 
          class="text-xs font-bold tracking-widest uppercase text-gray-900 hover:text-amber-700 transition-colors cursor-pointer border-b border-gray-300 pb-0.5"
        >
          Logout
        </button>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Drawer from '../components/Drawer.vue'

const router = useRouter()
const isDrawerOpen = ref(false)
const categories = ['NEW', 'WOMEN', 'MEN', 'GIRLS', 'BOYS']

const user = ref({
  first_name: '',
  last_name: '',
  full_name: '',
  email_address: '',
  employee_id: ''
})

const orders = ref([]) 

const fetchUserProfile = async () => {
  try {
    // 1. ดึง ID ของลูกค้าที่ล็อกอินสำเร็จจากความจำบราวเซอร์
    const userId = localStorage.getItem('loggedInUserId')
    
    // 2. ดักไว้ว่าถ้าไม่มี ID (แอบเข้าหน้าโปรไฟล์โดยไม่ล็อกอิน) ให้เตะไปหน้า login
    if (!userId) {
      router.push('/login')
      return
    }
    
    // 3. ใช้ ID จริง ยิง API ไปขอดึงข้อมูลโปรไฟล์คนนั้นๆ
    const response = await axios.get(`http://127.0.0.1:8000/users/${userId}`)
    user.value = response.data
    
  } catch (error) {
    console.error("ไม่สามารถดึงข้อมูลโปรไฟล์ได้:", error)
  }
}

onMounted(() => {
  fetchUserProfile()
})

const parseItems = (items) => {
  if (typeof items === 'string') {
    try { return JSON.parse(items) } catch (e) { return [] }
  }
  return items || []
}

const getFirstItem = (order) => {
  const items = parseItems(order.items)
  return items[0] || {}
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    return 'N/A'
  }
}

const getStatusBadgeClass = (status) => {
  const s = (status || '').toUpperCase()
  if (s === 'COMPLETED') return 'bg-emerald-50 text-emerald-700'
  if (s === 'CANCELLED') return 'bg-rose-50 text-rose-700'
  return 'bg-amber-50 text-amber-700' 
}

const handleLogout = () => {
  // 4. ลบความจำทิ้งเมื่อกดออกจากระบบ
  localStorage.removeItem('loggedInUserId')
  router.push('/login')
}
</script>