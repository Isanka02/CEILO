import api from './axiosInstance';

export const getShopReviews  = ()   => api.get('/shop-reviews');
export const deleteShopReview = (id) => api.delete(`/shop-reviews/${id}`);  // admin