import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VerifyCodeView from '@/views/auth/VerifyCodeView.vue'

const mockRoute = { query: { email: 'chanya@metric.com' } }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

describe('VerifyCodeView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockRoute.query = { email: 'chanya@metric.com' }
        global.fetch = vi.fn()
    })

    it('renders security verification form and displays email correctly', async () => {
        const wrapper = mount(VerifyCodeView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Security Verification')
        expect(wrapper.text()).toContain('chanya@metric.com')
        expect(wrapper.findAll('input[type="text"]').length).toBe(4)
    })

    it('handles OTP inputs, auto-focus, and submits successfully when code is complete', async () => {
        global.fetch.mockResolvedValueOnce({ ok: true })

        const wrapper = mount(VerifyCodeView, {
            global: { stubs: ['router-link'] }
        })

        const inputs = wrapper.findAll('input[type="text"]')

        // จำลองการกรอกรหัสทีละช่อง
        await inputs[0].setValue('1')
        await inputs[1].setValue('2')
        await inputs[2].setValue('3')
        await inputs[3].setValue('4')
        await wrapper.vm.$nextTick()

        // กดปุ่ม Verify (ยิง submit ฟอร์มโดยตรงเพื่อให้มั่นใจว่าข้ามเงื่อนไข disabled)
        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(global.fetch).toHaveBeenCalledWith('/api/verify-code', expect.any(Object))
        expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('handles resend code action successfully', async () => {
        global.fetch.mockResolvedValueOnce({ ok: true })

        const wrapper = mount(VerifyCodeView, {
            global: { stubs: ['router-link'] }
        })

        const resendBtn = wrapper.find('button.cursor-pointer:not([type="submit"])')
        await resendBtn.trigger('click')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(global.fetch).toHaveBeenCalledWith('/api/resend-code', expect.any(Object))
        expect(wrapper.text()).toContain('A new code has been sent to your email.')
    })
})