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
      const parsed = MenuResponseSchema.parse(response.data)
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
      const parsed = GetOrdersResponseSchema.parse(response.data)
      return parsed.orders
    },
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: async () => {
      const response = await api.get(`/api/orders/${id}`)
      const parsed = GetOrderResponseSchema.parse(response.data)
      if (!parsed.success || !parsed.order) {
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
      const parsed = StatsResponseSchema.parse(response.data)
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
      const parsed = CreateOrderResponseSchema.parse(response.data)
      if (!parsed.success || !parsed.order) {
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
      const parsed = UpdateOrderStatusResponseSchema.parse(response.data)
      if (!parsed.success || !parsed.order) {
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