import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactView from '@/views/ContactView.vue'

const mockRoute = { query: {} }
const mockRouter = { push: vi.fn() }

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
    createRouter: () => ({}),
    createWebHistory: () => ({})
}))

// Mock Drawer component
vi.mock('@/components/Drawer.vue', () => ({
    default: {
        name: 'Drawer',
        template: '<div class="drawer-stub"></div>'
    }
}))

describe('ContactView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        delete import.meta.env.VITE_MAPS_API_KEY
    })

    it('renders contact details and fallback map correctly when API key is missing', async () => {
        const wrapper = mount(ContactView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('CONTACT US')
        expect(wrapper.text()).toContain('contact@lumieregown.com')
        expect(wrapper.text()).toContain('+66 53-920299')
        expect(wrapper.text()).toContain('Chiang Mai 50200, Thailand')

        // ตรวจสอบว่า iframe ของแผนที่แสดงผล (ใช้ OpenStreetMap Fallback เมื่อไม่มี API key)
        const iframe = wrapper.find('iframe')
        expect(iframe.exists()).toBe(true)
        expect(iframe.attributes('src')).toContain('maps.google.com/maps')
    })

    it('renders Google Maps embed URL when VITE_MAPS_API_KEY is provided', async () => {
        import.meta.env.VITE_MAPS_API_KEY = 'fake-google-maps-api-key'

        const wrapper = mount(ContactView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.vm.$nextTick()

        const iframe = wrapper.find('iframe')
        expect(iframe.exists()).toBe(true)
        expect(iframe.attributes('src')).toContain('google.com/maps/embed/v1/place')
        expect(iframe.attributes('src')).toContain('fake-google-maps-api-key')
    })

    it('toggles navigation drawer correctly', async () => {
        const wrapper = mount(ContactView, {
            global: { stubs: ['router-link'] }
        })

        const menuBtn = wrapper.find('button[aria-label="Open menu"]')
        await menuBtn.trigger('click')

        expect(wrapper.vm.isDrawerOpen).toBe(true)
    })
})