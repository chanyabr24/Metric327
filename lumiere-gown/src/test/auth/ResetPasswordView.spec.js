import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'

const mockRoute = { query: {} }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

describe('ResetPasswordView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockRoute.query = {}
    })

    it('renders reset password form correctly', () => {
        const wrapper = mount(ResetPasswordView, {
            global: { stubs: ['router-link'] }
        })

        expect(wrapper.text()).toContain('Reset Password')
        expect(wrapper.text()).toContain('Enter your email to receive a recovery code')
        expect(wrapper.find('input#email').exists()).toBe(true)
    })

    it('navigates to verify-code page with email query parameter upon submission', async () => {
        const wrapper = mount(ResetPasswordView, {
            global: { stubs: ['router-link'] }
        })

        // กรอกอีเมลในฟอร์ม
        await wrapper.find('input#email').setValue('chanya@metric.com')
        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        // ตรวจสอบว่า router.push ถูกเรียกใช้งานพร้อมส่ง query email ไปด้วย
        expect(mockRouter.push).toHaveBeenCalledWith({
            path: '/verify-code',
            query: { email: 'chanya@metric.com' }
        })
    })

    it('does not navigate if email input is empty', async () => {
        const wrapper = mount(ResetPasswordView, {
            global: { stubs: ['router-link'] }
        })

        // ไม่ได้กรอกอีเมลแล้วกด Submit
        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(mockRouter.push).not.toHaveBeenCalled()
    })
})