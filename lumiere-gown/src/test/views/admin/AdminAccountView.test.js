import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminAccountView from '@/views/admin/AdminAccountView.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

vi.mock('axios')
vi.mock('vue-router', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn()
    }))
}))

describe('AdminAccountView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    it('redirects to login if no admin ID in localStorage', async () => {
        const pushMock = vi.fn()
        useRouter.mockReturnValue({ push: pushMock })

        mount(AdminAccountView)

        expect(pushMock).toHaveBeenCalledWith('/login')
    })

    it('fetches and displays admin data if logged in', async () => {
        localStorage.setItem('loggedInAdminId', '1')

        const mockAdminData = {
            name: 'Test Admin',
            email_address: 'admin@test.com',
            phone_number: '123456789',
            employee_id: 'EMP-001'
        }
        axios.get.mockResolvedValueOnce({ data: mockAdminData })

        const wrapper = mount(AdminAccountView)

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/admins/1')
        expect(wrapper.text()).toContain('Test Admin')
        expect(wrapper.text()).toContain('admin@test.com')
    })
})