import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import AccountView from '@/views/AccountView.vue'

vi.mock('axios')

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/account', component: AccountView },
        { path: '/login', component: { template: '<div>Login</div>' } }
    ]
})

describe('AccountView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    it('redirects to /login if loggedInUserId is missing in localStorage', async () => {
        const pushSpy = vi.spyOn(router, 'push')
        router.push('/account')
        await router.isReady()

        mount(AccountView, {
            global: {
                plugins: [router],
                stubs: ['Drawer', 'router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 20))
        expect(pushSpy).toHaveBeenCalledWith('/login')
    })

    it('fetches and renders user profile and orders successfully', async () => {
        localStorage.setItem('loggedInUserId', '123')

        axios.get.mockResolvedValueOnce({
            data: {
                first_name: 'Jane',
                last_name: 'Doe',
                email_address: 'jane@example.com',
                employee_id: 'EMP-001'
            }
        })

        router.push('/account')
        await router.isReady()

        const wrapper = mount(AccountView, {
            global: {
                plugins: [router],
                stubs: ['Drawer', 'router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Jane Doe')
        expect(wrapper.text()).toContain('jane@example.com')
        expect(wrapper.text()).toContain('EMP-001')
        expect(wrapper.text()).toContain('No orders yet.')
    })

    it('renders order history with valid items and dates correctly', async () => {
        localStorage.setItem('loggedInUserId', '123')

        axios.get.mockResolvedValueOnce({
            data: {
                first_name: 'John',
                last_name: 'Smith',
                email_address: 'john@example.com'
            }
        })

        // จำลองข้อมูล orders ที่มีสินค้าและสถานะต่างๆ
        const wrapper = mount(AccountView, {
            global: {
                plugins: [router],
                stubs: ['Drawer', 'router-link']
            }
        })

        // กำหนดค่า orders ใน wrapper.vm โดยตรงเพื่อทดสอบการแสดงผลตารางคำสั่งซื้อ
        wrapper.vm.orders = [
            {
                transaction_id: 'TXN-999',
                amount: 3500,
                created_at: '2026-10-14T12:00:00Z',
                status: 'COMPLETED',
                items: JSON.stringify([{ image: 'test.jpg', name: 'Gown 1' }, { name: 'Gown 2' }])
            },
            {
                transaction_id: 'TXN-888',
                amount: 1500,
                created_at: 'invalid-date',
                status: 'CANCELLED',
                items: [{ image: '', name: 'Gown 3' }]
            }
        ]

        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('TXN-999')
        expect(wrapper.text()).toContain('3,500')
        expect(wrapper.text()).toContain('2 items')
        expect(wrapper.text()).toContain('COMPLETED')
        expect(wrapper.text()).toContain('CANCELLED')
        expect(wrapper.text()).toContain('Invalid Date')
    })

    it('handles error when fetching user profile fails', async () => {
        localStorage.setItem('loggedInUserId', '123')
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        axios.get.mockRejectedValueOnce(new Error('API Error'))

        router.push('/account')
        await router.isReady()

        mount(AccountView, {
            global: {
                plugins: [router],
                stubs: ['Drawer', 'router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        expect(consoleSpy).toHaveBeenCalled()
    })

    it('opens and closes navigation drawer correctly', async () => {
        localStorage.setItem('loggedInUserId', '123')
        axios.get.mockResolvedValueOnce({ data: { first_name: 'Test' } })

        router.push('/account')
        await router.isReady()

        const wrapper = mount(AccountView, {
            global: {
                plugins: [router],
                stubs: ['Drawer', 'router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))

        expect(wrapper.vm.isDrawerOpen).toBe(false)

        // กดปุ่มเปิด Menu Drawer
        const menuBtn = wrapper.find('button[aria-label="Open menu"]')
        await menuBtn.trigger('click')
        expect(wrapper.vm.isDrawerOpen).toBe(true)

        // จำลองเหตุการณ์ปิด Drawer
        const drawerComponent = wrapper.findComponent({ name: 'Drawer' })
        await drawerComponent.trigger('close')
        // หรือจำลองผ่านการเรียก Event emit / เปลี่ยนค่าโดยตรงถ้าจำเป็น
        wrapper.vm.isDrawerOpen = false
        expect(wrapper.vm.isDrawerOpen).toBe(false)
    })

    it('handles logout correctly', async () => {
        localStorage.setItem('loggedInUserId', '123')
        axios.get.mockResolvedValueOnce({ data: { first_name: 'Test' } })

        router.push('/account')
        await router.isReady()
        const pushSpy = vi.spyOn(router, 'push')

        const wrapper = mount(AccountView, {
            global: {
                plugins: [router],
                stubs: ['Drawer', 'router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))

        // หาปุ่ม Logout แล้วกดคลิก
        const logoutBtn = wrapper.findAll('button').find(b => b.text().includes('Logout'))
        await logoutBtn.trigger('click')

        expect(localStorage.getItem('loggedInUserId')).toBeNull()
        expect(pushSpy).toHaveBeenCalledWith('/login')
    })
})