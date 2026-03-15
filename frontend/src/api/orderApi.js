import api from './axiosInstance';

export const createOrder  = (data) => api.post('/orders', data);
export const getMyOrders  = ()     => api.get('/orders/my-orders');
export const getOrderById = (id)   => api.get(`/orders/${id}`);
export const cancelOrder  = (id)   => api.put(`/orders/${id}/cancel`);
export const markAsPaid   = (id)   => api.put(`/orders/${id}/mark-paid`);  // admin