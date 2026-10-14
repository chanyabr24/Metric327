import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import RegisterView from '@/views/auth/RegisterView.vue'

vi.mock('axios')

const mockRoute = { query: {} }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

describe('RegisterView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders registration form correctly', () => {
        const wrapper = mount(RegisterView, {
            global: { stubs: ['router-link'] }
        })

        expect(wrapper.text()).toContain('Create Account')
        expect(wrapper.find('input#firstName').exists()).toBe(true)
        expect(wrapper.find('input#email').exists()).toBe(true)
        expect(wrapper.find('input#password').exists()).toBe(true)
    })

    it('shows error message when password and confirm password do not match', async () => {
        const wrapper = mount(RegisterView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.find('input#firstName').setValue('Chanya')
        await wrapper.find('input#email').setValue('chanya@metric.com')
        await wrapper.find('input#password').setValue('password123')
        await wrapper.find('input#passwordConfirm').setValue('wrongpassword')

        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.text()).toContain('Passwords do not match.')
        expect(axios.post).not.toHaveBeenCalled()
    })

    it('registers successfully and redirects to login page', async () => {
        axios.post.mockResolvedValueOnce({ data: { message: 'Success' } })

        const wrapper = mount(RegisterView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.find('input#firstName').setValue('Chanya')
        await wrapper.find('input#lastName').setValue('Dev')
        await wrapper.find('input#email').setValue('chanya@metric.com')
        await wrapper.find('input#password').setValue('password123')
        await wrapper.find('input#passwordConfirm').setValue('password123')

        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/users/', {
            first_name: 'Chanya',
            last_name: 'Dev',
            email_address: 'chanya@metric.com',
            password: 'password123'
        })
        expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('displays error detail when registration fails from server', async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: { detail: 'Email already registered' } }
        })

        const wrapper = mount(RegisterView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.find('input#firstName').setValue('Chanya')
        await wrapper.find('input#email').setValue('exist@metric.com')
        await wrapper.find('input#password').setValue('password123')
        await wrapper.find('input#passwordConfirm').setValue('password123')

        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(wrapper.text()).toContain('Email already registered')
    })

    it('displays generic error message when network or server error occurs without detail', async () => {
        axios.post.mockRejectedValueOnce(new Error('Network Error'))

        const wrapper = mount(RegisterView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.find('input#firstName').setValue('Chanya')
        await wrapper.find('input#email').setValue('test@metric.com')
        await wrapper.find('input#password').setValue('password123')
        await wrapper.find('input#passwordConfirm').setValue('password123')

        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(wrapper.text()).toContain('An error occurred during registration. Please try again.')
    })
})