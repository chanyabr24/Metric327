<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans flex flex-col justify-between">
    <!-- Header -->
    <header class="py-5 px-6 border-b border-gray-100 text-center sticky top-0 bg-white z-30">
      <router-link to="/" class="text-xl font-serif tracking-widest uppercase">
        LUMIÈRE GOWN
      </router-link>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col items-center justify-center px-6 py-20 text-center max-w-lg mx-auto">
      
      <!-- Check Icon Circle -->
      <div class="w-18 h-18 rounded-full border border-gray-300 flex items-center justify-center mb-8 bg-white shadow-xs animate-pop-in">
        <i class="bi bi-check text-2xl text-gray-700"></i>
      </div>

      <!-- Thank You Title -->
      <h1 class="text-3xl md:text-4xl font-serif font-normal text-gray-900 mb-4 tracking-tight animate-fade-up">
        Thank you for ordering!
      </h1>

      <!-- Order Message -->
      <p class="text-xs md:text-sm font-light text-gray-500 leading-relaxed mb-10 max-w-md animate-fade-up-delay-1">
        Your order <strong class="font-semibold text-gray-900">#{{ transactionId }}</strong> has been confirmed.
        We've sent a confirmation email to your inbox with the tracking details.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto animate-fade-up-delay-2">
        <router-link 
          to="/account" 
          class="px-8 py-3.5 border border-black text-black hover:bg-black hover:text-white transition-colors text-xs tracking-widest uppercase font-medium min-w-[170px]"
        >
          View Order
        </router-link>
        
        <router-link 
          to="/" 
          class="px-8 py-3.5 bg-black text-white hover:bg-gray-800 transition-colors text-xs tracking-widest uppercase font-medium min-w-[170px]"
        >
          CONTINUE SHOPPING
        </router-link>
      </div>

    </main>

    <!-- Simple Footer -->
    <footer class="py-8 border-t border-gray-100 text-center">
      <p class="text-xs text-gray-400 font-light tracking-wider">
        © 2026 LUMIERE GOWN. ALL RIGHTS RESERVED.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const transactionId = ref('')

onMounted(() => {
  // เคลียร์ cart ใน localStorage หลังสั่งซื้อสำเร็จ
  localStorage.removeItem('cart')

  // สุ่ม Transaction ID Mockup หรือดึงจาก Route Query Parameter (ถ้ามี)
  const randomBuffer = new Uint32Array(1)
  window.crypto.getRandomValues(randomBuffer)
  const randomId = 100000 + (randomBuffer[0] % 900000)
  transactionId.value = randomId.toString()
})
</script>

<style scoped>
@keyframes popIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-pop-in {
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.animate-fade-up {
  animation: fadeUp 0.5s 0.15s ease both;
}

.animate-fade-up-delay-1 {
  animation: fadeUp 0.5s 0.25s ease both;
}

.animate-fade-up-delay-2 {
  animation: fadeUp 0.5s 0.35s ease both;
}
</style>