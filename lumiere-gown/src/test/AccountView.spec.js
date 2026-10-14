import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import AccountView from '@/views/AccountView.vue'

vi.mock('axios')

const mockRoute = { query: {} }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

// Mock Drawer component เพื่อไม่ให้ติดพึ่งพาภายใน
vi.mock('@/components/Drawer.vue', () => ({
    default: {
        name: 'Drawer',
        template: '<div class="drawer-stub"></div>'
    }
}))

describe('AccountView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    it('redirects to login if loggedInUserId is missing in localStorage', async () => {
        mount(AccountView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))

        expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('fetches user profile and renders information correctly when loggedInUserId exists', async () => {
        localStorage.setItem('loggedInUserId', '42')

        axios.get.mockResolvedValueOnce({
            data: {
                first_name: 'Chanya',
                last_name: 'Dev',
                email_address: 'chanya@metric.com'
            }
        })

        const wrapper = mount(AccountView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/users/42')
        expect(wrapper.text()).toContain('Chanya Dev')
        expect(wrapper.text()).toContain('chanya@metric.com')
    })

    it('handles logout correctly', async () => {
        localStorage.setItem('loggedInUserId', '42')
        axios.get.mockResolvedValueOnce({ data: { first_name: 'Test', email_address: 'test@metric.com' } })

        const wrapper = mount(AccountView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))

        // คลิกปุ่ม Logout
        const logoutBtn = wrapper.find('button.cursor-pointer.border-b')
        await logoutBtn.trigger('click')

        expect(localStorage.getItem('loggedInUserId')).toBeNull()
        expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
})