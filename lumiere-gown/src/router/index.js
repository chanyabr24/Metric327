import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BoysView from '../views/BoysView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  { path: '/boys',
    name: 'boys',
    component: BoysView 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router