import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import AdminCategoryFormView from '@/views/admin/AdminCategoryFormView.vue'

vi.mock('axios')

// จำลอง vue-router ทั้งหมดให้ควบคุมง่ายขึ้น
const mockRoute = { query: {} }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

describe('AdminCategoryFormView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockRoute.query = {}
        vi.spyOn(window, 'alert').mockImplementation(() => {})
    })

    it('renders correctly for creating a new category', async () => {
        const wrapper = mount(AdminCategoryFormView, {
            global: { stubs: ['router-link'] }
        })

        expect(wrapper.text()).toContain('Add Category')
        expect(wrapper.find('button[type="submit"]').text()).toContain('SAVE CATEGORY')
    })

    it('fetches existing category data when route query has id (Edit Mode)', async () => {
        mockRoute.query = { id: '5' }
        axios.get.mockResolvedValueOnce({
            data: {
                name: 'Existing Gown',
                description: 'Existing Desc',
                status: 'HIDE',
                image_url: 'https://example.com/image.jpg'
            }
        })

        const wrapper = mount(AdminCategoryFormView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Edit Category')
        expect(wrapper.find('input#categoryName').element.value).toBe('Existing Gown')
    })

    it('handles submit successfully for creating a new category (POST)', async () => {
        mockRoute.query = {}
        axios.post.mockResolvedValueOnce({})

        const wrapper = mount(AdminCategoryFormView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.find('input#categoryName').setValue('New Wedding Gown')
        await wrapper.find('textarea#categoryDesc').setValue('Beautiful white dress')
        await wrapper.find('select#categoryStatus').setValue('SHOW')

        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.post).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/categories/',
            expect.objectContaining({ name: 'New Wedding Gown' })
        )
        expect(mockRouter.push).toHaveBeenCalledWith('/admin/categories')
    })

    it('handles submit successfully for updating a category (PUT)', async () => {
        mockRoute.query = { id: '10' }
        axios.get.mockResolvedValueOnce({
            data: { name: 'Old Name', description: 'Old Desc', status: 'SHOW' }
        })
        axios.put.mockResolvedValueOnce({})

        const wrapper = mount(AdminCategoryFormView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        await wrapper.find('input#categoryName').setValue('Updated Gown Name')
        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.put).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/categories/10',
            expect.objectContaining({ name: 'Updated Gown Name' })
        )
    })

    it('handles error gracefully when submission fails', async () => {
        mockRoute.query = {}
        axios.post.mockRejectedValueOnce({
            response: { data: { detail: 'Invalid data' } }
        })

        const wrapper = mount(AdminCategoryFormView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.find('input#categoryName').setValue('Test')
        await wrapper.find('textarea#categoryDesc').setValue('Test')
        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.post).toHaveBeenCalled()
    })

    it('handles logout correctly', async () => {
        mockRoute.query = {}
        localStorage.setItem('loggedInAdminId', '777')

        const wrapper = mount(AdminCategoryFormView, {
            global: { stubs: ['router-link'] }
        })

        const logoutBtn = wrapper.find('aside button')
        await logoutBtn.trigger('click')

        expect(localStorage.getItem('loggedInAdminId')).toBeNull()
        expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
})