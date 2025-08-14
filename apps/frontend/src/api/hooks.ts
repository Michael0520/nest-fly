import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './config'
import {
  MenuResponseSchema,
  GetOrdersResponseSchema,
  StatsResponseSchema,
  type CreateOrder,
  type UpdateOrderStatus,
} from '../lib/schemas'

// Query Keys
export const queryKeys = {
  menu: ['menu'] as const,
  orders: ['orders'] as const,
  order: (id: number) => ['orders', id] as const,
  stats: ['stats'] as const,
}

// Menu hooks
export function useMenu() {
  return useQuery({
    queryKey: queryKeys.menu,
    queryFn: async () => {
      const response = await api.get('/api/menu')
      // Extract data from ResponseInterceptor wrapper
      const { data } = response.data
      const parsed = MenuResponseSchema.parse(data)
      return parsed.menu
    },
  })
}

// Orders hooks
export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: async () => {
      const response = await api.get('/api/orders')
      // Extract data from ResponseInterceptor wrapper
      const { data } = response.data
      const parsed = GetOrdersResponseSchema.parse(data)
      return parsed.orders
    },
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: async () => {
      const response = await api.get(`/api/orders/${id}`)
      // Extract data from ResponseInterceptor wrapper
      const { success, data } = response.data
      // Use the data directly without parsing with GetOrderResponseSchema
      // because the inner data doesn't have success field
      if (!success || !data.order) {
        throw new Error(data.message || 'Order not found')
      }
      return data.order
    },
    enabled: !!id,
  })
}

// Stats hook
export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: async () => {
      const response = await api.get('/api/admin/stats')
      // Extract data from ResponseInterceptor wrapper
      const { data } = response.data
      const parsed = StatsResponseSchema.parse(data)
      return parsed.stats
    },
  })
}

// Mutations
export function useCreateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (orderData: CreateOrder) => {
      const response = await api.post('/api/orders', orderData)
      // Extract data from ResponseInterceptor wrapper
      const { success, data } = response.data
      // Use the data directly without parsing with CreateOrderResponseSchema
      // because the inner data doesn't have success field
      if (!success || !data.order) {
        throw new Error(data.message || 'Failed to create order')
      }
      return data.order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: UpdateOrderStatus['status'] }) => {
      const response = await api.patch(`/api/orders/${id}/status`, { status })
      // Extract data from ResponseInterceptor wrapper
      const { success, data } = response.data
      // Use the data directly without parsing with UpdateOrderStatusResponseSchema
      // because the inner data doesn't have success field
      if (!success || !data.order) {
        throw new Error(data.message || 'Failed to update order status')
      }
      return data.order
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders })
      queryClient.invalidateQueries({ queryKey: queryKeys.order(data.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}