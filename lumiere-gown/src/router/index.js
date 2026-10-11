import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GirlsView from '@/views/GirlsView.vue'
import WomenView from '@/views/WomenView.vue'
import MenView from '@/views/MenView.vue'


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
  { path: '/women',
    name: 'women',
    component: WomenView 
  },
  { path: '/men',
    name: 'men', 
    component: MenView 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router