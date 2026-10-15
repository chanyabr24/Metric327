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

    it('fetches and renders categories successfully (with and without image)', async () => {
        axios.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Gowns', description: 'Wedding gowns', status: 'SHOW', image_url: 'gown.jpg' },
                { id: 2, name: 'Suits', description: '', status: 'HIDE', image_url: '' }
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
        expect(wrapper.text()).toContain('Suits')
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

    it('toggles mobile menu visibility when mobile menu button is clicked', async () => {
        axios.get.mockResolvedValue({ data: [] })

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

        expect(wrapper.vm.isMobileMenuOpen).toBe(false)
        const mobileBtn = wrapper.find('button[aria-label="Toggle Navigation"]')
        await mobileBtn.trigger('click')
        expect(wrapper.vm.isMobileMenuOpen).toBe(true)
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

    it('does not toggle category status if confirmation is cancelled', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false)

        axios.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Gowns', description: '', status: 'SHOW', image_url: '' }
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

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        const toggleBtn = wrapper.findAll('button').find(b => b.text().includes('HIDE'))
        await toggleBtn.trigger('click')

        expect(axios.put).not.toHaveBeenCalled()
    })

    it('handles error when updating category status fails', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

        axios.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Gowns', description: '', status: 'SHOW', image_url: '' }
            ]
        })
        axios.put.mockRejectedValue(new Error('Update failed'))

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

        await new Promise(resolve => setTimeout(resolve, 20))
        expect(alertSpy).toHaveBeenCalledWith('Error updating category status')
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

    it('does not delete category if confirmation is cancelled', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false)

        axios.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Gowns', description: '', status: 'SHOW', image_url: '' }
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

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        const deleteBtn = wrapper.find('button.bg-rose-50')
        await deleteBtn.trigger('click')

        expect(axios.delete).not.toHaveBeenCalled()
    })

    it('handles error when deleting category fails', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

        axios.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Gowns', description: '', status: 'SHOW', image_url: '' }
            ]
        })
        axios.delete.mockRejectedValue(new Error('Delete failed'))

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

        await new Promise(resolve => setTimeout(resolve, 20))
        expect(alertSpy).toHaveBeenCalledWith('Error deleting category')
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