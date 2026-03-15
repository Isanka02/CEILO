import api from './axiosInstance';

// Users
export const getAllUsers = () => api.get('/admin/users');
export const blockUser   = (id) => api.put(`/admin/users/${id}/block`);
export const unblockUser = (id) => api.put(`/admin/users/${id}/unblock`);

// Orders
export const getAllOrders     = ()           => api.get('/admin/orders');
export const updateOrderStatus = (id, data) => api.put(`/admin/orders/${id}/status`, data);

// Analytics
export const getAnalytics = () => api.get('/admin/analytics');

// Notifications
export const sendNotification = (data) => api.post('/admin/notifications', data);