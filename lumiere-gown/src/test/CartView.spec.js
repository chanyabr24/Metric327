import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CartView from '@/views/CartView.vue'

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

describe('CartView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    it('loads cart items from localStorage or sets mock data, and computes subtotal correctly', async () => {
        const mockCart = [
            { id: '1', name: 'Gown A', color: 'Black', size: 'S', price: 1000, qty: 2, image: 'a.jpg' },
            { id: '2', name: 'Gown B', color: 'White', size: 'M', price: 2500, qty: 1, image: 'b.jpg' }
        ]
        localStorage.setItem('cart', JSON.stringify(mockCart))

        const wrapper = mount(CartView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Gown A')
        expect(wrapper.text()).toContain('Gown B')
        // Subtotal: (1000 * 2) + (2500 * 1) = 4500
        expect(wrapper.text()).toContain('฿4,500.00')
    })

    it('increases and decreases item quantity correctly', async () => {
        const mockCart = [
            { id: '10', name: 'Test Gown', color: 'Red', size: 'L', price: 1000, qty: 1, image: 'test.jpg' }
        ]
        localStorage.setItem('cart', JSON.stringify(mockCart))

        const wrapper = mount(CartView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.vm.$nextTick()

        const buttons = wrapper.findAll('button.cursor-pointer')
        // สมมติปุ่ม + และ - อยู่ในรายการสินค้า (ปุ่มเพิ่มจำนวนคือปุ่มถัดจากตัวเลข qty)
        const plusBtn = buttons.filter(b => b.text() === '+')[0]
        const minusBtn = buttons.filter(b => b.text() === '−')[0]

        // เพิ่มจำนวนสินค้าจาก 1 เป็น 2
        await plusBtn.trigger('click')
        expect(wrapper.vm.cart[0].qty).toBe(2)

        // ลดจำนวนสินค้ากลับมาเป็น 1
        await minusBtn.trigger('click')
        expect(wrapper.vm.cart[0].qty).toBe(1)

        // พยายามลดให้ต่ำกว่า 1 (ค่าต้องหยุดที่อย่างน้อย 1)
        await minusBtn.trigger('click')
        expect(wrapper.vm.cart[0].qty).toBe(1)
    })

    it('removes item from cart successfully', async () => {
        const mockCart = [
            { id: '99', name: 'Delete Item', color: 'Blue', size: 'S', price: 500, qty: 1, image: 'del.jpg' }
        ]
        localStorage.setItem('cart', JSON.stringify(mockCart))

        const wrapper = mount(CartView, {
            global: { stubs: ['router-link'] }
        })

        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain('Delete Item')

        // คลิกปุ่มลบ (กากบาท ✕)
        const removeBtn = wrapper.find('button[title="Remove"]')
        await removeBtn.trigger('click')

        expect(wrapper.vm.cart.length).toBe(0)
        expect(wrapper.text()).toContain('Your cart is empty.')
    })
})