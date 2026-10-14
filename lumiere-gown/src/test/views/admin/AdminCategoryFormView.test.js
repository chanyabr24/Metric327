import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminCategoryFormView from '@/views/admin/AdminCategoryFormView.vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

vi.mock('axios')
vi.mock('vue-router', () => ({
    useRouter: vi.fn(() => ({ push: vi.fn() })),
    useRoute: vi.fn(() => ({ query: {} })),
    RouterLink: { template: '<a><slot /></a>' }
}))

describe('AdminCategoryFormView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('submits new category successfully', async () => {
        const pushMock = vi.fn()
        useRouter.mockReturnValue({ push: pushMock })
        useRoute.mockReturnValue({ query: {} }) // โหมด Create

        axios.post.mockResolvedValueOnce({ data: { message: 'Success' } })
        window.alert = vi.fn()

        const wrapper = mount(AdminCategoryFormView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.find('#categoryName').setValue('NEW CAT')
        await wrapper.find('#categoryDesc').setValue('New desc')
        await wrapper.find('form').trigger('submit.prevent')

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/categories/', {
            name: 'NEW CAT',
            description: 'New desc',
            status: 'SHOW',
            image_url: ''
        })
        expect(pushMock).toHaveBeenCalledWith('/admin/categories')
    })
})