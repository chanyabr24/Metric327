<template>
  <div class="min-h-screen w-full bg-white flex text-gray-900 font-sans">
    
    <!-- Left Panel: Form -->
    <div class="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 relative">
      
      <!-- Back Link -->
      <router-link 
        to="/login" 
        class="absolute top-8 left-8 flex items-center text-xs font-semibold tracking-widest text-gray-500 hover:text-black uppercase transition-colors"
      >
        <i class="bi bi-chevron-left text-xs mr-1"></i> BACK TO LOGIN
      </router-link>

      <div class="w-full max-w-sm space-y-6">
        
        <!-- Brand & Title -->
        <div class="text-center space-y-2">
          <div class="font-serif text-2xl tracking-widest uppercase text-gray-900 mb-4">
            Lumière Gown
          </div>
          <h1 class="text-3xl font-serif tracking-wider text-gray-900">
            Reset Password
          </h1>
          <p class="text-xs font-light text-gray-500">
            Enter your email to receive a recovery code
          </p>
        </div>

        <!-- Alert Error Message -->
        <div 
          v-if="errorMessage" 
          class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center rounded-sm"
        >
          {{ errorMessage }}
        </div>

        <!-- Reset Form -->
        <form @submit.prevent="handleResetPassword" class="space-y-5">
          <div class="space-y-1">
            <label for="email" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
              Email Address
            </label>
            <input 
              v-model="email"
              type="email" 
              id="email" 
              required 
              autocomplete="email"
              placeholder="name@example.com"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full py-3 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {{ isSubmitting ? 'SENDING...' : 'GET CODE' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="relative flex items-center justify-center my-4">
          <div class="border-t border-gray-200 w-full"></div>
          <span class="bg-white px-3 text-[11px] text-gray-400 font-light lowercase absolute">or if you have the account</span>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <router-link 
            to="/login" 
            class="text-xs font-semibold tracking-widest uppercase text-gray-800 hover:text-amber-700 transition-colors underline underline-offset-4"
          >
            Log In
          </router-link>
        </div>

      </div>
    </div>

    <!-- Right Panel: Cover Image -->
    <div class="hidden md:block md:w-1/2 relative bg-gray-100">
      <img 
        src="/images/reset-password-pic.jpg" 
        alt="Lumière Gown" 
        class="w-full h-full object-cover"
        @error="$event.target.src = '/images/women.jpg'"
      />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleResetPassword = async () => {
  if (!email.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // นำทางไปยังหน้า verify-code พร้อมส่ง email ผ่าน Query Parameter
    router.push({
      path: '/verify-code',
      query: { email: email.value }
    })
  } catch (err) {
    errorMessage.value = 'Failed to process request. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>