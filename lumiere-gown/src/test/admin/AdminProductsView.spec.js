import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import AdminProductsView from '@/views/admin/AdminProductsView.vue'

vi.mock('axios')

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/admin/products', component: AdminProductsView },
        { path: '/admin/product-form', component: { template: '<div>Product Form</div>' } },
        { path: '/login', component: { template: '<div>Login</div>' } }
    ]
})

describe('AdminProductsView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(window, 'alert').mockImplementation(() => {})
    })

    it('fetches categories and products successfully, rendering the list correctly', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) {
                return Promise.resolve({ data: [{ id: 1, name: 'Wedding Gown' }] })
            }
            if (url.includes('/products/')) {
                return Promise.resolve({
                    data: [
                        { id: 101, name: 'Silk Dress', description: 'Long white dress', price: 3500, category_id: 1, image_url: '' }
                    ]
                })
            }
            return Promise.reject(new Error('Unknown endpoint'))
        })

        router.push('/admin/products')
        await router.isReady()

        const wrapper = mount(AdminProductsView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        expect(wrapper.text()).toContain('Loading products...')

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Silk Dress')
        expect(wrapper.text()).toContain('3,500.00')
        expect(wrapper.text()).toContain('Wedding Gown')
    })

    it('handles error when fetching products fails', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) {
                return Promise.resolve({ data: [] })
            }
            if (url.includes('/products/')) {
                return Promise.reject(new Error('Network Error'))
            }
            return Promise.reject(new Error('Unknown'))
        })

        router.push('/admin/products')
        await router.isReady()

        const wrapper = mount(AdminProductsView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Failed to load products. Please check connection.')
    })

    it('filters products by selected category', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) {
                return Promise.resolve({
                    data: [
                        { id: 1, name: 'Gowns' },
                        { id: 2, name: 'Suits' }
                    ]
                })
            }
            if (url.includes('/products/')) {
                return Promise.resolve({
                    data: [
                        { id: 1, name: 'Dress A', price: 1000, category_id: 1 },
                        { id: 2, name: 'Suit B', price: 2000, category_id: 2 }
                    ]
                })
            }
        })

        router.push('/admin/products')
        await router.isReady()

        const wrapper = mount(AdminProductsView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        const select = wrapper.find('select')
        await select.setValue(1)

        expect(wrapper.vm.products.length).toBe(1)
        expect(wrapper.vm.products[0].name).toBe('Dress A')
    })

    it('deletes product successfully when confirmed', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) return Promise.resolve({ data: [] })
            if (url.includes('/products/')) return Promise.resolve({
                data: [{ id: 55, name: 'Item to delete', price: 500, category_id: 1 }]
            })
        })
        axios.delete.mockResolvedValueOnce({})

        router.push('/admin/products')
        await router.isReady()

        const wrapper = mount(AdminProductsView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        const deleteBtn = wrapper.find('button.bg-rose-50')
        await deleteBtn.trigger('click')

        expect(axios.delete).toHaveBeenCalledWith('http://127.0.0.1:8000/products/55')
    })

    it('does not delete product if confirmation is cancelled', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false)

        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) return Promise.resolve({ data: [] })
            if (url.includes('/products/')) return Promise.resolve({
                data: [{ id: 55, name: 'Item to delete', price: 500, category_id: 1 }]
            })
        })

        router.push('/admin/products')
        await router.isReady()

        const wrapper = mount(AdminProductsView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        const deleteBtn = wrapper.find('button.bg-rose-50')
        await deleteBtn.trigger('click')

        expect(axios.delete).not.toHaveBeenCalled()
    })

    it('handles error when deleting product fails', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) return Promise.resolve({ data: [] })
            if (url.includes('/products/')) return Promise.resolve({
                data: [{ id: 55, name: 'Item to delete', price: 500, category_id: 1 }]
            })
        })
        axios.delete.mockRejectedValueOnce(new Error('Delete failed'))

        router.push('/admin/products')
        await router.isReady()

        const wrapper = mount(AdminProductsView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        const deleteBtn = wrapper.find('button.bg-rose-50')
        await deleteBtn.trigger('click')

        await new Promise(resolve => setTimeout(resolve, 20))
        expect(alertSpy).toHaveBeenCalled()
    })

    it('handles logout correctly', async () => {
        axios.get.mockResolvedValue({ data: [] })
        router.push('/admin/products')
        await router.isReady()

        localStorage.setItem('loggedInAdminId', '999')
        const pushSpy = vi.spyOn(router, 'push')

        const wrapper = mount(AdminProductsView, {
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
})