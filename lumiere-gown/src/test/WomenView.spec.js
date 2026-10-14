import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import WomenView from '@/views/WomenView.vue'

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

describe('WomenView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('fetches categories and filters products for WOMEN category successfully', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) {
                // ต้องตรงกับ currentCategoryName ใน WomenView.vue (ตัวพิมพ์ใหญ่ 'WOMEN')
                return Promise.resolve({ data: [{ id: 1, name: 'WOMEN' }] })
            }
            if (url.includes('/products/')) {
                return Promise.resolve({
                    data: [
                        { id: 501, name: 'Evening Silk Gown', price: 12500, category_id: 1, image_url: 'women.jpg' },
                        { id: 302, name: 'Tuxedo Suit', price: 8000, category_id: 3, image_url: 'men.jpg' }
                    ]
                })
            }
        })

        const wrapper = mount(WomenView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 80))
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.products.length).toBe(1)
        expect(wrapper.vm.products[0].name).toBe('Evening Silk Gown')
    })

    it('filters products based on search query', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) {
                return Promise.resolve({ data: [{ id: 1, name: 'WOMEN' }] })
            }
            if (url.includes('/products/')) {
                return Promise.resolve({
                    data: [
                        { id: 1, name: 'Bridal White Gown', price: 25000, category_id: 1, image_url: 'a.jpg' },
                        { id: 2, name: 'Cocktail Dress', price: 9500, category_id: 1, image_url: 'b.jpg' }
                    ]
                })
            }
        })

        const wrapper = mount(WomenView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 80))
        await wrapper.vm.$nextTick()

        const searchInput = wrapper.find('input[type="text"]')
        await searchInput.setValue('Bridal')
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.filteredProducts.length).toBe(1)
        expect(wrapper.vm.filteredProducts[0].name).toBe('Bridal White Gown')
    })

    it('toggles navigation drawer correctly', async () => {
        axios.get.mockResolvedValue({ data: [] })

        const wrapper = mount(WomenView, {
            global: { stubs: ['router-link'] }
        })

        const menuBtn = wrapper.find('button[aria-label="Open menu"]')
        await menuBtn.trigger('click')

        expect(wrapper.vm.isDrawerOpen).toBe(true)
    })
})