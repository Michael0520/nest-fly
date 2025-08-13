import { useState } from 'react';
import { useMenu, useCreateOrder } from '../api/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Loader2, Plus, Minus } from 'lucide-react';
import type { MenuItem } from '../lib/schemas';

export function OrderForm() {
  const { data: menu = [], isLoading: menuLoading } = useMenu();
  const createOrderMutation = useCreateOrder();
  const [customerName, setCustomerName] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ [key: number]: number }>({});

  const handleQuantityChange = (itemId: number, delta: number) => {
    setSelectedItems(prev => {
      const newQuantity = (prev[itemId] || 0) + delta;
      if (newQuantity <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const getTotalAmount = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = menu.find(m => m.id === parseInt(itemId));
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getSelectedItemIds = () => {
    return Object.entries(selectedItems).flatMap(([itemId, quantity]) => 
      Array(quantity).fill(parseInt(itemId))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemIds = getSelectedItemIds();
    
    if (customerName.trim() && itemIds.length > 0) {
      createOrderMutation.mutate({
        customerName: customerName.trim(),
        itemIds,
      }, {
        onSuccess: () => {
          setCustomerName('');
          setSelectedItems({});
        },
      });
    }
  };

  if (menuLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading menu...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
        <CardDescription>Select menu items and enter customer information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium mb-2">
              Customer Name
            </label>
            <Input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Select Menu Items</h3>
            <div className="space-y-3">
              {menu.map((item: MenuItem) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.cuisine}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-sm font-semibold text-primary">${item.price}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={!selectedItems[item.id]}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {selectedItems[item.id] || 0}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {Object.keys(selectedItems).length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${getTotalAmount().toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!customerName.trim() || Object.keys(selectedItems).length === 0 || createOrderMutation.isPending}
          >
            {createOrderMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Order...
              </>
            ) : (
              'Create Order'
            )}
          </Button>

          {createOrderMutation.error && (
            <p className="text-destructive text-sm">
              {createOrderMutation.error.message || 'Failed to create order'}
            </p>
          )}

          {createOrderMutation.isSuccess && (
            <p className="text-green-600 text-sm">
              Order created successfully!
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}