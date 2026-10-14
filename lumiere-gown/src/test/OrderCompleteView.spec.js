import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderCompleteView from '@/views/OrderCompleteView.vue'

const mockRoute = { query: {} }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

describe('OrderCompleteView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
        localStorage.setItem('cart', JSON.stringify([{ id: '1', name: 'Gown' }]))
    })

    it('renders order confirmation message and generates transaction ID successfully', async () => {
        const wrapper = mount(OrderCompleteView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Thank you for ordering!')
        expect(localStorage.getItem('cart')).toBeNull()
        expect(wrapper.vm.transactionId).toBeTruthy()
    })

    it('renders action links to view order and continue shopping', async () => {
        const wrapper = mount(OrderCompleteView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.vm.$nextTick()

        const routerLinks = wrapper.findAll('router-link-stub')
        expect(routerLinks.length).toBeGreaterThanOrEqual(2)
        // สลับลำดับตามโครงสร้างจริงที่เรนเดอร์ออกมา (ปุ่มแรกไป /, ปุ่มที่สองไป /account)
        expect(routerLinks[0].attributes('to')).toBe('/')
        expect(routerLinks[1].attributes('to')).toBe('/account')
    })
})