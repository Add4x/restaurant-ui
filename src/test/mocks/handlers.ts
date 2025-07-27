import { http, HttpResponse } from 'msw'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1/public'

export const handlers = [
  http.get(`${API_BASE_URL}/${API_VERSION}/menu-items`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'Test Burger',
          description: 'A delicious test burger',
          price: 12.99,
          category: 'Burgers',
          image_url: '/test-burger.jpg',
          availability_status: 'available',
          preparation_time: 15,
          spice_level: 'mild',
          allergens: ['gluten', 'dairy'],
          is_vegetarian: false,
          is_vegan: false,
          is_gluten_free: false,
        },
        {
          id: 2,
          name: 'Test Salad',
          description: 'A fresh test salad',
          price: 8.99,
          category: 'Salads',
          image_url: '/test-salad.jpg',
          availability_status: 'available',
          preparation_time: 10,
          spice_level: null,
          allergens: [],
          is_vegetarian: true,
          is_vegan: true,
          is_gluten_free: true,
        },
      ],
    })
  }),

  http.get(`${API_BASE_URL}/${API_VERSION}/offers`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          code: 'TEST10',
          description: '10% off your order',
          discount_percentage: 10,
          discount_amount: null,
          min_order_amount: 20,
          valid_from: '2024-01-01',
          valid_until: '2024-12-31',
          is_active: true,
          max_uses: 100,
          current_uses: 10,
        },
      ],
    })
  }),

  http.post(`${API_BASE_URL}/${API_VERSION}/orders`, () => {
    return HttpResponse.json({
      data: {
        id: 123,
        order_number: 'ORD-123',
        status: 'pending',
        total_amount: 25.98,
        created_at: new Date().toISOString(),
      },
    })
  }),
]