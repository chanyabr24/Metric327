import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import AdminCategoriesView from '@/views/admin/AdminCategoriesView.vue'

// Mock axios
vi.mock('axios')

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/login', component: { template: '<div>Login</div>' } },
        { path: '/admin/category-form', component: { template: '<div>Category Form</div>' } }
    ]
})

describe('AdminCategoriesView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
        // Mock window.confirm และ window.alert ให้ตอบตกลงอัตโนมัติ
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        vi.spyOn(window, 'alert').mockImplementation(() => {})
    })

    it('renders loading state and fetches categories successfully', async () => {
        const mockCategories = [
            { id: 2, name: 'B Gown', description: 'Desc B', status: 'SHOW', image_url: 'b.jpg' },
            { id: 1, name: 'A Gown', description: 'Desc A', status: 'HIDE', image_url: '' }
        ]

        axios.get.mockResolvedValueOnce({ data: mockCategories })

        const wrapper = mount(AdminCategoriesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        // ตรวจสอบสถานะกำลังโหลด
        expect(wrapper.text()).toContain('Loading Categories...')

        // รอให้ axios ทำงานเสร็จและ DOM อัปเดต
        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        // ตรวจสอบว่าข้อมูลถูกเรียงลำดับตามตัวอักษร (A Gown มาก่อน B Gown)
        const categoryNames = wrapper.findAll('h3').map(el => el.text())
        expect(categoryNames[0]).toContain('A Gown')
        expect(categoryNames[1]).toContain('B Gown')
    })

    it('handles error when fetching categories fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'))

        const wrapper = mount(AdminCategoriesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Failed to load categories.')
    })

    it('toggles category status correctly', async () => {
        const mockCategories = [
            { id: 1, name: 'Wedding Gown', description: 'White dress', status: 'SHOW', image_url: '' }
        ]

        axios.get.mockResolvedValueOnce({ data: mockCategories })
        axios.put.mockResolvedValueOnce({})

        const wrapper = mount(AdminCategoriesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        // กดปุ่มเปลี่ยนสถานะ (HIDE)
        const toggleBtn = wrapper.find('button.border-gray-300')
        await toggleBtn.trigger('click')

        expect(axios.put).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/categories/1',
            expect.objectContaining({ status: 'HIDE' })
        )
    })

    it('deletes category correctly', async () => {
        const mockCategories = [
            { id: 1, name: 'Wedding Gown', description: 'White dress', status: 'SHOW', image_url: '' }
        ]

        axios.get.mockResolvedValueOnce({ data: mockCategories })
        axios.delete.mockResolvedValueOnce({})

        const wrapper = mount(AdminCategoriesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        // กดปุ่มลบ
        const deleteBtn = wrapper.find('button.bg-rose-50')
        await deleteBtn.trigger('click')

        expect(axios.delete).toHaveBeenCalledWith('http://127.0.0.1:8000/categories/1')
    })

    it('handles logout correctly', async () => {
        axios.get.mockResolvedValueOnce({ data: [] })
        localStorage.setItem('loggedInAdminId', '999')

        const pushSpy = vi.spyOn(router, 'push')

        const wrapper = mount(AdminCategoriesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))

        const logoutBtn = wrapper.find('aside button')
        await logoutBtn.trigger('click')

        expect(localStorage.getItem('loggedInAdminId')).toBeNull()
        expect(pushSpy).toHaveBeenCalledWith('/login')
    })
})