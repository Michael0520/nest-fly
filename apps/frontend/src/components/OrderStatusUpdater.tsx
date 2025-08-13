import { useState } from 'react';
import { useUpdateOrderStatus } from '../api/hooks';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';
import type { Order, OrderStatus } from '../lib/schemas';

interface OrderStatusUpdaterProps {
  order: Order;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'served', label: 'Served' },
];

export function OrderStatusUpdater({ order }: OrderStatusUpdaterProps) {
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
  const updateStatusMutation = useUpdateOrderStatus();

  const handleStatusUpdate = () => {
    if (newStatus !== order.status) {
      updateStatusMutation.mutate({ id: order.id, status: newStatus });
    }
  };

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'outline';
      case 'preparing': return 'secondary';
      case 'ready': return 'default';
      case 'served': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Order #{order.id}</CardTitle>
            <CardDescription>Customer: {order.customerName}</CardDescription>
          </div>
          <Badge variant={getStatusVariant(order.status)}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total:</span>
            <span className="ml-2 font-semibold">${order.totalPrice}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Items:</span>
            <span className="ml-2">{order.items.length}</span>
          </div>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Created:</span>
          <span className="ml-2">{new Date(order.orderTime).toLocaleString()}</span>
        </div>

        <div className="space-y-2">
          <label htmlFor={`status-${order.id}`} className="block text-sm font-medium">
            Update Status
          </label>
          <div className="flex space-x-2">
            <Select
              id={`status-${order.id}`}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="flex-1"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Button
              onClick={handleStatusUpdate}
              disabled={newStatus === order.status || updateStatusMutation.isPending}
              size="sm"
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </div>

        {updateStatusMutation.error && (
          <p className="text-destructive text-sm">
            {updateStatusMutation.error.message || 'Failed to update status'}
          </p>
        )}

        {updateStatusMutation.isSuccess && (
          <p className="text-green-600 text-sm">
            Status updated successfully!
          </p>
        )}
      </CardContent>
    </Card>
  );
}