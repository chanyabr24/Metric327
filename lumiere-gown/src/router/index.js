import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MenView from '../views/MenView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {path: '/men',
    name: 'men', 
    component: MenView 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router