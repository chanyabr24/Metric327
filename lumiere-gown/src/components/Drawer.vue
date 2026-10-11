<template>
  <div>
    <!-- Backdrop Overlay -->
    <div 
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-40 transition-opacity" 
      @click="closeDrawer"
    ></div>

    <!-- Drawer Panel -->
    <div 
      class="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out p-6 flex flex-col"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Close Button -->
      <button 
        class="self-end text-2xl text-gray-600 hover:text-black mb-6 cursor-pointer"
        @click="closeDrawer"
        aria-label="Close menu"
      >
        <i class="bi bi-x"></i>
      </button>

      <!-- Navigation Links -->
      <nav class="flex flex-col space-y-4">
        <a 
          v-for="item in navItems" 
          :key="item.path" 
          :href="item.path"
          class="flex justify-between items-center text-gray-800 font-medium hover:text-amber-600 tracking-wider py-1 border-b border-gray-100"
          @click="closeDrawer"
        >
          <span>{{ item.label }}</span>
          <i class="bi bi-chevron-right text-xs"></i>
        </a>

        <a 
          href="/login" 
          class="text-gray-800 font-medium hover:text-amber-600 tracking-wider pt-2"
          @click="closeDrawer"
        >
          LOG IN
        </a>

        <hr class="my-4 border-gray-200" />

        <a 
          href="/contact" 
          class="text-gray-500 font-medium hover:text-black tracking-wider"
          @click="closeDrawer"
        >
          CONTACT
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const navItems = [
  { label: 'NEW', path: '/new' },
  { label: 'WOMEN', path: '/women' },
  { label: 'MEN', path: '/men' },
  { label: 'GIRLS', path: '/girls' },
  { label: 'BOYS', path: '/boys' }
]

const closeDrawer = () => {
  emit('close')
}

watch(() => props.isOpen, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : ''
})
</script>