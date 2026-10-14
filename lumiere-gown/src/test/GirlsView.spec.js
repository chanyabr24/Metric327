import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import GirlsView from '@/views/GirlsView.vue'

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

describe('GirlsView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('fetches categories and filters products for GIRLS category successfully', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) {
                // ต้องตรงกับ currentCategoryName ใน GirlsView.vue (ตัวพิมพ์ใหญ่ 'GIRLS')
                return Promise.resolve({ data: [{ id: 4, name: 'GIRLS' }] })
            }
            if (url.includes('/products/')) {
                return Promise.resolve({
                    data: [
                        { id: 201, name: 'Princess Gown', price: 1200, category_id: 4, image_url: 'girl.jpg' },
                        { id: 102, name: 'Woman Dress', price: 1200, category_id: 1, image_url: 'woman.jpg' }
                    ]
                })
            }
        })

        const wrapper = mount(GirlsView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 80))
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.products.length).toBe(1)
        expect(wrapper.vm.products[0].name).toBe('Princess Gown')
    })

    it('filters products based on search query', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) {
                return Promise.resolve({ data: [{ id: 4, name: 'GIRLS' }] })
            }
            if (url.includes('/products/')) {
                return Promise.resolve({
                    data: [
                        { id: 1, name: 'Floral Dress', price: 900, category_id: 4, image_url: 'a.jpg' },
                        { id: 2, name: 'Pink Ribbon Dress', price: 1100, category_id: 4, image_url: 'b.jpg' }
                    ]
                })
            }
        })

        const wrapper = mount(GirlsView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 80))
        await wrapper.vm.$nextTick()

        const searchInput = wrapper.find('input[type="text"]')
        await searchInput.setValue('Floral')
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.filteredProducts.length).toBe(1)
        expect(wrapper.vm.filteredProducts[0].name).toBe('Floral Dress')
    })

    it('toggles navigation drawer correctly', async () => {
        axios.get.mockResolvedValue({ data: [] })

        const wrapper = mount(GirlsView, {
            global: { stubs: ['router-link'] }
        })

        const menuBtn = wrapper.find('button[aria-label="Open menu"]')
        await menuBtn.trigger('click')

        expect(wrapper.vm.isDrawerOpen).toBe(true)
    })
})