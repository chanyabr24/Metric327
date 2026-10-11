<template>
  <div class="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
    
    <!-- Top Header Navigation -->
    <header class="h-16 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div class="flex items-center space-x-3">
        <router-link to="/" class="text-xl font-serif tracking-widest font-semibold uppercase text-gray-900">
          Lumière Gown
        </router-link>
        <span class="text-xs text-gray-400 font-medium uppercase tracking-widest pl-3 border-l border-gray-200 hidden sm:inline-block">
          Dashboard
        </span>
      </div>

      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
          <i class="bi bi-person"></i>
        </div>
        <span class="text-xs font-semibold tracking-wider text-gray-800 hidden sm:inline-block">
          Admin
        </span>
        
        <!-- Mobile Sidebar Toggle -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen" 
          class="md:hidden p-1.5 text-gray-700 hover:text-black cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <i class="bi bi-list text-2xl"></i>
        </button>
      </div>
    </header>

    <div class="flex-1 flex flex-col md:flex-row">
      
      <!-- Sidebar -->
      <aside 
        class="bg-white border-r border-gray-200 w-full md:w-64 flex-shrink-0 flex flex-col justify-between"
        :class="{ 'block': isMobileMenuOpen, 'hidden md:flex': !isMobileMenuOpen }"
      >
        <div class="p-4 space-y-1">
          <router-link 
            to="/admin/categories" 
            class="flex items-center space-x-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <i class="bi bi-grid-fill text-base"></i>
            <span>Category Management</span>
          </router-link>

          <router-link 
            to="/admin/products" 
            class="flex items-center space-x-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <i class="bi bi-tag-fill text-base"></i>
            <span>Product Management</span>
          </router-link>

          <router-link 
            to="/admin/sales" 
            class="flex items-center space-x-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <i class="bi bi-graph-up text-base"></i>
            <span>Sale History</span>
          </router-link>
        </div>

        <div class="p-4 border-t border-gray-100">
          <button 
            @click="handleLogout" 
            class="w-full py-2.5 border border-black text-black hover:bg-black hover:text-white transition-colors text-xs font-semibold tracking-widest uppercase flex items-center justify-center space-x-2 cursor-pointer"
          >
            <i class="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow p-4 md:p-8 bg-gray-50 flex justify-center items-start">
        <div class="w-full max-w-3xl bg-white p-6 md:p-10 shadow-xs border border-gray-100 rounded-sm space-y-8 my-4">
          
          <!-- Welcome Section -->
          <div class="text-center space-y-3">
            <h2 class="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
              Welcome to Back-Office Management
            </h2>
            <h1 class="text-2xl md:text-3xl font-serif tracking-wider text-gray-900">
              {{ admin.full_name ? admin.full_name.split(' ')[0] : 'Admin' }}
            </h1>
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl mx-auto">
              <i class="bi bi-person"></i>
            </div>
          </div>

          <!-- Information Grid -->
          <div class="border-t border-gray-100 pt-6">
            <h3 class="text-xs font-bold tracking-widest uppercase text-gray-900 mb-6">
              Information
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <span class="text-[10px] font-medium tracking-widest uppercase text-gray-400 block">
                  Full Name
                </span>
                <p class="text-sm font-medium text-gray-800">
                  {{ admin.full_name || 'N/A' }}
                </p>
              </div>

              <div class="space-y-1">
                <span class="text-[10px] font-medium tracking-widest uppercase text-gray-400 block">
                  Email Address
                </span>
                <p class="text-sm font-medium text-gray-800">
                  {{ admin.email_address || 'N/A' }}
                </p>
              </div>

              <div class="space-y-1">
                <span class="text-[10px] font-medium tracking-widest uppercase text-gray-400 block">
                  Phone Number
                </span>
                <p class="text-sm font-medium text-gray-800">
                  {{ admin.phone_number || 'N/A' }}
                </p>
              </div>

              <div class="space-y-1">
                <span class="text-[10px] font-medium tracking-widest uppercase text-gray-400 block">
                  Employee ID
                </span>
                <p class="text-sm font-medium text-gray-800">
                  {{ admin.employee_id || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Action Links -->
          <div class="border-t border-gray-100 pt-4 divide-y divide-gray-100">
            <router-link 
              to="/admin/categories" 
              class="flex justify-between items-center py-4 px-2 hover:bg-gray-50 transition-colors group"
            >
              <div>
                <p class="text-xs font-semibold tracking-widest uppercase text-gray-900 group-hover:text-amber-700 transition-colors">
                  Category Management
                </p>
                <p class="text-xs text-gray-400 font-light">View and manage</p>
              </div>
              <i class="bi bi-chevron-right text-gray-400 group-hover:text-black transition-colors"></i>
            </router-link>

            <router-link 
              to="/admin/products" 
              class="flex justify-between items-center py-4 px-2 hover:bg-gray-50 transition-colors group"
            >
              <div>
                <p class="text-xs font-semibold tracking-widest uppercase text-gray-900 group-hover:text-amber-700 transition-colors">
                  Product Management
                </p>
                <p class="text-xs text-gray-400 font-light">View and manage</p>
              </div>
              <i class="bi bi-chevron-right text-gray-400 group-hover:text-black transition-colors"></i>
            </router-link>

            <router-link 
              to="/admin/sales" 
              class="flex justify-between items-center py-4 px-2 hover:bg-gray-50 transition-colors group"
            >
              <div>
                <p class="text-xs font-semibold tracking-widest uppercase text-gray-900 group-hover:text-amber-700 transition-colors">
                  Sales History
                </p>
                <p class="text-xs text-gray-400 font-light">View orders history</p>
              </div>
              <i class="bi bi-chevron-right text-gray-400 group-hover:text-black transition-colors"></i>
            </router-link>
          </div>

        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMobileMenuOpen = ref(false)

// Mock Admin Data
const admin = ref({
  full_name: 'Administrator User',
  email_address: 'admin@lumieregown.com',
  phone_number: '+66 81-234-5678',
  employee_id: 'EMP-2026-001'
})

onMounted(async () => {
  try {
    const res = await fetch('/api/admin/profile')
    if (res.ok) {
      admin.value = await res.json()
    }
  } catch (err) {
    // ใช้ Mock Data กรณีที่ยังไม่ได้เชื่อม Backend
  }
})

const handleLogout = () => {
  // Clear Admin Session/Token
  router.push('/login')
}
</script>