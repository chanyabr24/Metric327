import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GirlsView from '@/views/GirlsView.vue'
import WomenView from '@/views/WomenView.vue'
import MenView from '@/views/MenView.vue'
import NewView from '@/views/NewView.vue'
import BoysView from '@/views/BoysView.vue'
import AccountView from '@/views/AccountView.vue'
import ContactView from '@/views/ContactView.vue'
import CartView from '@/views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import OrderCompleteView from '@/views/OrderCompleteView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'
import VerifyCodeView from '@/views/auth/VerifyCodeView.vue'
import AdminAccountView from '@/views/admin/AdminAccountView.vue'
import AdminCategoriesView from '@/views/admin/AdminCategoriesVIew.vue'
import AdminCategoryFormView from '@/views/admin/AdminCategoryFormView.vue'
import AdminProductsView from '@/views/admin/AdminProductsView.vue'
import AdminProductFormView from '@/views/admin/AdminProductFormView.vue'
import AdminSalesView from '@/views/admin/AdminSalesView.vue'

const routes = [
  { path: '/login', 
    name: 'login', 
    component: LoginView 
  },
  { path: '/register', 
    name: 'register', 
    component: RegisterView 
  },
  { path: '/reset-password', 
    name: 'reset-password', 
    component: ResetPasswordView 
  },
  { path: '/verify-code', 
    name: 'verify-code', 
    component: VerifyCodeView 
  },

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
  { path: '/account', 
    name: 'account', 
    component: AccountView 
  },
  { path: '/contact',
    name: 'contact', 
    component: ContactView 
  },
  { path: '/cart', 
    name: 'cart', 
    component: CartView 
  },
  { path: '/checkout', 
    name: 'checkout', 
    component: CheckoutView 
  },
  { path: '/product/:id', 
    name: 'product-detail', 
    component: ProductDetailView 
  },
  { path: '/order-complete', 
    name: 'order-complete', 
    component: OrderCompleteView 
  },

  { path: '/admin/account', 
    name: 'admin-account', 
    component: AdminAccountView 
  },
  { path: '/admin/categories',
    name: 'admin-categories', 
    component: AdminCategoriesView 
  },
  { path: '/admin/category-form', 
    name: 'admin-category-form', 
    component: AdminCategoryFormView 
  },
  { path: '/admin/products', 
    name: 'admin-products', 
    component: AdminProductsView 
  },
  { path: '/admin/product-form', 
    name: 'admin-product-form', 
    component: AdminProductFormView 
  },
  { path: '/admin/sales', 
    name: 'admin-sales', 
    component: AdminSalesView 
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router