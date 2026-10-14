import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminSalesView from '@/views/admin/AdminSalesView.vue'
import axios from 'axios'

vi.mock('axios')
vi.mock('vue-router', () => ({
    useRouter: vi.fn(() => ({ push: vi.fn() })),
    RouterLink: { template: '<a><slot /></a>' }
}))

describe('AdminSalesView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('fetches sales and calculates total revenue correctly', async () => {
        const mockSales = [
            { id: 1, transaction_id: 'TXN-001', customer_name: 'John Doe', amount: 10000, status: 'COMPLETED' },
            { id: 2, transaction_id: 'TXN-002', customer_name: 'Jane Doe', amount: 5500.50, status: 'PROCESSING' }
        ]
        axios.get.mockResolvedValueOnce({ data: mockSales })

        const wrapper = mount(AdminSalesView, {
            global: { stubs: ['router-link'] }
        })

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(wrapper.text()).toContain('TXN-001')
        expect(wrapper.text()).toContain('John Doe')

        expect(wrapper.text()).toContain('15,500.50')
    })
})