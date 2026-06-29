import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useQuery } from '@tanstack/react-query';
import axios from '../api/axios.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { Button } from '../components/ui/button.jsx';
import { Package, Users, ShoppingBag, Trash2, Edit, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const res = await axios.get('/products?pageSize=1000');
      return res.data.products || res.data; // Handle pagination structure
    }
  });

  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await axios.get('/users', { withCredentials: true });
      return res.data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axios.get('/orders/stats', { withCredentials: true });
      return res.data;
    }
  });

  const { data: orders } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const res = await axios.get('/orders');
      return res.data;
    }
  });

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen pt-32 pb-24 flex justify-center items-center">
        <p className="text-destructive font-body text-xl uppercase tracking-widest">Access Denied</p>
      </div>
    );
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/products/${id}`, { withCredentials: true });
        toast.success('Product deleted successfully');
        refetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-foreground">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <Package size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{products?.length || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <ShoppingBag size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{orders?.length || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{users?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent mb-8">
            <TabsTrigger value="overview" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3 font-body uppercase tracking-widest text-xs">Overview</TabsTrigger>
            <TabsTrigger value="products" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3 font-body uppercase tracking-widest text-xs">Products</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3 font-body uppercase tracking-widest text-xs">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats?.totalSales?.toFixed(2) || '0.00'}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                  <Package className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users?.length || 0}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                {stats?.monthlySales && stats.monthlySales.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--primary))' }}
                      />
                      <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No sales data available yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl">Manage Products</h2>
              <button className="flex items-center gap-2 bg-gold-shimmer text-primary-foreground px-4 py-2 hover-gold-glow transition-all font-body text-xs tracking-widest uppercase">
                <Plus size={16} /> Add Product
              </button>
            </div>
            
            <div className="border border-border bg-card overflow-x-auto">
              <table className="w-full text-left text-sm font-body">
                <thead className="bg-muted text-muted-foreground uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products?.map((product) => (
                    <tr key={product._id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{product._id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 font-medium">{product.name}</td>
                      <td className="px-6 py-4">${product.price?.toFixed(2)}</td>
                      <td className="px-6 py-4 capitalize">{product.category?.name || product.type}</td>
                      <td className="px-6 py-4 flex justify-end gap-3">
                        <button className="text-muted-foreground hover:text-primary transition-colors"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="font-display text-2xl mb-6">Manage Orders</h2>
            
            <div className="border border-border bg-card overflow-x-auto">
              <table className="w-full text-left text-sm font-body">
                <thead className="bg-muted text-muted-foreground uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Paid</th>
                    <th className="px-6 py-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders?.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">No orders found.</td>
                    </tr>
                  )}
                  {orders?.map((order) => (
                    <tr key={order._id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{order._id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 font-medium">{order.user?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">${order.totalPrice?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${order.isPaid ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {order.isPaid ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline text-xs tracking-widest uppercase">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
