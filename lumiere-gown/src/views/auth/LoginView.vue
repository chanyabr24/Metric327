<template>
  <div class="min-h-screen w-full bg-white flex text-gray-900 font-sans">
    
    <!-- Left Panel: Form -->
    <div class="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 relative">
      
      <!-- Back Link -->
      <router-link 
        to="/" 
        class="absolute top-8 left-8 flex items-center text-xs font-semibold tracking-widest text-gray-500 hover:text-black uppercase transition-colors"
      >
        <i class="bi bi-chevron-left text-xs mr-1"></i> BACK
      </router-link>

      <div class="w-full max-w-sm space-y-6">
        
        <!-- Brand & Title -->
        <div class="text-center space-y-2">
          <div class="font-serif text-2xl tracking-widest uppercase text-gray-900">
            Lumière Gown
          </div>
          <p class="text-xs font-medium tracking-widest text-gray-400 uppercase pt-2">
            Welcome Back
          </p>
          <h1 class="text-3xl font-serif tracking-wider text-gray-900">
            Log In
          </h1>
        </div>

        <!-- Alert Messages -->
        <div 
          v-if="errorMessage" 
          class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center rounded-sm"
        >
          {{ errorMessage }}
        </div>

        <div 
          v-if="successMessage" 
          class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs text-center rounded-sm"
        >
          {{ successMessage }}
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          
          <!-- Email Field -->
          <div class="space-y-1">
            <label for="email" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
              Email Address
            </label>
            <input 
              v-model="form.email_address"
              type="email" 
              id="email" 
              required 
              autocomplete="email"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-1">
            <div class="flex justify-between items-center">
              <label for="password" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                Password
              </label>
              <router-link 
                to="/reset-password" 
                class="text-[11px] text-gray-400 hover:text-black transition-colors"
              >
                Forgot?
              </router-link>
            </div>
            <input 
              v-model="form.password"
              type="password" 
              id="password" 
              required 
              autocomplete="current-password"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full py-3 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {{ isSubmitting ? 'LOGGING IN...' : 'LOG IN' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="relative flex items-center justify-center my-4">
          <div class="border-t border-gray-200 w-full"></div>
          <span class="bg-white px-3 text-xs text-gray-400 font-light lowercase absolute">or</span>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <router-link 
            to="/register" 
            class="text-xs font-semibold tracking-widest uppercase text-gray-800 hover:text-amber-700 transition-colors border-b border-gray-300 pb-0.5"
          >
            Register Account
          </router-link>
        </div>

      </div>
    </div>

    <!-- Right Panel: Cover Image -->
    <div class="hidden md:block md:w-1/2 relative bg-gray-100">
      <img 
        src="/images/login-photo.jpg" 
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
import axios from 'axios'

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
  email_address: '',
  password: ''
})

const handleLogin = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // โยนอีเมลและรหัสผ่านไปให้ Backend จัดการเช็กให้
    const res = await axios.post('http://127.0.0.1:8000/login/', {
      email_address: form.value.email_address,
      password: form.value.password
    })
    
    // Backend จะตอบกลับมาว่าเป็นใคร
    if (res.data.role === 'admin') {
      localStorage.setItem('loggedInAdminId', res.data.id)
      router.push('/admin/account')
    } else {
      localStorage.setItem('loggedInUserId', res.data.id)
      router.push('/account')
    }
    
  } catch (err) {
    if (err.response && err.response.data && err.response.data.detail) {
      errorMessage.value = err.response.data.detail
    } else {
      errorMessage.value = 'Cannot connect to server.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>