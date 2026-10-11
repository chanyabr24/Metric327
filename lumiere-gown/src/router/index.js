import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WomenView from '../views/WomenView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  { path: '/women',
    name: 'women',
    component: WomenView 
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router