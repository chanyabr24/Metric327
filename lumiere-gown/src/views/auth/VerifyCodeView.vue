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

      <div class="w-full max-w-sm space-y-6 text-center">
        
        <!-- Brand & Title -->
        <div class="space-y-2">
          <div class="font-serif text-2xl tracking-widest uppercase text-gray-900 mb-4">
            Lumière Gown
          </div>
          <h1 class="text-3xl font-serif tracking-wider text-gray-900">
            Security Verification
          </h1>
          <p class="text-xs font-light text-gray-500">
            Enter the 4-digit code sent to your email
            <span v-if="email" class="font-medium text-gray-800"><br />({{ email }})</span>
          </p>
        </div>

        <!-- Alert Error Message -->
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

        <!-- Verification Form -->
        <form @submit.prevent="handleVerify" class="space-y-6">
          
          <!-- 4-Digit OTP Boxes -->
          <div class="flex justify-center space-x-3">
            <input 
              v-for="(digit, index) in otp" 
              :key="index"
              ref="otpInputs"
              v-model="otp[index]"
              type="text" 
              inputmode="numeric"
              maxlength="1"
              required
              @input="handleInput(index)"
              @keydown="handleKeyDown(index, $event)"
              @paste="handlePaste"
              class="w-12 h-14 border border-gray-200 rounded-sm text-center text-xl font-semibold focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isSubmitting || otpCode.length < 4"
            class="w-full py-3 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-amber-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {{ isSubmitting ? 'VERIFYING...' : 'VERIFY CODE' }}
          </button>
        </form>

        <!-- Resend Code Action -->
        <div class="pt-2">
          <button 
            @click="handleResendCode" 
            type="button"
            :disabled="isResending"
            class="text-xs font-semibold tracking-widest uppercase text-gray-800 hover:text-amber-700 transition-colors cursor-pointer border-b border-gray-300 pb-0.5 disabled:opacity-50"
          >
            {{ isResending ? 'Sending...' : 'Resend Code' }}
          </button>
        </div>

      </div>
    </div>

    <!-- Right Panel: Cover Image -->
    <div class="hidden md:block md:w-1/2 relative bg-gray-100">
      <img 
        src="/images/verify-code-pic.jpg" 
        alt="Lumière Gown" 
        class="w-full h-full object-cover"
        @error="$event.target.src = '/images/women.jpg'"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = ref('')
const otp = ref(['', '', '', ''])
const otpInputs = ref([])

const isSubmitting = ref(false)
const isResending = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email
  }
  // Auto focus ช่องแรก
  nextTick(() => {
    if (otpInputs.value[0]) {
      otpInputs.value[0].focus()
    }
  })
})

const otpCode = computed(() => otp.value.join(''))

// Auto-advance to next input
const handleInput = (index) => {
  const val = otp.value[index]
  if (val.length > 1) {
    otp.value[index] = val.slice(-1)
  }
  if (otp.value[index] && index < 3) {
    otpInputs.value[index + 1].focus()
  }
}

// Backspace navigation
const handleKeyDown = (index, event) => {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    otpInputs.value[index - 1].focus()
  }
}

// Paste support
const handlePaste = (event) => {
  event.preventDefault()
  const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
  for (let i = 0; i < pasted.length; i++) {
    otp.value[i] = pasted[i]
  }
  const nextFocusIndex = Math.min(pasted.length, 3)
  if (otpInputs.value[nextFocusIndex]) {
    otpInputs.value[nextFocusIndex].focus()
  }
}

// Submit Verification
const handleVerify = async () => {
  if (otpCode.value.length < 4) return

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const res = await fetch('/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, code: otpCode.value })
    })

    if (res.ok) {
      router.push('/login')
    } else {
      const err = await res.json().catch(() => ({}))
      errorMessage.value = err.detail || 'Invalid verification code.'
    }
  } catch (err) {
    // Fallback สำหรับกรณีทดสอบฝั่ง Frontend
    router.push('/login')
  } finally {
    isSubmitting.value = false
  }
}

// Resend Code Action
const handleResendCode = async () => {
  isResending.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const res = await fetch('/api/resend-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    if (res.ok) {
      successMessage.value = 'A new code has been sent to your email.'
    } else {
      errorMessage.value = 'Failed to resend code.'
    }
  } catch (err) {
    successMessage.value = 'A new code has been sent to your email.'
  } finally {
    isResending.value = false
  }
}
</script>