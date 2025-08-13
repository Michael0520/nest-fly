import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useMenu, useOrders, useStats } from './api/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Loader2, RefreshCw, Plus } from 'lucide-react';
import { OrderForm } from './components/OrderForm';
import { OrderStatusUpdater } from './components/OrderStatusUpdater';

function MenuPage() {
  const { data: menu = [], isLoading, error, refetch } = useMenu();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading menu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-destructive">Failed to load menu</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Restaurant Menu</h2>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <Card key={item.id} className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{item.name}</CardTitle>
                <Badge variant="default">
                  {item.cuisine}
                </Badge>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Cuisine: {item.cuisine}
                </span>
                <span className="text-2xl font-bold text-primary">
                  ${item.price}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function OrdersPage() {
  const { data: orders = [], isLoading, error, refetch } = useOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-destructive">Failed to load orders</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Orders</h2>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <OrderStatusUpdater key={order.id} order={order} />
        ))}
      </div>
      
      {orders.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function HomePage() {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Restaurant Management System</h2>
        <p className="text-muted-foreground">Welcome to the restaurant management system. Use the navigation to view the menu and manage orders.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Restaurant Statistics</CardTitle>
            <Button onClick={() => refetchStats()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading statistics...</span>
            </div>
          ) : statsError ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-destructive">Failed to load statistics</p>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalMenuItems}</div>
                <div className="text-sm text-muted-foreground">Menu Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalOrders}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">${stats.totalRevenue}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/menu">View Menu</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/orders">Manage Orders</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/create-order">Create New Order</Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function CreateOrderPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Create New Order</h2>
      <div className="max-w-4xl">
        <OrderForm />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-primary">Restaurant Manager</h1>
              </div>
              <div className="flex items-center space-x-6">
                <Link 
                  to="/" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link 
                  to="/menu" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Menu
                </Link>
                <Link 
                  to="/orders" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Orders
                </Link>
                <Button asChild size="sm">
                  <Link to="/create-order">
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/create-order" element={<CreateOrderPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;