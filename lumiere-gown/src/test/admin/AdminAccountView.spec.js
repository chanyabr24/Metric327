import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import AdminAccountView from "@/views/admin/AdminAccountView.vue";
// Mock axios เพื่อดักจับการยิง API
vi.mock('axios')

// สร้าง Vue Router จำลองสำหรับทดสอบ
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/login', component: { template: '<div>Login</div>' } },
        { path: '/admin/categories', component: { template: '<div>Categories</div>' } },
        { path: '/admin/products', component: { template: '<div>Products</div>' } },
        { path: '/admin/sales', component: { template: '<div>Sales</div>' } }
    ]
})

describe('AdminAccountView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    it('redirects to login if loggedInAdminId is missing in localStorage', async () => {
        const pushSpy = vi.spyOn(router, 'push')

        mount(AdminAccountView, {
            global: {
                plugins: [router]
            }
        })

        // รอให้ onMounted ทำงานเสร็จ
        await vi.dynamicImportSettled()

        expect(pushSpy).toHaveBeenCalledWith('/login')
    })

    it('fetches admin data and renders it correctly when loggedInAdminId exists', async () => {
        localStorage.setItem('loggedInAdminId', '123')

        // จำลองผลลัพธ์ที่ตอบกลับมาจาก API
        axios.get.mockResolvedValueOnce({
            data: {
                name: 'Chanya Software',
                email_address: 'chanya@metric.com',
                phone_number: '0812345678',
                employee_id: 'EMP-001'
            }
        })

        const wrapper = mount(AdminAccountView, {
            global: {
                plugins: [router]
            }
        })

        // รอให้ axios resolve ข้อมูล
        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        // ตรวจสอบว่าแสดงชื่อและข้อมูลถูกต้อง
        expect(wrapper.text()).toContain('Chanya')
        expect(wrapper.text()).toContain('chanya@metric.com')
        expect(wrapper.text()).toContain('0812345678')
        expect(wrapper.text()).toContain('EMP-001')
    })

    it('toggles mobile menu and handles logout correctly', async () => {
        localStorage.setItem('loggedInAdminId', '123')
        axios.get.mockResolvedValueOnce({ data: {} })

        const wrapper = mount(AdminAccountView, {
            global: {
                plugins: [router]
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))

        // ทดสอบคลิกปุ่มเปิดเมนวมือถือ
        const mobileToggleBtn = wrapper.find('button[aria-label="Toggle Navigation"]')
        await mobileToggleBtn.trigger('click')
        expect(wrapper.vm.isMobileMenuOpen).toBe(true)

        // ทดสอบกดปุ่ม Logout
        const pushSpy = vi.spyOn(router, 'push')
        const logoutBtn = wrapper.find('aside button')
        await logoutBtn.trigger('click')

        expect(localStorage.getItem('loggedInAdminId')).toBeNull()
        expect(pushSpy).toHaveBeenCalledWith('/login')
    })
})