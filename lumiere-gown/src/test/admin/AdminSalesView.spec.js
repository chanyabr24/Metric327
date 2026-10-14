import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import AdminSalesView from '@/views/admin/AdminSalesView.vue'

// Mock axios
vi.mock('axios')

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/admin/sales', component: AdminSalesView },
        { path: '/login', component: { template: '<div>Login</div>' } }
    ]
})

describe('AdminSalesView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        vi.spyOn(window, 'alert').mockImplementation(() => {})
    })

    it('fetches sales data and calculates total revenue correctly', async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, transaction_id: 'TXN-001', customer_name: 'John Doe', customer_type: 'VIP', amount: 5000, status: 'COMPLETED', created_at: '2026-10-14T10:00:00Z' },
                { id: 2, transaction_id: 'TXN-002', customer_name: 'Jane Smith', customer_type: 'Guest', amount: 3000, status: 'PROCESSING', created_at: '2026-10-14T11:00:00Z' }
            ]
        })

        router.push('/admin/sales')
        await router.isReady()

        const wrapper = mount(AdminSalesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        expect(wrapper.text()).toContain('Loading sales data...')

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        // ตรวจสอบว่าแสดงชื่อและข้อมูลถูกต้อง
        expect(wrapper.text()).toContain('TXN-001')
        expect(wrapper.text()).toContain('John Doe')
        expect(wrapper.text()).toContain('8,000.00') // รวม Total Revenue (5000 + 3000)
    })

    it('opens modal to add a new sale and submits via POST successfully', async () => {
        axios.get.mockResolvedValueOnce({ data: [] })
        axios.post.mockResolvedValueOnce({})

        router.push('/admin/sales')
        await router.isReady()

        const wrapper = mount(AdminSalesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))

        // คลิกปุ่มเปิด Modal เพิ่ม Sale
        const addBtn = wrapper.find('button.bg-black')
        await addBtn.trigger('click')
        expect(wrapper.vm.isModalOpen).toBe(true)

        // กรอกข้อมูลฟอร์มใน Modal
        await wrapper.find('input#customer-name').setValue('Customer Test')
        await wrapper.find('input#amount').setValue(1500)

        // ส่งฟอร์ม
        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.post).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/sales/',
            expect.objectContaining({
                customer_name: 'Customer Test',
                amount: 1500
            })
        )
    })

    it('opens modal to edit an existing sale and submits via PUT successfully', async () => {
        const existingSale = { id: 10, transaction_id: 'TXN-999', customer_name: 'Old Name', customer_type: 'VIP', amount: 2000, status: 'COMPLETED' }
        axios.get.mockResolvedValueOnce({ data: [existingSale] })
        axios.put.mockResolvedValueOnce({})

        router.push('/admin/sales')
        await router.isReady()

        const wrapper = mount(AdminSalesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        // คลิกปุ่ม Edit ในตาราง
        const editBtn = wrapper.find('button.border-gray-300')
        await editBtn.trigger('click')
        expect(wrapper.vm.isModalOpen).toBe(true)

        // แก้ไขชื่อลูกค้า
        await wrapper.find('input#customer-name').setValue('Updated Name')
        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.put).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/sales/10',
            expect.objectContaining({
                customer_name: 'Updated Name'
            })
        )
    })

    it('deletes sale record successfully', async () => {
        axios.get.mockResolvedValueOnce({
            data: [{ id: 45, transaction_id: 'TXN-45', customer_name: 'Delete Me', amount: 100, status: 'CANCELLED' }]
        })
        axios.delete.mockResolvedValueOnce({})

        router.push('/admin/sales')
        await router.isReady()

        const wrapper = mount(AdminSalesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        // คลิกปุ่ม Delete
        const deleteBtn = wrapper.find('button.bg-rose-50')
        await deleteBtn.trigger('click')

        expect(axios.delete).toHaveBeenCalledWith('http://127.0.0.1:8000/sales/45')
    })

    it('handles logout correctly', async () => {
        axios.get.mockResolvedValueOnce({ data: [] })
        router.push('/admin/sales')
        await router.isReady()

        localStorage.setItem('loggedInAdminId', '111')
        const pushSpy = vi.spyOn(router, 'push')

        const wrapper = mount(AdminSalesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        const logoutBtn = wrapper.find('aside button')
        await logoutBtn.trigger('click')

        expect(localStorage.getItem('loggedInAdminId')).toBeNull()
        expect(pushSpy).toHaveBeenCalledWith('/login')
    })

    it('toggles mobile menu visibility when mobile menu button is clicked', async () => {
        axios.get.mockResolvedValueOnce({ data: [] })

        router.push('/admin/sales')
        await router.isReady()

        const wrapper = mount(AdminSalesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        // ค่าเริ่มต้นต้องเป็น false
        expect(wrapper.vm.isMobileMenuOpen).toBe(false)

        // ค้นหาปุ่ม Toggle บนมือถือแล้วกดคลิก
        const mobileToggleBtn = wrapper.find('button[aria-label="Toggle Navigation"]')
        await mobileToggleBtn.trigger('click')

        // ตรวจสอบว่าสถานะเปลี่ยนเป็น true
        expect(wrapper.vm.isMobileMenuOpen).toBe(true)
    })
})