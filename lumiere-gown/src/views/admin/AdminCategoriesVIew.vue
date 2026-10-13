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
        <router-link to="/admin/account" class="flex items-center space-x-2 text-gray-800 hover:text-black">
          <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <i class="bi bi-person"></i>
          </div>
          <span class="text-xs font-semibold tracking-wider hidden sm:inline-block">
            Admin
          </span>
        </router-link>
        
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
            class="flex items-center space-x-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-sm bg-gray-100 text-black border-l-4 border-black"
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
        <div class="w-full max-w-4xl bg-white p-6 md:p-8 shadow-xs border border-gray-100 rounded-sm space-y-6">
          
          <!-- Page Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h1 class="text-xl md:text-2xl font-serif tracking-wide text-gray-900">
                Category Management
              </h1>
              <p class="text-xs text-gray-500 font-light mt-0.5">
                Organize and manage your product collections.
              </p>
            </div>
            
            <router-link 
              to="/admin/category-form" 
              class="px-5 py-2.5 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              + New Category
            </router-link>
          </div>

          <!-- Categories List -->
          <div v-if="isLoading" class="text-center py-12 text-xs text-gray-400">
            Loading Categories...
          </div>

          <div v-else-if="errorMessage" class="text-center py-12 text-xs text-rose-500">
            {{ errorMessage }}
          </div>

          <div v-else-if="sortedCategories.length === 0" class="text-center py-12 text-xs text-gray-400">
            No categories found. Create a new category!
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="category in sortedCategories" 
              :key="category.id" 
              class="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-sm bg-white hover:border-gray-300 transition-colors gap-4"
            >
              <!-- Info Block -->
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200">
                  <img 
                    v-if="category.image_url" 
                    :src="category.image_url" 
                    :alt="category.name"
                    class="w-full h-full object-cover"
                  />
                  <i v-else class="bi bi-folder text-xl text-gray-400"></i>
                </div>

                <div>
                  <div class="flex items-center space-x-2">
                    <h3 class="text-sm font-semibold text-gray-800">
                      {{ category.name }}
                    </h3>
                    <span 
                      class="text-[9px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase"
                      :class="category.status === 'SHOW' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'"
                    >
                      {{ category.status || 'SHOW' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 font-light mt-0.5 uppercase tracking-wide">
                    {{ category.description || 'No description' }}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <!-- Toggle Status Button -->
                <button 
                  @click="toggleCategoryStatus(category)" 
                  class="flex-1 sm:flex-initial px-3 py-1.5 border border-gray-300 hover:border-black text-gray-700 text-xs font-medium rounded-sm transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <i class="bi" :class="category.status === 'SHOW' ? 'bi-eye-slash' : 'bi-eye'"></i>
                  <span>{{ category.status === 'SHOW' ? 'HIDE' : 'SHOW' }}</span>
                </button>

                <!-- Edit Button -->
                <router-link 
                  :to="`/admin/category-form?id=${category.id}`" 
                  class="flex-1 sm:flex-initial px-3 py-1.5 border border-black bg-black text-white hover:bg-gray-800 text-xs font-medium rounded-sm transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <i class="bi bi-pencil"></i>
                  <span>Edit</span>
                </router-link>

                <!-- Delete Button -->
                <button 
                  @click="deleteCategory(category.id)" 
                  class="flex-1 sm:flex-initial px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-medium rounded-sm transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <i class="bi bi-trash"></i>
                  <span>Delete</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // อย่าลืม import axios

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isLoading = ref(true)
const errorMessage = ref('')
const categories = ref([])

// 1. ฟังก์ชันดึงหมวดหมู่ทั้งหมดจาก Database
const fetchCategories = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await axios.get('http://127.0.0.1:8000/categories/')
    categories.value = res.data
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Failed to load categories.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})

const sortedCategories = computed(() => {
  return [...categories.value].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
})

// 2. ฟังก์ชันเปิด/ปิดการมองเห็น (อัปเดตข้อมูล)
const toggleCategoryStatus = async (category) => {
  const newStatus = category.status === 'SHOW' ? 'HIDE' : 'SHOW'
  if (!confirm(`Are you sure you want to set this category to ${newStatus}?`)) return

  try {
    await axios.put(`http://127.0.0.1:8000/categories/${category.id}`, {
      name: category.name,
      description: category.description,
      status: newStatus,
      image_url: category.image_url
    })
    category.status = newStatus
  } catch (err) {
    alert('Error updating category status')
  }
}

// 3. ฟังก์ชันลบหมวดหมู่
const deleteCategory = async (id) => {
  if (!confirm('Are you sure you want to delete this category?')) return

  try {
    await axios.delete(`http://127.0.0.1:8000/categories/${id}`)
    // พอลบสำเร็จ ก็สั่งให้หน้าเว็บลบแถวนั้นทิ้งไปเลย
    categories.value = categories.value.filter(c => c.id !== id)
  } catch (err) {
    alert('Error deleting category')
  }
}

const handleLogout = () => {
  localStorage.removeItem('loggedInAdminId')
  router.push('/login')
}
</script>