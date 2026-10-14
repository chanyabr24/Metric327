import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import HomeView from '@/views/HomeView.vue'

vi.mock('axios')

const mockRoute = { query: {} }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

vi.mock('@/components/Drawer.vue', () => ({
    default: {
        name: 'Drawer',
        template: '<div class="drawer-stub"></div>'
    }
}))

describe('HomeView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('renders hero carousel, slides navigation, and fetches products successfully', async () => {
        vi.useRealTimers()
        axios.get.mockImplementation((url) => {
            if (url.includes('/categories/')) {
                return Promise.resolve({ data: [{ id: 1, name: 'NEW' }] })
            }
            if (url.includes('/products/')) {
                return Promise.resolve({
                    data: [
                        { id: 1, name: 'Gown One', price: 10000, category_id: 1, image_url: 'one.jpg' },
                        { id: 2, name: 'Gown Two', price: 15000, category_id: 1, image_url: 'two.jpg' }
                    ]
                })
            }
        })

        const wrapper = mount(HomeView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 100))
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('NEW ARRIVALS')
        expect(wrapper.text()).toContain('Bridal Sanctuary')

        expect(wrapper.vm.currentSlide).toBe(0)
        wrapper.vm.nextSlide()
        expect(wrapper.vm.currentSlide).toBe(1)
        wrapper.vm.prevSlide()
        expect(wrapper.vm.currentSlide).toBe(0)
    })

    it('automatically cycles hero slides using timer', async () => {
        axios.get.mockResolvedValue({ data: [] })

        const wrapper = mount(HomeView, {
            global: { stubs: ['router-link'] }
        })

        expect(wrapper.vm.currentSlide).toBe(0)

        vi.advanceTimersByTime(5000)
        expect(wrapper.vm.currentSlide).toBe(1)

        vi.advanceTimersByTime(5000)
        expect(wrapper.vm.currentSlide).toBe(2)
    })

    it('toggles navigation drawer correctly', async () => {
        axios.get.mockResolvedValue({ data: [] })

        const wrapper = mount(HomeView, {
            global: { stubs: ['router-link'] }
        })

        const menuBtn = wrapper.find('button[aria-label="Open menu"]')
        await menuBtn.trigger('click')

        expect(wrapper.vm.isDrawerOpen).toBe(true)
    })
})