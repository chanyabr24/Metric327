import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import LoginView from '@/views/auth/LoginView.vue'

vi.mock('axios')

const mockRoute = { query: {} }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

describe('LoginView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    it('renders login form correctly', () => {
        const wrapper = mount(LoginView, {
            global: { stubs: ['router-link'] }
        })

        expect(wrapper.text()).toContain('Log In')
        expect(wrapper.find('input#email').exists()).toBe(true)
        expect(wrapper.find('input#password').exists()).toBe(true)
    })

    it('logs in successfully as admin and redirects to admin account', async () => {
        axios.post.mockResolvedValueOnce({
            data: { role: 'admin', id: 10 }
        })

        const wrapper = mount(LoginView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.find('input#email').setValue('admin@metric.com')
        await wrapper.find('input#password').setValue('password123')
        await wrapper.find('form').trigger('submit.prevent')

        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/login/', {
            email_address: 'admin@metric.com',
            password: 'password123'
        })
        expect(localStorage.getItem('loggedInAdminId')).toBe('10')
        expect(mockRouter.push).toHaveBeenCalledWith('/admin/account')
    })

    it('logs in successfully as regular user and redirects to user account', async () => {
        axios.post.mockResolvedValueOnce({
            data: { role: 'user', id: 25 }
        })

        const wrapper = mount(LoginView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.find('input#email').setValue('user@metric.com')
        await wrapper.find('input#password').setValue('mypassword')
        await wrapper.find('form').trigger('submit.prevent')

        await new Promise(resolve => setTimeout(resolve, 50))

        expect(localStorage.getItem('loggedInUserId')).toBe('25')
        expect(mockRouter.push).toHaveBeenCalledWith('/account')
    })

    it('displays error message when login fails with server detail', async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: { detail: 'Invalid credentials' } }
        })

        const wrapper = mount(LoginView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.find('input#email').setValue('wrong@metric.com')
        await wrapper.find('input#password').setValue('wrongpass')
        await wrapper.find('form').trigger('submit.prevent')

        await new Promise(resolve => setTimeout(resolve, 50))

        expect(wrapper.text()).toContain('Invalid credentials')
    })

    it('displays connection error message when network fails', async () => {
        axios.post.mockRejectedValueOnce(new Error('Network Error'))

        const wrapper = mount(LoginView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.find('input#email').setValue('test@metric.com')
        await wrapper.find('input#password').setValue('pass123')
        await wrapper.find('form').trigger('submit.prevent')

        await new Promise(resolve => setTimeout(resolve, 50))

        expect(wrapper.text()).toContain('Cannot connect to server.')
    })
})