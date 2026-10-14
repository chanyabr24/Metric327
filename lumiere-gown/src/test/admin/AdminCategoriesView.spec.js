import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import AdminCategoriesView from '@/views/admin/AdminCategoriesView.vue'

vi.mock('axios')

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/admin/categories', component: AdminCategoriesView },
        { path: '/admin/category-form', component: { template: '<div>Category Form</div>' } },
        { path: '/login', component: { template: '<div>Login</div>' } }
    ]
})

describe('AdminCategoriesView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(window, 'alert').mockImplementation(() => {})
    })

    it('fetches and renders categories successfully', async () => {
        axios.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Gowns', description: 'Wedding gowns', status: 'SHOW', image_url: 'gown.jpg' }
            ]
        })

        router.push('/admin/categories')
        await router.isReady()

        const wrapper = mount(AdminCategoriesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        expect(wrapper.text()).toContain('Loading Categories...')

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Gowns')
        expect(wrapper.text()).toContain('Wedding gowns')
    })

    it('handles error when fetching categories fails', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'))

        router.push('/admin/categories')
        await router.isReady()

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

    it('toggles category status successfully', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        axios.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Gowns', description: 'Wedding gowns', status: 'SHOW', image_url: '' }
            ]
        })
        axios.put.mockResolvedValue({})

        router.push('/admin/categories')
        await router.isReady()

        const wrapper = mount(AdminCategoriesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        const toggleBtn = wrapper.findAll('button').find(b => b.text().includes('HIDE'))
        await toggleBtn.trigger('click')

        expect(axios.put).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/categories/1',
            expect.objectContaining({ status: 'HIDE' })
        )
    })

    it('deletes category successfully', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        axios.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Gowns', description: 'Wedding gowns', status: 'SHOW', image_url: '' }
            ]
        })
        axios.delete.mockResolvedValue({})

        router.push('/admin/categories')
        await router.isReady()

        const wrapper = mount(AdminCategoriesView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        const deleteBtn = wrapper.find('button.bg-rose-50')
        await deleteBtn.trigger('click')

        expect(axios.delete).toHaveBeenCalledWith('http://127.0.0.1:8000/categories/1')
        expect(wrapper.vm.categories.length).toBe(0)
    })

    it('handles logout correctly', async () => {
        axios.get.mockResolvedValue({ data: [] })
        router.push('/admin/categories')
        await router.isReady()

        localStorage.setItem('loggedInAdminId', '999')
        const pushSpy = vi.spyOn(router, 'push')

        const wrapper = mount(AdminCategoriesView, {
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