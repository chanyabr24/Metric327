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
          <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <router-link 
              to="/admin/categories" 
              class="text-gray-500 hover:text-black text-lg flex items-center transition-colors"
            >
              <i class="bi bi-chevron-left"></i>
            </router-link>

            <h1 class="text-sm font-semibold tracking-widest uppercase text-gray-800">
              {{ categoryId ? 'Edit Category' : 'Add Category' }}
            </h1>

            <div class="w-5"></div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6 pt-2">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              <!-- Left Column: Text Inputs -->
              <div class="md:col-span-7 space-y-5 md:border-r md:border-gray-100 md:pr-6">
                
                <!-- Category Name -->
                <div class="space-y-1">
                  <label for="categoryName" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                    Category Name
                  </label>
                  <div class="flex items-center border-b border-gray-200 focus-within:border-black transition-colors">
                    <i class="bi bi-folder text-amber-700 text-lg mr-2"></i>
                    <input 
                      v-model="form.name"
                      type="text" 
                      id="categoryName" 
                      required 
                      placeholder="Category Title..." 
                      class="w-full py-2 bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <!-- Category Description -->
                <div class="space-y-1">
                  <label for="categoryDesc" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                    Description
                  </label>
                  <div class="flex items-start border-b border-gray-200 focus-within:border-black transition-colors">
                    <i class="bi bi-text-paragraph text-amber-700 text-lg mr-2 mt-1"></i>
                    <textarea 
                      v-model="form.description"
                      id="categoryDesc" 
                      required 
                      rows="3"
                      placeholder="Category Description..." 
                      class="w-full py-2 bg-transparent text-sm focus:outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                <!-- Status Select -->
                <div class="space-y-1">
                  <label for="categoryStatus" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                    Status
                  </label>
                  <div class="flex items-center border-b border-gray-200 focus-within:border-black transition-colors">
                    <i class="bi bi-eye text-amber-700 text-lg mr-2"></i>
                    <select 
                      v-model="form.status"
                      id="categoryStatus" 
                      required 
                      class="w-full py-2 bg-transparent text-sm focus:outline-none cursor-pointer"
                    >
                      <option value="SHOW">SHOW (Visible on Webstore)</option>
                      <option value="HIDE">HIDE (Hidden from Webstore)</option>
                    </select>
                  </div>
                </div>

              </div>

              <!-- Right Column: Image URL & Preview -->
              <div class="md:col-span-5 space-y-4">
                <div class="space-y-1">
                  <label for="categoryImage" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                    Category Image URL
                  </label>
                  <div class="flex items-center border-b border-gray-200 focus-within:border-black transition-colors">
                    <i class="bi bi-link-45deg text-gray-700 text-lg mr-1"></i>
                    <input 
                      v-model="form.image_url"
                      type="url" 
                      id="categoryImage" 
                      placeholder="https://..." 
                      class="w-full py-2 bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <!-- Preview Box -->
                <div class="w-full h-52 border border-dashed border-gray-300 rounded-sm bg-gray-50 flex flex-col items-center justify-center text-gray-400 overflow-hidden relative">
                  <template v-if="form.image_url">
                    <img 
                      :src="form.image_url" 
                      alt="Preview" 
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                  </template>
                  <template v-else>
                    <i class="bi bi-image text-3xl mb-1 text-gray-400"></i>
                    <span class="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                      Image Preview
                    </span>
                  </template>
                </div>
              </div>

            </div>

            <!-- Submit Button -->
            <div class="pt-6 border-t border-gray-100 text-center">
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="px-10 py-3 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors disabled:opacity-50 cursor-pointer min-w-[240px]"
              >
                {{ isSubmitting ? 'SAVING...' : 'SAVE CATEGORY' }}
              </button>
            </div>
          </form>

        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const isMobileMenuOpen = ref(false)
const isSubmitting = ref(false)
const categoryId = ref(null)

const form = ref({
  name: '',
  description: '',
  status: 'SHOW',
  image_url: ''
})

onMounted(async () => {
  // ถ้าเป็นการเข้ามาแบบมี ID (เช่น กดปุ่ม Edit มา) ให้ดึงข้อมูลเก่ามาโชว์ก่อน
  if (route.query.id) {
    categoryId.value = route.query.id
    await fetchCategoryData(categoryId.value)
  }
})

// ฟังก์ชันดึงข้อมูลหมวดหมู่เดียว (สำหรับตอนแก้ไข)
const fetchCategoryData = async (id) => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/categories/${id}`)
    const category = res.data
    form.value = {
      name: category.name || '',
      description: category.description || '',
      status: category.status || 'SHOW',
      image_url: category.image_url || ''
    }
  } catch (err) {
    alert('Cannot fetch category data')
  }
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
}

// ฟังก์ชันเวลากดปุ่ม SAVE (จัดการทั้งสร้างใหม่และแก้ไข)
const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    if (categoryId.value) {
      // โหมดแก้ไข (PUT)
      await axios.put(`http://127.0.0.1:8000/categories/${categoryId.value}`, form.value)
    } else {
      // โหมดสร้างใหม่ (POST)
      await axios.post('http://127.0.0.1:8000/categories/', form.value)
    }

    alert('Category successfully saved!')
    router.push('/admin/categories') // เซฟเสร็จให้เด้งกลับไปหน้าตาราง

  } catch (err) {
    if (err.response && err.response.data && err.response.data.detail) {
      alert('Error: ' + err.response.data.detail)
    } else {
      alert('Error saving category. Please try again.')
    }
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('loggedInAdminId')
  router.push('/login')
}
</script>