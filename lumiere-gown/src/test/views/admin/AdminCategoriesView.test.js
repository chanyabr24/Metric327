import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminCategoriesView from '@/views/admin/AdminCategoriesView.vue'
import axios from 'axios'

vi.mock('axios')
vi.mock('vue-router', () => ({
    useRouter: vi.fn(() => ({ push: vi.fn() })),
    RouterLink: { template: '<a><slot /></a>' }
}))

describe('AdminCategoriesView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('fetches and renders categories on mount', async () => {
        const mockCategories = [
            { id: 1, name: 'WOMEN', status: 'SHOW', description: 'Women clothing' }
        ]
        axios.get.mockResolvedValueOnce({ data: mockCategories })

        const wrapper = mount(AdminCategoriesView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/categories/')
        expect(wrapper.text()).toContain('WOMEN')
        expect(wrapper.text()).toContain('Women clothing')
    })
})