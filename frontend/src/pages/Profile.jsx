import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { useWishlist } from '../context/WishlistContext.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import axios from '../api/axios.js';

const Profile = () => {
  const { user, updateProfile, uploadAvatar, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();

  const { data: myOrders, isLoading: loadingOrders } = useQuery({
    queryKey: ['myorders'],
    queryFn: async () => {
      const res = await axios.get('/orders/myorders', { withCredentials: true });
      return res.data;
    }
  });

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ name, email });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error('Please fill all password fields');
    setIsLoading(true);
    try {
      // Assuming a separate endpoint or handled in updateProfile if mapped correctly
      // We added /api/auth/profile/password earlier
      // We can just hit it via axios here or add it to AuthContext. Let's add it to AuthContext later or just use updateProfile if it handles it.
      await updateProfile({ currentPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await uploadAvatar(file);
        toast.success('Avatar uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload avatar');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-serif">My Account</h1>
        <Button variant="outline" onClick={logout}>Sign Out</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative group w-32 h-32 mb-4">
                <img
                  src={user?.avatar ? user.avatar : 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-muted"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <span>Change</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
              <TabsTrigger value="profile" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3">Profile Settings</TabsTrigger>
              <TabsTrigger value="orders" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3">My Orders</TabsTrigger>
              <TabsTrigger value="wishlist" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3">Wishlist</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your profile details and email address.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading}>Save Changes</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <Button type="submit" variant="secondary" disabled={isLoading}>Update Password</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>View and track your recent orders.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="text-center py-12 text-muted-foreground">Loading orders...</div>
                  ) : myOrders?.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      You haven't placed any orders yet.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {myOrders?.map(order => (
                        <div key={order._id} className="border border-border p-6 rounded-lg">
                          <div className="flex justify-between items-center border-b border-border pb-4 mb-4">
                            <div>
                              <p className="text-xs uppercase tracking-widest text-muted-foreground">Order #{order._id.substring(0,8)}</p>
                              <p className="font-display text-lg">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs ${order.isPaid ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                {order.isPaid ? 'Paid' : 'Unpaid'}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {order.orderItems.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                  <img src={item.image || 'https://via.placeholder.com/50'} className="w-12 h-12 object-cover rounded" />
                                  <span>{item.quantity}x {item.name}</span>
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                            <span className="font-body text-muted-foreground text-sm uppercase tracking-widest">Total</span>
                            <span className="font-display text-xl text-primary">${order.totalPrice?.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>My Wishlist</CardTitle>
                  <CardDescription>Items you've saved for later.</CardDescription>
                </CardHeader>
                <CardContent>
                  {!wishlist?.products || wishlist.products.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Your wishlist is empty.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {wishlist.products.map(product => (
                        <div key={product._id} className="relative border border-border p-4 bg-card group">
                          <Link to={`/product/${product._id}`} className="block aspect-square bg-muted mb-4 overflow-hidden">
                            <img 
                              src={product.images?.[0]?.url || 'https://via.placeholder.com/150'} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </Link>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs uppercase tracking-widest text-primary mb-1">{product.type}</p>
                              <Link to={`/product/${product._id}`} className="font-display text-lg text-foreground hover:text-primary transition-colors">
                                {product.name}
                              </Link>
                              <p className="text-muted-foreground font-body text-sm mt-1">${product.price?.toFixed(2)}</p>
                            </div>
                            <button 
                              onClick={() => removeFromWishlist(product._id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-2"
                              aria-label="Remove from wishlist"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
