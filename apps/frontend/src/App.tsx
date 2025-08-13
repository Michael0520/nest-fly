import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { restaurantApi, type MenuItem, type Order } from './api/restaurant';
import './App.css';

function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuData = await restaurantApi.getMenu();
        setMenu(menuData);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) return <div>Loading menu...</div>;

  return (
    <div>
      <h2>Restaurant Menu</h2>
      <div className="menu-grid">
        {menu.map((item) => (
          <div key={item.id} className="menu-item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Category: {item.category}</p>
            <p className="price">${item.price}</p>
            <p className={`availability ${item.available ? 'available' : 'unavailable'}`}>
              {item.available ? 'Available' : 'Out of Stock'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await restaurantApi.getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2>Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <h3>Order #{order.id}</h3>
            <p>Table: {order.tableNumber}</p>
            <p>Status: <span className={`status-${order.status}`}>{order.status}</span></p>
            <p>Total: ${order.totalAmount}</p>
            <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div>
      <h2>Restaurant Management System</h2>
      <p>Welcome to the restaurant management system. Use the navigation to:</p>
      <ul>
        <li>View the menu</li>
        <li>Manage orders</li>
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>Restaurant Manager</h1>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/orders">Orders</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;