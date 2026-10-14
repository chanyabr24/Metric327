import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import AdminProductFormView from '@/views/admin/AdminProductFormView.vue'

vi.mock('axios')

const mockRoute = { query: {} }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

describe('AdminProductFormView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockRoute.query = {}
        vi.spyOn(window, 'alert').mockImplementation(() => {})
    })

    it('fetches categories and renders correctly for creating a new product', async () => {
        axios.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Gowns' }] })

        const wrapper = mount(AdminProductFormView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Add Product')
        expect(wrapper.find('button[type="submit"]').text()).toContain('SAVE PRODUCT')
    })

    it('fetches product data correctly when editing an existing product', async () => {
        mockRoute.query = { id: '8' }
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) return Promise.resolve({ data: [{ id: 1, name: 'Gowns' }] })
            if (url.includes('/products/')) return Promise.resolve({
                data: { name: 'Luxury Gown', description: 'Silk dress', price: 1500, category_id: 1, attribute: {} }
            })
        })

        const wrapper = mount(AdminProductFormView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Edit Product')
        expect(wrapper.find('input#productName').element.value).toBe('Luxury Gown')
    })

    it('submits new product successfully via POST', async () => {
        mockRoute.query = {}
        axios.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Gowns' }] })
        axios.post.mockResolvedValueOnce({})

        const wrapper = mount(AdminProductFormView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))

        await wrapper.find('input#productName').setValue('New Gown')
        await wrapper.find('textarea#productDesc').setValue('Beautiful dress')
        await wrapper.find('input#productPrice').setValue(2500)
        await wrapper.find('select#productCategory').setValue(1)

        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.post).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/products/',
            expect.objectContaining({ name: 'New Gown', price: 2500 })
        )
        expect(mockRouter.push).toHaveBeenCalledWith('/admin/products')
    })

    it('submits updated product successfully via PUT', async () => {
        mockRoute.query = { id: '3' }
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) return Promise.resolve({ data: [{ id: 1, name: 'Gowns' }] })
            if (url.includes('/products/')) return Promise.resolve({
                data: { name: 'Old', description: 'Old', price: 100, category_id: 1, attribute: {} }
            })
        })
        axios.put.mockResolvedValueOnce({})

        const wrapper = mount(AdminProductFormView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        await wrapper.find('input#productName').setValue('Updated Gown Name')
        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.put).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/products/3',
            expect.objectContaining({ name: 'Updated Gown Name' })
        )
    })

    it('handles logout correctly', async () => {
        mockRoute.query = {}
        axios.get.mockResolvedValueOnce({ data: [] })
        localStorage.setItem('loggedInAdminId', '555')

        const wrapper = mount(AdminProductFormView, {
            global: { stubs: ['router-link'] }
        })

        const logoutBtn = wrapper.find('aside button')
        await logoutBtn.trigger('click')

        expect(localStorage.getItem('loggedInAdminId')).toBeNull()
        expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
})