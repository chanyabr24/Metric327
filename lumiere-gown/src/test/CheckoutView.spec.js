import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import CheckoutView from '@/views/CheckoutView.vue'

vi.mock('axios')

const mockRoute = { query: {} }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

describe('CheckoutView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
        vi.spyOn(window, 'alert').mockImplementation(() => {})
    })

    it('renders cart summary and checkout form correctly', async () => {
        const mockCart = [
            { id: '1', name: 'Silk Gown', price: 10000, qty: 1, image: 'gown.jpg' }
        ]
        localStorage.setItem('cart', JSON.stringify(mockCart))

        const wrapper = mount(CheckoutView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('01 / My Information')
        expect(wrapper.text()).toContain('02 / Shipping Address')
        expect(wrapper.text()).toContain('03 / Payment')
        expect(wrapper.text()).toContain('Silk Gown')
        expect(wrapper.text()).toContain('฿10,000.00')
    })

    it('handles confirm purchase successfully, posts sale record, clears cart, and redirects', async () => {
        const mockCart = [
            { id: '1', name: 'Silk Gown', price: 15000, qty: 1, image: 'gown.jpg' }
        ]
        localStorage.setItem('cart', JSON.stringify(mockCart))
        axios.post.mockResolvedValueOnce({})

        const wrapper = mount(CheckoutView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.vm.$nextTick()

        // กรอกข้อมูลฟอร์ม
        await wrapper.find('input#firstName').setValue('Chanya')
        await wrapper.find('input#lastName').setValue('Dev')
        await wrapper.find('input#email').setValue('chanya@metric.com')
        await wrapper.find('input#street').setValue('123 Nimman Rd')
        await wrapper.find('input#postalCode').setValue('50200')
        await wrapper.find('input#city').setValue('Chiang Mai')
        await wrapper.find('input#country').setValue('Thailand')

        // กดปุ่ม Confirm Purchase
        const confirmBtn = wrapper.find('button.bg-black')
        await confirmBtn.trigger('click')

        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.post).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/sales/',
            expect.objectContaining({
                customer_name: 'Chanya Dev',
                customer_type: 'Web Customer',
                amount: 15000,
                status: 'PROCESSING'
            })
        )
        expect(localStorage.getItem('cart')).toBeNull()
        expect(mockRouter.push).toHaveBeenCalledWith('/order-complete')
    })

    it('handles API error gracefully when confirmation fails', async () => {
        const mockCart = [
            { id: '1', name: 'Silk Gown', price: 5000, qty: 1, image: 'gown.jpg' }
        ]
        localStorage.setItem('cart', JSON.stringify(mockCart))
        axios.post.mockRejectedValueOnce(new Error('Server Error'))

        const wrapper = mount(CheckoutView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.vm.$nextTick()

        const confirmBtn = wrapper.find('button.bg-black')
        await confirmBtn.trigger('click')

        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.post).toHaveBeenCalled()
        expect(mockRouter.push).not.toHaveBeenCalled()
    })
})