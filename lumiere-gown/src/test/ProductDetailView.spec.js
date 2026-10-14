import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import ProductDetailView from '@/views/ProductDetailView.vue'

vi.mock('axios')

const mockRoute = { params: { id: '1' } }
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

describe('ProductDetailView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    it('fetches product details successfully and renders attributes', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                id: 1,
                name: 'Silk Gown Deluxe',
                price: 15000,
                image_url: 'silk.jpg',
                description: 'Luxurious silk gown.\nHandcrafted in Italy.',
                attribute: JSON.stringify({ colors: ['white', 'black'], sizes: ['s', 'm'] })
            }
        })

        const wrapper = mount(ProductDetailView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/products/1')
        expect(wrapper.text()).toContain('Silk Gown Deluxe')
        expect(wrapper.text()).toContain('฿15,000')
        expect(wrapper.text()).toContain('Luxurious silk gown.')
    })

    it('adds item to cart and redirects to cart page', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                id: 1,
                name: 'Velvet Gown',
                price: 8000,
                image_url: 'velvet.jpg',
                description: 'Velvet evening dress.',
                attribute: JSON.stringify({ colors: ['black'], sizes: ['m'] })
            }
        })

        const wrapper = mount(ProductDetailView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        // กดปุ่ม Add to Cart
        const form = wrapper.find('form')
        await form.trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        // ตรวจสอบว่าสินค้าถูกบันทึกลงใน localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart'))
        expect(savedCart).toHaveLength(1)
        expect(savedCart[0].name).toBe('Velvet Gown')
        expect(savedCart[0].color).toBe('black')
        expect(savedCart[0].size).toBe('m')

        // ตรวจสอบว่าเปลี่ยนเส้นทางไปหน้า /cart
        expect(mockRouter.push).toHaveBeenCalledWith('/cart')
    })

    it('toggles details accordion correctly', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                id: 1,
                name: 'Gown',
                price: 5000,
                description: 'Sample description line.'
            }
        })

        const wrapper = mount(ProductDetailView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.isDetailsOpen).toBe(true)

        // คลิกปุ่ม Accordion เพื่อปิดรายละเอียด
        const detailsBtn = wrapper.find('button.cursor-pointer.bg-white')
        await detailsBtn.trigger('click')

        expect(wrapper.vm.isDetailsOpen).toBe(false)
    })
})