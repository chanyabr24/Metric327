import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import NewView from '@/views/NewView.vue'

vi.mock('axios')

const mockRoute = { query: {} }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

vi.mock('@/components/Drawer.vue', () => ({
    default: {
        name: 'Drawer',
        template: '<div class="drawer-stub"></div>'
    }
}))

describe('NewView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('fetches categories and filters products for NEW category successfully', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) {
                return Promise.resolve({ data: [{ id: 10, name: 'NEW' }] })
            }
            if (url.includes('/products/')) {
                return Promise.resolve({
                    data: [
                        { id: 401, name: 'Latest Arrival Gown', price: 9500, category_id: 10, image_url: 'new.jpg' },
                        { id: 102, name: 'Woman Dress', price: 1200, category_id: 1, image_url: 'woman.jpg' }
                    ]
                })
            }
        })

        const wrapper = mount(NewView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 80))
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.products.length).toBe(1)
        expect(wrapper.vm.products[0].name).toBe('Latest Arrival Gown')
    })

    it('filters products based on search query', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) {
                return Promise.resolve({ data: [{ id: 10, name: 'NEW' }] })
            }
            if (url.includes('/products/')) {
                return Promise.resolve({
                    data: [
                        { id: 1, name: 'Sparkling Edition', price: 12000, category_id: 10, image_url: 'a.jpg' },
                        { id: 2, name: 'Minimalist Silk', price: 8000, category_id: 10, image_url: 'b.jpg' }
                    ]
                })
            }
        })

        const wrapper = mount(NewView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 80))
        await wrapper.vm.$nextTick()

        const searchInput = wrapper.find('input[type="text"]')
        await searchInput.setValue('Sparkling')
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.filteredProducts.length).toBe(1)
        expect(wrapper.vm.filteredProducts[0].name).toBe('Sparkling Edition')
    })

    it('toggles navigation drawer correctly', async () => {
        axios.get.mockResolvedValue({ data: [] })

        const wrapper = mount(NewView, {
            global: { stubs: ['router-link'] }
        })

        const menuBtn = wrapper.find('button[aria-label="Open menu"]')
        await menuBtn.trigger('click')

        expect(wrapper.vm.isDrawerOpen).toBe(true)
    })
})