import { z } from 'zod'

// Menu schemas
export const MenuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  cuisine: z.enum(['japanese', 'italian', 'general']),
})

export const MenuResponseSchema = z.object({
  message: z.string(),
  menu: z.array(MenuItemSchema),
})

// Order schemas
export const OrderItemSchema = z.object({
  menuItemId: z.number(),
  quantity: z.number(),
  specialInstructions: z.string().optional(),
})

export const OrderStatusSchema = z.enum(['pending', 'preparing', 'ready', 'served'])

export const OrderSchema = z.object({
  id: z.number(),
  customerName: z.string(),
  status: OrderStatusSchema,
  totalPrice: z.number(),
  orderTime: z.string(),
  items: z.array(MenuItemSchema),
})

// Create order DTO
export const CreateOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  itemIds: z.array(z.number()).min(1, 'At least one item must be ordered'),
})

// API Response schemas
export const CreateOrderResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  order: OrderSchema.optional(),
})

export const GetOrderResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  order: OrderSchema.optional(),
})

export const GetOrdersResponseSchema = z.object({
  message: z.string(),
  orders: z.array(OrderSchema),
})

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusSchema,
})

export const UpdateOrderStatusResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  order: OrderSchema.optional(),
})

export const RestaurantStatsSchema = z.object({
  totalMenuItems: z.number(),
  totalOrders: z.number(),
  totalRevenue: z.number(),
})

export const StatsResponseSchema = z.object({
  message: z.string(),
  stats: RestaurantStatsSchema,
})

// Type exports
export type MenuItem = z.infer<typeof MenuItemSchema>
export type MenuResponse = z.infer<typeof MenuResponseSchema>
export type OrderItem = z.infer<typeof OrderItemSchema>
export type Order = z.infer<typeof OrderSchema>
export type OrderStatus = z.infer<typeof OrderStatusSchema>
export type CreateOrder = z.infer<typeof CreateOrderSchema>
export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>
export type GetOrderResponse = z.infer<typeof GetOrderResponseSchema>
export type GetOrdersResponse = z.infer<typeof GetOrdersResponseSchema>
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>
export type UpdateOrderStatusResponse = z.infer<typeof UpdateOrderStatusResponseSchema>
export type RestaurantStats = z.infer<typeof RestaurantStatsSchema>
export type StatsResponse = z.infer<typeof StatsResponseSchema>