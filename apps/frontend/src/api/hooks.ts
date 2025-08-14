import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './config'
import {
  MenuResponseSchema,
  GetOrdersResponseSchema,
  GetOrderResponseSchema,
  CreateOrderResponseSchema,
  UpdateOrderStatusResponseSchema,
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
      const parsed = GetOrderResponseSchema.parse(data)
      if (!success || !parsed.order) {
        throw new Error(parsed.message || 'Order not found')
      }
      return parsed.order
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
      const parsed = CreateOrderResponseSchema.parse(data)
      if (!success || !parsed.order) {
        throw new Error(parsed.message || 'Failed to create order')
      }
      return parsed.order
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
      const parsed = UpdateOrderStatusResponseSchema.parse(data)
      if (!success || !parsed.order) {
        throw new Error(parsed.message || 'Failed to update order status')
      }
      return parsed.order
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders })
      queryClient.invalidateQueries({ queryKey: queryKeys.order(data.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}