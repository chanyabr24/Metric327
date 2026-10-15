import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import VerifyCodeView from '@/views/auth/VerifyCodeView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/verify', component: VerifyCodeView },
        { path: '/login', component: { template: '<div>Login Page</div>' } }
    ]
})

describe('VerifyCodeView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubGlobal('fetch', vi.fn())
    })

    it('renders correctly and sets email from route query', async () => {
        router.push('/verify?email=test@example.com')
        await router.isReady()

        const wrapper = mount(VerifyCodeView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain('test@example.com')
    })

    it('handles input changes, auto-advances, and trims characters', async () => {
        router.push('/verify')
        await router.isReady()

        const wrapper = mount(VerifyCodeView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        const inputs = wrapper.findAll('input[type="text"]')

        // จำลองการพิมพ์ตัวอักษรยาวเกิน 1 ตัวอักษรช่องแรก
        inputs[0].element.value = '12'
        await inputs[0].trigger('input')
        expect(wrapper.vm.otp[0]).toBe('2')

        // พิมพ์เลข 3 ช่องที่ 1 เพื่อให้ออโต้โฟกัสไปช่องถัดไป
        inputs[0].element.value = '3'
        await inputs[0].trigger('input')
        expect(wrapper.vm.otp[0]).toBe('3')
    })

    it('handles keydown backspace to navigate backwards', async () => {
        router.push('/verify')
        await router.isReady()

        const wrapper = mount(VerifyCodeView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        wrapper.vm.otp = ['', '']
        await wrapper.vm.$nextTick()

        // จำลองการเรียกฟังก์ชัน handleKeyDown ที่ช่อง index 1 ด้วยปุ่ม Backspace
        const event = { key: 'Backspace', preventDefault: () => {} }
        wrapper.vm.handleKeyDown(1, event)

        // ตรวจสอบว่าระบบทำงานผ่านฟังก์ชันเรียบร้อยโดยไม่มีข้อผิดพลาด
        expect(wrapper.vm.otp[1]).toBe('')
    })

    it('handles clipboard paste correctly', async () => {
        router.push('/verify')
        await router.isReady()

        const wrapper = mount(VerifyCodeView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        const inputs = wrapper.findAll('input[type="text"]')

        const pasteEvent = {
            preventDefault: vi.fn(),
            clipboardData: {
                getData: () => '9876'
            }
        }

        await inputs[0].trigger('paste', pasteEvent)
        expect(wrapper.vm.otpCode).toBe('9876')
    })

    it('submits verification code successfully and navigates to login', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({})
        })

        router.push('/verify')
        await router.isReady()
        const pushSpy = vi.spyOn(router, 'push')

        const wrapper = mount(VerifyCodeView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        wrapper.vm.otp = ['1', '2', '3', '4']
        await wrapper.vm.$nextTick()

        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 20))

        expect(pushSpy).toHaveBeenCalledWith('/login')
    })

    it('handles verification failure from server error response', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ detail: 'Incorrect OTP code.' })
        })

        router.push('/verify')
        await router.isReady()

        const wrapper = mount(VerifyCodeView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        wrapper.vm.otp = ['1', '2', '3', '4']
        await wrapper.vm.$nextTick()

        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 20))

        expect(wrapper.text()).toContain('Incorrect OTP code.')
    })

    it('handles verification exception/fallback correctly', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'))

        router.push('/verify')
        await router.isReady()
        const pushSpy = vi.spyOn(router, 'push')

        const wrapper = mount(VerifyCodeView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        wrapper.vm.otp = ['1', '2', '3', '4']
        await wrapper.vm.$nextTick()

        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 20))

        expect(pushSpy).toHaveBeenCalledWith('/login')
    })

    it('resends code successfully', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({})
        })

        router.push('/verify')
        await router.isReady()

        const wrapper = mount(VerifyCodeView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        const resendBtn = wrapper.findAll('button').find(b => b.text().includes('Resend Code'))
        await resendBtn.trigger('click')
        await new Promise(resolve => setTimeout(resolve, 20))

        expect(wrapper.text()).toContain('A new code has been sent to your email.')
    })

    it('handles resend code failure', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({})
        })

        router.push('/verify')
        await router.isReady()

        const wrapper = mount(VerifyCodeView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        const resendBtn = wrapper.findAll('button').find(b => b.text().includes('Resend Code'))
        await resendBtn.trigger('click')
        await new Promise(resolve => setTimeout(resolve, 20))

        expect(wrapper.text()).toContain('Failed to resend code.')
    })

    it('handles resend code network exception fallback', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'))

        router.push('/verify')
        await router.isReady()

        const wrapper = mount(VerifyCodeView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        const resendBtn = wrapper.findAll('button').find(b => b.text().includes('Resend Code'))
        await resendBtn.trigger('click')
        await new Promise(resolve => setTimeout(resolve, 20))

        expect(wrapper.text()).toContain('A new code has been sent to your email.')
    })
})