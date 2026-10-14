import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminProductsView from '@/views/admin/AdminProductsView.vue'
import axios from 'axios'

vi.mock('axios')
vi.mock('vue-router', () => ({
    useRouter: vi.fn(() => ({ push: vi.fn() })),
    RouterLink: { template: '<a><slot /></a>' }
}))

describe('AdminProductsView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('loads categories and products on mount', async () => {
        axios.get.mockImplementation((url) => {
            if (url === 'http://127.0.0.1:8000/categories/') {
                return Promise.resolve({ data: [{ id: 1, name: 'WOMEN' }] })
            }
            if (url === 'http://127.0.0.1:8000/products/') {
                return Promise.resolve({ data: [{ id: 101, name: 'Test Dress', price: 5000, category_id: 1 }] })
            }
        })

        const wrapper = mount(AdminProductsView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(wrapper.text()).toContain('Test Dress')
        expect(wrapper.text()).toContain('5,000') // รูปแบบราคา
        expect(wrapper.text()).toContain('WOMEN') // Category Badge
    })
})