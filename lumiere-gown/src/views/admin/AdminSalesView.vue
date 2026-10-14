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
              class="flex items-center space-x-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <i class="bi bi-tag-fill text-base"></i>
            <span>Product Management</span>
          </router-link>

          <router-link
              to="/admin/sales"
              class="flex items-center space-x-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-sm bg-gray-100 text-black border-l-4 border-black"
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

          <!-- Page Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <p class="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
                Transaction Logs
              </p>
              <div class="flex items-center space-x-4 mt-1">
                <h1 class="text-xl md:text-2xl font-serif tracking-wide text-gray-900">
                  Sale History
                </h1>
                <button
                    @click="openModal()"
                    class="px-4 py-2 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors cursor-pointer"
                >
                  + Add Sale
                </button>
              </div>
            </div>

            <div class="text-left sm:text-right">
              <span class="text-[10px] font-semibold tracking-widest uppercase text-gray-400 block">
                Total Revenue
              </span>
              <span class="text-xl md:text-2xl font-serif font-semibold text-gray-900">
                ฿{{ totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </span>
            </div>
          </div>

          <!-- Sales Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-sm">
            <table class="w-full text-left text-xs font-sans">
              <caption>Sale History Transaction Records Table</caption>
              <thead class="bg-gray-50 text-gray-400 uppercase tracking-widest border-b border-gray-200 font-semibold text-[10px]">
              <tr>
                <th class="py-3.5 px-4">Transaction ID</th>
                <th class="py-3.5 px-4">Customer</th>
                <th class="py-3.5 px-4">Date & Time</th>
                <th class="py-3.5 px-4">Amount</th>
                <th class="py-3.5 px-4 text-right">Status</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-gray-800">
              <tr v-if="isLoading">
                <td colspan="6" class="py-8 text-center text-gray-400">
                  Loading sales data...
                </td>
              </tr>

              <tr v-else-if="sales.length === 0">
                <td colspan="6" class="py-8 text-center text-gray-400">
                  No sales records found.
                </td>
              </tr>

              <tr v-for="sale in sales" :key="sale.id" class="hover:bg-gray-50/80 transition-colors">
                <td class="py-4 px-4 font-mono text-gray-500">
                  #{{ sale.transaction_id }}
                </td>

                <td class="py-4 px-4">
                  <div class="font-medium text-gray-900">{{ sale.customer_name }}</div>
                  <div class="text-[10px] text-gray-400 uppercase tracking-wider">{{ sale.customer_type }}</div>
                </td>

                <td class="py-4 px-4 text-gray-500 font-light leading-relaxed">
                  {{ formatDate(sale.created_at) }}
                </td>

                <td class="py-4 px-4 font-semibold text-gray-900">
                  ฿{{ Number(sale.amount).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                </td>

                <td class="py-4 px-4 text-right">
                    <span
                        class="inline-block px-2.5 py-1 text-[9px] font-bold rounded-full tracking-wider uppercase border"
                        :class="getStatusBadgeClass(sale.status)"
                    >
                      {{ sale.status }}
                    </span>
                </td>

                <td class="py-4 px-4 text-right space-x-1 whitespace-nowrap">
                  <button
                      @click="openModal(sale)"
                      class="px-2.5 py-1 border border-gray-300 hover:border-black text-gray-700 hover:text-black rounded-sm transition-colors cursor-pointer"
                      title="Edit Sale"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                      @click="deleteSale(sale.id)"
                      class="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-sm transition-colors cursor-pointer"
                      title="Delete Sale"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

        </div>
      </main>

    </div>

    <!-- Sale Modal Dialog -->
    <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
        @click.self="isModalOpen = false"
    >
      <div class="bg-white w-full max-w-md rounded-sm shadow-xl p-6 space-y-6 relative">
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 class="text-sm font-semibold tracking-widest uppercase text-gray-900">
            {{ form.id ? 'Edit Sale' : 'Add Sale' }}
          </h2>
          <button
              @click="isModalOpen = false"
              class="text-gray-400 hover:text-black text-lg cursor-pointer"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="handleSaveSale" class="space-y-4">
          <div class="space-y-1">
            <label for="transaction-id" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
              Transaction ID
            </label>
            <input
                id="transaction-id"
                v-model="form.transaction_id"
                type="text"
                required
                placeholder="e.g. TXN-1001"
                class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div class="space-y-1">
            <label for="customer-name" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
              Customer Name
            </label>
            <input
                id="customer-name"
                v-model="form.customer_name"
                type="text"
                required
                placeholder="Customer Full Name"
                class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div class="space-y-1">
            <label for="customer-type" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
              Customer Type
            </label>
            <input
                id="customer-type"
                v-model="form.customer_type"
                type="text"
                required
                placeholder="e.g. Guest, Member, VIP"
                class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div class="space-y-1">
            <label for="amount" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
              Amount (฿)
            </label>
            <input
                id="amount"
                v-model.number="form.amount"
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div class="space-y-1">
            <label for="status" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
              Status
            </label>
            <select
                id="status"
                v-model="form.status"
                required
                class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black bg-white cursor-pointer"
            >
              <option value="PROCESSING">PROCESSING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div class="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button
                type="button"
                @click="isModalOpen = false"
                class="px-5 py-2.5 border border-gray-200 text-gray-600 hover:border-black hover:text-black text-xs font-semibold tracking-widest uppercase transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
                type="submit"
                :disabled="isSubmitting"
                class="px-6 py-2.5 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Sale' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isLoading = ref(true)
const isSubmitting = ref(false)
const isModalOpen = ref(false)

const sales = ref([])

const form = ref({
  id: null,
  transaction_id: '',
  customer_name: '',
  customer_type: 'Guest',
  amount: '',
  status: 'COMPLETED'
})

onMounted(() => {
  fetchSales()
})

const fetchSales = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('http://127.0.0.1:8000/sales/')
    sales.value = res.data
  } catch (err) {
    console.error("Error fetching sales:", err)
  } finally {
    isLoading.value = false
  }
}

const totalRevenue = computed(() => {
  return sales.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'PROCESSING':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

const openModal = (sale = null) => {
  if (sale) {
    form.value = {
      id: sale.id,
      transaction_id: sale.transaction_id,
      customer_name: sale.customer_name,
      customer_type: sale.customer_type,
      amount: sale.amount,
      status: sale.status
    }
  } else {
    // แก้ไขการใช้ Math.random() ให้ปลอดภัยยิ่งขึ้นด้วย crypto.getRandomValues()
    const randomBuffer = new Uint32Array(1)
    window.crypto.getRandomValues(randomBuffer)
    const randomNum = Math.floor(1000 + (randomBuffer[0] / (0xffffffff + 1)) * 9000)

    form.value = {
      id: null,
      transaction_id: `TXN-${randomNum}`,
      customer_name: '',
      customer_type: 'Guest',
      amount: '',
      status: 'COMPLETED'
    }
  }
  isModalOpen.value = true
}

const handleSaveSale = async () => {
  isSubmitting.value = true

  const payload = {
    transaction_id: form.value.transaction_id,
    customer_name: form.value.customer_name,
    customer_type: form.value.customer_type,
    amount: form.value.amount,
    status: form.value.status
  }

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/sales/${form.value.id}`, payload)
    } else {
      await axios.post('http://127.0.0.1:8000/sales/', payload)
    }

    isModalOpen.value = false
    fetchSales()
  } catch (err) {
    console.error(err)
    alert('Error saving sale record')
  } finally {
    isSubmitting.value = false
  }
}

const deleteSale = async (id) => {
  if (!confirm('Are you sure you want to delete this sale record?')) return

  try {
    await axios.delete(`http://127.0.0.1:8000/sales/${id}`)
    sales.value = sales.value.filter(s => s.id !== id)
  } catch (err) {
    console.error(err)
    alert('Error deleting sale record')
  }
}

const handleLogout = () => {
  localStorage.removeItem('loggedInAdminId')
  router.push('/login')
}
</script>