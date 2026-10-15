import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import AdminProductFormView from '@/views/admin/AdminProductFormView.vue'
import { flushPromises } from '@vue/test-utils'


vi.mock('axios')

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/admin/product-form', component: AdminProductFormView },
        { path: '/admin/products', component: { template: '<div>Products List</div>' } },
        { path: '/login', component: { template: '<div>Login</div>' } }
    ]
})

describe('AdminProductFormView.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(window, 'alert').mockImplementation(() => {})
    })

    it('fetches categories on mount and submits new product successfully (POST)', async () => {
        axios.get.mockResolvedValueOnce({
            data: [{ id: 1, name: 'Gowns' }]
        })
        axios.post.mockResolvedValueOnce({})

        router.push('/admin/product-form')
        await router.isReady()
        const pushSpy = vi.spyOn(router, 'push')

        const wrapper = mount(AdminProductFormView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await new Promise(resolve => setTimeout(resolve, 50))
        await wrapper.vm.$nextTick()

        // กรอกข้อมูลฟอร์ม
        await wrapper.find('input#productName').setValue('New Gown')
        await wrapper.find('textarea#productDesc').setValue('Beautiful dress')
        await wrapper.find('input#productPrice').setValue(2500)
        await wrapper.find('select#productCategory').setValue(1)

        // เลือก Checkbox สีและไซส์
        const colorCheckbox = wrapper.find('input[type="checkbox"][value="black"]')
        await colorCheckbox.setValue(true)
        const sizeCheckbox = wrapper.find('input[type="checkbox"][value="m"]')
        await sizeCheckbox.setValue(true)

        // ส่งฟอร์ม
        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.post).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/products/',
            expect.objectContaining({
                name: 'New Gown',
                price: 2500,
                attribute: { colors: ['black'], sizes: ['m'] }
            })
        )
        expect(pushSpy).toHaveBeenCalledWith('/admin/products')
    })

    it('fetches product data and updates existing product successfully (PUT)', async () => {
        // เรียงลำดับการเรียก axios.get ตามการทำงานจริงของคอมโพเนนต์
        axios.get
            .mockResolvedValueOnce({ data: [{ id: 1, name: 'Gowns' }] }) // 1. ดึง categories
            .mockResolvedValueOnce({                                     // 2. ดึง product details
                data: {
                    name: 'Old Gown',
                    description: 'Old desc',
                    price: 1000,
                    category_id: 1,
                    image_url: 'http://example.com/img.jpg',
                    attribute: { colors: ['white'], sizes: ['s'] }
                }
            })

        axios.put.mockResolvedValueOnce({})

        await router.push('/admin/product-form?id=99')

        const wrapper = mount(AdminProductFormView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await flushPromises()

        expect(wrapper.vm.form.name).toBe('Old Gown')
        expect(wrapper.vm.selectedColors).toEqual(['white'])

        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(axios.put).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/products/99',
            expect.objectContaining({ name: 'Old Gown' })
        )
    })

    it('handles error when saving product fails', async () => {
        axios.get.mockResolvedValue({ data: [] })
        axios.post.mockRejectedValueOnce(new Error('Validation Error'))
        const alertSpy = vi.spyOn(window, 'alert')

        router.push('/admin/product-form')
        await router.isReady()

        const wrapper = mount(AdminProductFormView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await wrapper.find('form').trigger('submit.prevent')
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(alertSpy).toHaveBeenCalledWith('บันทึกไม่สำเร็จ ตรวจสอบข้อมูลอีกครั้ง (422)')
    })

    it('handles image error by hiding/resetting preview', async () => {
        axios.get.mockResolvedValue({ data: [] })
        router.push('/admin/product-form')
        await router.isReady()

        const wrapper = mount(AdminProductFormView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        await wrapper.vm.$nextTick()
        const img = wrapper.find('img')
        if (img.exists()) {
            await img.trigger('error')
            expect(img.element.style.display).toBe('none')
        }
    })

    it('handles logout correctly', async () => {
        axios.get.mockResolvedValue({ data: [] })
        router.push('/admin/product-form')
        await router.isReady()

        localStorage.setItem('loggedInAdminId', '555')
        const pushSpy = vi.spyOn(router, 'push')

        const wrapper = mount(AdminProductFormView, {
            global: {
                plugins: [router],
                stubs: ['router-link']
            }
        })

        const logoutBtn = wrapper.find('aside button')
        await logoutBtn.trigger('click')

        expect(localStorage.getItem('loggedInAdminId')).toBeNull()
        expect(pushSpy).toHaveBeenCalledWith('/login')
    })
})