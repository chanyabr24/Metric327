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
            class="flex items-center space-x-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <i class="bi bi-grid-fill text-base"></i>
            <span>Category Management</span>
          </router-link>

          <router-link 
            to="/admin/products" 
            class="flex items-center space-x-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-sm bg-gray-100 text-black border-l-4 border-black"
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
              to="/admin/products" 
              class="text-gray-500 hover:text-black text-lg flex items-center transition-colors"
            >
              <i class="bi bi-chevron-left"></i>
            </router-link>

            <h1 class="text-sm font-semibold tracking-widest uppercase text-gray-800">
              {{ productId ? 'Edit Product' : 'Add Product' }}
            </h1>

            <div class="w-5"></div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6 pt-2">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              <!-- Left Column: Inputs -->
              <div class="md:col-span-7 space-y-5 md:border-r md:border-gray-100 md:pr-6">
                
                <!-- Product Title -->
                <div class="space-y-1">
                  <label for="productName" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                    Product Title
                  </label>
                  <div class="flex items-center border-b border-gray-200 focus-within:border-black transition-colors">
                    <i class="bi bi-tag-fill text-amber-700 text-lg mr-2"></i>
                    <input 
                      v-model="form.name"
                      type="text" 
                      id="productName" 
                      required 
                      placeholder="Product Title..." 
                      class="w-full py-2 bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <!-- Description -->
                <div class="space-y-1">
                  <label for="productDesc" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                    Description
                  </label>
                  <div class="flex items-start border-b border-gray-200 focus-within:border-black transition-colors">
                    <i class="bi bi-text-paragraph text-amber-700 text-lg mr-2 mt-1"></i>
                    <textarea 
                      v-model="form.description"
                      id="productDesc" 
                      required 
                      rows="3"
                      placeholder="Product Description..." 
                      class="w-full py-2 bg-transparent text-sm focus:outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                <!-- Price -->
                <div class="space-y-1">
                  <label for="productPrice" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                    Price (฿)
                  </label>
                  <div class="flex items-center border-b border-gray-200 focus-within:border-black transition-colors">
                    <span class="text-gray-800 font-bold text-sm mr-2">฿</span>
                    <input 
                      v-model.number="form.price"
                      type="number" 
                      step="0.01"
                      id="productPrice" 
                      required 
                      placeholder="0.00" 
                      class="w-full py-2 bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <!-- Category -->
                <div class="space-y-1">
                  <label for="productCategory" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                    Category
                  </label>
                  <div class="flex items-center border-b border-gray-200 focus-within:border-black transition-colors">
                    <i class="bi bi-grid-fill text-gray-700 text-lg mr-2"></i>
                    <select 
                      v-model="form.category_id"
                      id="productCategory" 
                      required 
                      class="w-full py-2 bg-transparent text-sm focus:outline-none cursor-pointer"
                    >
                      <option value="" disabled>Select a Category...</option>
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Attributes Box -->
                <div class="space-y-3 pt-2">
                  <label class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                    Attributes (Color & Size)
                  </label>
                  <div class="p-4 border border-gray-200 rounded-sm bg-gray-50 space-y-4">
                    
                    <!-- Colors -->
                    <div class="space-y-2">
                      <span class="text-xs font-semibold text-gray-700 block">Available Colors</span>
                      <div class="flex flex-wrap gap-3">
                        <label 
                          v-for="color in availableColorOptions" 
                          :key="color.value"
                          class="flex items-center space-x-1.5 text-xs text-gray-700 cursor-pointer"
                        >
                          <input 
                            type="checkbox" 
                            :value="color.value" 
                            v-model="selectedColors"
                            class="accent-black rounded-xs"
                          />
                          <span>{{ color.label }}</span>
                        </label>
                      </div>
                    </div>

                    <!-- Sizes -->
                    <div class="space-y-2 border-t border-gray-200 pt-3">
                      <span class="text-xs font-semibold text-gray-700 block">Available Sizes</span>
                      <div class="flex flex-wrap gap-3">
                        <label 
                          v-for="size in availableSizeOptions" 
                          :key="size"
                          class="flex items-center space-x-1.5 text-xs text-gray-700 cursor-pointer"
                        >
                          <input 
                            type="checkbox" 
                            :value="size" 
                            v-model="selectedSizes"
                            class="accent-black rounded-xs"
                          />
                          <span class="uppercase">{{ size }}</span>
                        </label>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              <!-- Right Column: Image URL & Preview -->
              <div class="md:col-span-5 space-y-4">
                <div class="space-y-1">
                  <label for="productImage" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                    Product Image URL
                  </label>
                  <div class="flex items-center border-b border-gray-200 focus-within:border-black transition-colors">
                    <i class="bi bi-link-45deg text-gray-700 text-lg mr-1"></i>
                    <input 
                      v-model="form.image_url"
                      type="url" 
                      id="productImage" 
                      placeholder="https://..." 
                      class="w-full py-2 bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <!-- Preview Box -->
                <div class="w-full h-72 border border-dashed border-gray-300 rounded-sm bg-gray-50 flex flex-col items-center justify-center text-gray-400 overflow-hidden relative">
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
                {{ isSubmitting ? 'SAVING...' : 'SAVE PRODUCT' }}
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
import axios from 'axios' // นำเข้า axios

const route = useRoute()
const router = useRouter()

const isMobileMenuOpen = ref(false)
const isSubmitting = ref(false)
const productId = ref(null)

const categories = ref([])
const selectedColors = ref([])
const selectedSizes = ref([])

const availableColorOptions = [
  { value: 'dark-grey', label: 'Dark-Grey' },
  { value: 'camel', label: 'Camel' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'pearl-white', label: 'Pearl White' },
  { value: 'pink', label: 'Pink' },
  { value: 'blue', label: 'Blue' },
  { value: 'cream', label: 'Cream' }
]

const availableSizeOptions = ['xs', 's', 'm', 'l', 'xl']

const form = ref({
  name: '',
  description: '',
  price: '',
  category_id: '',
  image_url: ''
})

onMounted(async () => {
  await fetchCategories()

  // ถ้ามี ID แปลว่ากดแก้ไขมา ให้ดึงข้อมูลสินค้าชิ้นนั้นมาโชว์
  if (route.query.id) {
    productId.value = route.query.id
    await fetchProductData(productId.value)
  }
})

// 1. ดึงหมวดหมู่ทั้งหมดมาแสดงใน Dropdown
const fetchCategories = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/categories/')
    categories.value = res.data
  } catch (err) {
    console.error("Error fetching categories:", err)
    alert("Failed to load categories")
  }
}

// 2. ดึงข้อมูลสินค้าเดิมมาแสดงในฟอร์ม (สำหรับโหมด Edit)
const fetchProductData = async (id) => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/products/${id}`)
    const product = res.data
    
    form.value = {
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category_id: product.category_id || '',
      image_url: product.image_url || ''
    }

    // แปลง Attributes (สี/ไซส์) จาก Database กลับมาติ๊กใน Checkbox
    if (product.attribute) {
      try {
        const attrObj = typeof product.attribute === 'string' ? JSON.parse(product.attribute) : product.attribute
        if (attrObj.colors) selectedColors.value = attrObj.colors
        if (attrObj.sizes) selectedSizes.value = attrObj.sizes
      } catch (e) {
        console.error("Attribute parsing error", e)
      }
    }
  } catch (err) {
    console.error("Error fetching product details:", err)
    alert("Failed to load product details")
  }
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
}

// 3. บันทึกข้อมูล (POST สร้างใหม่ / PUT แก้ไข)
const handleSubmit = async () => {
  isSubmitting.value = true

  const finalAttribute = {
    colors: selectedColors.value,
    sizes: selectedSizes.value
  }

  const payload = {
    name: form.value.name,
    description: form.value.description,
    price: Number(form.value.price),
    category_id: Number(form.value.category_id),
    attribute: finalAttribute,
    image_url: form.value.image_url
  }

  try {
    if (productId.value) {
      await axios.put(`http://127.0.0.1:8000/products/${productId.value}`, payload)
    } else {
      await axios.post('http://127.0.0.1:8000/products/', payload)
    }

    alert('Product saved successfully!')
    router.push('/admin/products')

  } catch (err) {
    console.error("Error saving product:", err)
    alert('บันทึกไม่สำเร็จ ตรวจสอบข้อมูลอีกครั้ง (422)')
  } finally {
    isSubmitting.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('loggedInAdminId')
  router.push('/login')
}
</script>