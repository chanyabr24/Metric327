<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans flex flex-col justify-between">
    <!-- Header -->
    <header class="border-b border-gray-100 py-4 px-6 sticky top-0 bg-white z-30">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <router-link
          to="/cart"
          class="text-xs font-semibold tracking-wider text-gray-700 hover:text-black uppercase flex items-center space-x-2"
        >
          <i class="bi bi-arrow-left text-base"></i>
          <span>Back to Cart</span>
        </router-link>

        <router-link to="/" class="text-xl font-serif tracking-widest uppercase">
          LUMIÈRE GOWN
        </router-link>

        <div class="w-24 hidden md:block"></div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-10 w-full flex-grow">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        <!-- LEFT COLUMN: Forms -->
        <div class="lg:col-span-7 space-y-10">

          <!-- SECTION 01: My Information -->
          <section class="space-y-4">
            <h2 class="text-xs font-semibold tracking-widest uppercase text-gray-800 border-b border-gray-100 pb-2">
              01 / My Information
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="firstName" class="text-[10px] font-medium tracking-widest uppercase text-gray-500">
                  First Name
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  id="firstName"
                  class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div class="space-y-1">
                <label for="lastName" class="text-[10px] font-medium tracking-widest uppercase text-gray-500">
                  Last Name
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  id="lastName"
                  class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div class="md:col-span-2 space-y-1">
                <label for="email" class="text-[10px] font-medium tracking-widest uppercase text-gray-500">
                  Email Address
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          </section>

          <!-- SECTION 02: Shipping Address -->
          <section class="space-y-4">
            <h2 class="text-xs font-semibold tracking-widest uppercase text-gray-800 border-b border-gray-100 pb-2">
              02 / Shipping Address
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2 space-y-1">
                <label for="street" class="text-[10px] font-medium tracking-widest uppercase text-gray-500">
                  Street & House Number
                </label>
                <input
                  v-model="form.street"
                  type="text"
                  id="street"
                  class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div class="space-y-1">
                <label for="postalCode" class="text-[10px] font-medium tracking-widest uppercase text-gray-500">
                  Postal Code
                </label>
                <input
                  v-model="form.postalCode"
                  type="text"
                  id="postalCode"
                  class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div class="space-y-1">
                <label for="city" class="text-[10px] font-medium tracking-widest uppercase text-gray-500">
                  City
                </label>
                <input
                  v-model="form.city"
                  type="text"
                  id="city"
                  class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div class="md:col-span-2 space-y-1">
                <label for="country" class="text-[10px] font-medium tracking-widest uppercase text-gray-500">
                  Country
                </label>
                <input
                  v-model="form.country"
                  type="text"
                  id="country"
                  class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          </section>

          <!-- SECTION 03: Payment -->
          <section class="space-y-4">
            <h2 class="text-xs font-semibold tracking-widest uppercase text-gray-800 border-b border-gray-100 pb-2">
              03 / Payment
            </h2>
            <div class="space-y-3">
              <label
                class="flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors"
                :class="form.paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200'"
              >
                <div class="flex items-center space-x-3">
                  <input
                    v-model="form.paymentMethod"
                    type="radio"
                    value="card"
                    class="accent-black"
                  />
                  <span class="text-sm font-medium text-gray-800">Credit Card</span>
                </div>
                <div class="flex space-x-1">
                  <div class="w-8 h-5 bg-gray-200 rounded-xs"></div>
                  <div class="w-8 h-5 bg-gray-200 rounded-xs"></div>
                </div>
              </label>

              <label
                class="flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors"
                :class="form.paymentMethod === 'paypal' ? 'border-black bg-gray-50' : 'border-gray-200'"
              >
                <div class="flex items-center space-x-3">
                  <input
                    v-model="form.paymentMethod"
                    type="radio"
                    value="paypal"
                    class="accent-black"
                  />
                  <span class="text-sm font-medium text-gray-800">PayPal</span>
                </div>
                <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-xs tracking-wider uppercase">
                  EXPRESS
                </span>
              </label>
            </div>
          </section>

        </div>

        <!-- RIGHT COLUMN: Order Summary -->
        <div class="lg:col-span-5">
          <aside class="border border-gray-200 p-6 bg-white rounded-sm space-y-6 sticky top-20">
            <h2 class="text-xs font-semibold tracking-widest uppercase text-gray-800 border-b border-gray-100 pb-3">
              Order Summary
            </h2>

            <!-- Items -->
            <div class="space-y-4 max-h-80 overflow-y-auto divide-y divide-gray-100 pr-1">
              <template v-if="cart.length > 0">
                <div
                  v-for="item in cart"
                  :key="item.id"
                  class="flex space-x-4 pt-4 first:pt-0"
                >
                  <div class="w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100 rounded-sm">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                      @error="$event.target.src = '/images/women.jpg'"
                    />
                  </div>
                  <div class="flex-grow space-y-1">
                    <h3 class="text-xs font-medium text-gray-800 uppercase line-clamp-1">
                      {{ item.name }}
                    </h3>
                    <p class="text-[11px] text-gray-500 font-light leading-tight">
                      Qty: {{ item.qty }}
                      <span v-if="item.color"><br />Color: {{ item.color }}</span>
                      <span v-if="item.size"><br />Size: {{ item.size }}</span>
                    </p>
                    <p class="text-xs font-medium text-gray-900">
                      ฿{{ (item.price * item.qty).toLocaleString() }}.00
                    </p>
                  </div>
                </div>
              </template>
              <div v-else class="text-xs text-gray-400 py-4 text-center">
                Your cart is empty.
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-3 border-t border-gray-100 pt-4 text-xs">
              <div class="flex justify-between text-gray-500">
                <span>Order Value</span>
                <span class="font-medium text-gray-900">฿{{ subtotal.toLocaleString() }}.00</span>
              </div>
              <div class="flex justify-between text-gray-500 pb-3 border-b border-gray-100">
                <span>Shipping</span>
                <span class="font-medium text-gray-900">Free</span>
              </div>
              <div class="flex justify-between items-center text-sm font-semibold text-gray-900 pt-1">
                <span class="text-xs font-bold tracking-widest uppercase text-gray-500">Total</span>
                <span class="text-base font-sans">฿{{ subtotal.toLocaleString() }}.00</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              @click="handleConfirmPurchase"
              :disabled="isProcessing || cart.length === 0"
              class="w-full py-3 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {{ isProcessing ? 'PROCESSING...' : 'CONFIRM PURCHASE' }}
            </button>
          </aside>
        </div>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isProcessing = ref(false)
const cart = ref([])

const form = ref({
  firstName: '', lastName: '', email: '',
  street: '', postalCode: '', city: '', country: '',
  paymentMethod: 'card'
})

onMounted(() => {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    try { cart.value = JSON.parse(savedCart) } catch (e) { cart.value = [] }
  }
})

const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.qty, 0))

const handleConfirmPurchase = async () => {
  if (cart.value.length === 0) return
  isProcessing.value = true

  const customerName = `${form.value.firstName} ${form.value.lastName}`.trim() || 'Guest'

  // แก้ไขวิธีสุ่มด้วย crypto.getRandomValues ให้ถูกต้อง
  const randomBuffer = new Uint32Array(1)
  window.crypto.getRandomValues(randomBuffer)
  const txnId = `TXN-${1000 + (randomBuffer[0] % 9000)}`

  try {
    // บันทึกลงตาราง Sales
    await axios.post('http://127.0.0.1:8000/sales/', {
      transaction_id: txnId,
      customer_name: customerName,
      customer_type: 'Web Customer',
      amount: subtotal.value,
      status: 'PROCESSING'
    })

    // ล้างตะกร้า แล้วพาไปหน้า Success
    localStorage.removeItem('cart')
    router.push('/order-complete')

  } catch (err) {
    alert('Cannot place order. Please check connection.')
    console.error(err)
    isProcessing.value = false
  }
}
</script>