import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GirlsView from '@/views/GirlsView.vue'
import WomenView from '@/views/WomenView.vue'
import MenView from '@/views/MenView.vue'
import NewView from '@/views/NewView.vue'
import BoysView from '../views/BoysView.vue'

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
  {
    path: '/new',
    name: 'new',
    component: NewView
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