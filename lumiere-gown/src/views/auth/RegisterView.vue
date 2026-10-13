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
            Join the exclusive world of luxe
          </p>
          <h1 class="text-3xl font-serif tracking-wider text-gray-900">
            Create Account
          </h1>
        </div>

        <!-- Error Message Alert -->
        <div 
          v-if="errorMessage" 
          class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center rounded-sm"
        >
          {{ errorMessage }}
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          
          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label for="firstName" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                First Name
              </label>
              <input 
                v-model="form.first_name"
                type="text" 
                id="firstName" 
                required 
                autocomplete="given-name"
                class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div class="space-y-1">
              <label for="lastName" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
                Last Name
              </label>
              <input 
                v-model="form.last_name"
                type="text" 
                id="lastName" 
                autocomplete="family-name"
                class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

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
              class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-1">
            <label for="password" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
              Password
            </label>
            <input 
              v-model="form.password"
              type="password" 
              id="password" 
              required 
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-1">
            <label for="passwordConfirm" class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 block">
              Confirm Password
            </label>
            <input 
              v-model="form.passwordConfirm"
              type="password" 
              id="passwordConfirm" 
              required 
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full py-3 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors disabled:opacity-50 cursor-pointer pt-3"
          >
            {{ isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="relative flex items-center justify-center my-3">
          <div class="border-t border-gray-200 w-full"></div>
          <span class="bg-white px-3 text-xs text-gray-400 font-light lowercase absolute">or</span>
        </div>

        <!-- Login Link -->
        <div class="text-center space-x-1">
          <span class="text-xs text-gray-500 font-light">Already have an account?</span>
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
        src="/images/register-picture.jpg" 
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

const form = ref({
  first_name: '',
  last_name: '',
  email_address: '',
  password: '',
  passwordConfirm: ''
})

const handleRegister = async () => {
  if (form.value.password !== form.value.passwordConfirm) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const userData = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email_address: form.value.email_address,
      password: form.value.password,
    }

    await axios.post('http://127.0.0.1:8000/users/', userData)
    router.push('/login')
    
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      errorMessage.value = error.response.data.detail
    } else {
      errorMessage.value = 'An error occurred during registration. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>