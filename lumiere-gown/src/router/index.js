import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GirlsView from '@/views/GirlsView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  { path: '/girls',
    name: 'girls', 
    component: GirlsView 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router