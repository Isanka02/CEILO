import api from './axiosInstance';

export const getProducts      = (params) => api.get('/products', { params });   // ?category=&search=&page=
export const getProductBySlug = (slug)   => api.get(`/products/${slug}`);
export const createProduct    = (data)   => api.post('/products', data);         // FormData with images[]
export const updateProduct    = (id, data) => api.put(`/products/${id}`, data);  // FormData
export const deleteProduct    = (id)     => api.delete(`/products/${id}`);

export const getProductReviews = (productId)       => api.get(`/products/${productId}/reviews`);
export const addProductReview  = (productId, data) => api.post(`/products/${productId}/reviews`, data);