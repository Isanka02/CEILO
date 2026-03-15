import api from './axiosInstance';

export const getProfile    = ()     => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);   // FormData (avatar)

export const addAddress    = (data)      => api.post('/users/address', data);
export const deleteAddress = (addressId) => api.delete(`/users/address/${addressId}`);

export const getSavedItems  = ()          => api.get('/users/saved');
export const saveItem       = (productId) => api.post(`/users/saved/${productId}`);
export const removeSavedItem = (productId) => api.delete(`/users/saved/${productId}`);