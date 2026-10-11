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
        <div class="w-full max-w-6xl bg-white p-6 md:p-8 shadow-xs border border-gray-100 rounded-sm space-y-6 min-h-[80vh]">
          
          <!-- Page Header & Filters -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h1 class="text-xl md:text-2xl font-serif tracking-wide text-gray-900">
                Product List
              </h1>
              <p class="text-xs text-gray-500 font-light mt-0.5">
                Manage your product catalog and inventory.
              </p>
            </div>
            
            <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <!-- Category Filter Select -->
              <select 
                v-model="selectedCategory"
                @change="fetchProducts"
                class="px-3 py-2 border border-gray-300 rounded-sm text-xs font-medium focus:outline-none focus:border-black bg-white cursor-pointer min-w-[160px]"
              >
                <option value="">All Categories</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>

              <!-- Add New Item Button -->
              <router-link 
                to="/admin/product-form" 
                class="px-5 py-2.5 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors whitespace-nowrap cursor-pointer text-center flex-1 sm:flex-none"
              >
                + Add New Item
              </router-link>
            </div>
          </div>

          <!-- Product Grid List -->
          <div v-if="isLoading" class="text-center py-16 text-xs text-gray-400">
            Loading products...
          </div>

          <div v-else-if="errorMessage" class="text-center py-16 text-xs text-rose-500">
            {{ errorMessage }}
          </div>

          <div v-else-if="sortedProducts.length === 0" class="text-center py-16 text-xs text-gray-400">
            No products found for this selection.
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div 
              v-for="product in sortedProducts" 
              :key="product.id"
              class="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-colors group"
            >
              <!-- Product Image Wrapper -->
              <div class="relative h-64 bg-gray-100 overflow-hidden">
                <img 
                  :src="product.image_url || '/images/women.jpg'" 
                  :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  @error="$event.target.src = '/images/women.jpg'"
                />
                <!-- Category Badge -->
                <div class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 border border-gray-200 text-[10px] font-bold tracking-widest uppercase text-gray-800">
                  {{ product.category_name || 'Uncategorized' }}
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-4 flex-grow flex flex-col justify-between space-y-3">
                <div class="space-y-1">
                  <div class="flex justify-between items-start gap-2">
                    <h3 class="text-xs font-bold tracking-wide uppercase text-gray-900 line-clamp-1">
                      {{ product.name }}
                    </h3>
                    <span class="text-xs font-semibold text-gray-900 whitespace-nowrap">
                      ฿{{ Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                    </span>
                  </div>
                  <p class="text-[11px] text-gray-500 font-light line-clamp-2 leading-relaxed">
                    {{ product.description || 'No description available.' }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <router-link 
                    :to="`/admin/product-form?id=${product.id}`" 
                    class="flex-1 py-1.5 border border-black bg-black text-white hover:bg-gray-800 text-xs font-medium rounded-sm text-center transition-colors cursor-pointer"
                  >
                    Edit
                  </router-link>
                  <button 
                    @click="deleteProduct(product.id)" 
                    class="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-medium rounded-sm transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>

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

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isLoading = ref(true)
const errorMessage = ref('')

const categories = ref([])
const products = ref([])
const selectedCategory = ref('')

onMounted(async () => {
  await loadCategories()
  await fetchProducts()
})

// Load Categories for Filter Options
const loadCategories = async () => {
  try {
    const res = await fetch('/api/categories')
    if (res.ok) {
      categories.value = await res.json()
    }
  } catch (err) {
    categories.value = [
      { id: 1, name: 'WOMEN' },
      { id: 2, name: 'MEN' },
      { id: 3, name: 'GIRLS' },
      { id: 4, name: 'BOYS' }
    ]
  }
}

// Fetch Products from Backend API
const fetchProducts = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const catId = selectedCategory.value
  const url = catId 
    ? `/api/products?admin=true&category_id=${catId}` 
    : '/api/products?admin=true'

  try {
    const res = await fetch(url)
    if (res.ok) {
      products.value = await res.json()
    } else {
      errorMessage.value = 'Failed to load products.'
    }
  } catch (err) {
    // Fallback Mock Products กรณีทดสอบฝั่ง Frontend
    products.value = [
      { 
        id: 1, 
        name: 'Silky Silk Evening Gown', 
        price: 12500, 
        category_name: 'WOMEN', 
        description: 'Crafted from 100% Mulberry silk. Cowl neckline.', 
        image_url: '/images/women.jpg' 
      },
      { 
        id: 2, 
        name: 'Elegance Lace Bridal Dress', 
        price: 24900, 
        category_name: 'NEW', 
        description: 'Intricate French lace detailing. Sweetheart neckline.', 
        image_url: '/images/newpage.jpg' 
      },
      { 
        id: 3, 
        name: 'Velvet Midnight Suit', 
        price: 18900, 
        category_name: 'MEN', 
        description: 'Premium cotton-velvet fabric. Tailored slim fit.', 
        image_url: '/images/men.jpg' 
      }
    ]
  } finally {
    isLoading.value = false
  }
}

// Sort products DESC (Z to A) by name
const sortedProducts = computed(() => {
  return [...products.value].sort((a, b) => (b.name || '').localeCompare(a.name || ''))
})

// Delete Product Handler
const deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      products.value = products.value.filter(p => p.id !== id)
    } else {
      alert('Error deleting product')
    }
  } catch (err) {
    products.value = products.value.filter(p => p.id !== id)
  }
}

const handleLogout = () => {
  router.push('/login')
}
</script>