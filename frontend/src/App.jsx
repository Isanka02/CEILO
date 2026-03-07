import React from 'react';
import { Routes, Route } from 'react-router-dom';



// ─── Auth ─────────────────────────────────────────────────────────────────────
import Login         from './pages/auth/login';
import Register      from './pages/auth/register';
import ForgotPwd     from './pages/auth/forgotPwd';
import ResetPwd      from './pages/auth/resetPwd';

// ─── Shop ─────────────────────────────────────────────────────────────────────
import ProductHome          from './pages/shop/productHome';
import ProductList          from './pages/shop/productList';
import SingleProductDetail  from './pages/shop/singleProductDetail';
import FilteredByCategory   from './pages/shop/filteredByCategory';
import Reviews              from './pages/shop/reviews';
import ShopReviews          from './pages/shop/shopReviews';

// ─── Orders ───────────────────────────────────────────────────────────────────
import Checkout     from './pages/orders/checkout';
import MyOrders     from './pages/orders/myOrders';
import OrderDetails from './pages/orders/orderDetails';

// ─── Notifications ────────────────────────────────────────────────────────────
import Notification from './pages/notification/notification';

// ─── User Account ─────────────────────────────────────────────────────────────
import Profile       from './pages/userAcc/profile';
import Addresses     from './pages/userAcc/addresses';
import SavedWishList from './pages/userAcc/savedWishList';
import SingleOrder   from './pages/userAcc/singleOrder';
import UserOrders    from './pages/userAcc/myOrders';

// ─── Admin Panel ──────────────────────────────────────────────────────────────
import AnalyticsDash         from './pages/adminPanel/analyticsDash';
import CategoriesAdmin       from './pages/adminPanel/categoriesAdmin';
import OrdersAdmin           from './pages/adminPanel/ordersAdmin';
import ProductAdmin          from './pages/adminPanel/productAdmin';
import SendNotificationAdmin from './pages/adminPanel/sendNotificationAdmin';
import UserAdmin             from './pages/adminPanel/userAdmin';
import ShopReviewsAdmin from './pages/adminPanel/shopReviewsAdmin';


function App() {
  return (
      <Routes>

        {/* ── Public / Shop ─────────────────────────────────────────────── */}
        <Route path="/"                         element={<ProductHome />} />
        <Route path="/products"                 element={<ProductList />} />
        <Route path="/products/:slug"           element={<SingleProductDetail />} />
        <Route path="/category/:slug"           element={<FilteredByCategory />} />
        <Route path="/products/:slug/reviews"   element={<Reviews />} />
        <Route path="/shop-reviews"             element={<ShopReviews />} />

        {/* ── Auth ──────────────────────────────────────────────────────── */}
        <Route path="/login"                    element={<Login />} />
        <Route path="/register"                 element={<Register />} />
        <Route path="/forgot-password"          element={<ForgotPwd />} />
        <Route path="/reset-password/:token"    element={<ResetPwd />} />

        {/* ── Orders ────────────────────────────────────────────────────── */}
        <Route path="/checkout"                 element={<Checkout />} />
        <Route path="/my-orders"                element={<MyOrders />} />
        <Route path="/orders/:id"               element={<OrderDetails />} />

        {/* ── Notifications ─────────────────────────────────────────────── */}
        <Route path="/notifications"            element={<Notification />} />

        {/* ── User Account ──────────────────────────────────────────────── */}
        <Route path="/profile"                  element={<Profile />} />
        <Route path="/profile/addresses"        element={<Addresses />} />
        <Route path="/profile/saved"            element={<SavedWishList />} />
        <Route path="/profile/orders"           element={<UserOrders />} />
        <Route path="/profile/orders/:id"       element={<SingleOrder />} />

        {/* ── Admin Panel ───────────────────────────────────────────────── */}
        <Route path="/admin"                    element={<AnalyticsDash />} />
        <Route path="/admin/analytics"          element={<AnalyticsDash />} />
        <Route path="/admin/categories"         element={<CategoriesAdmin />} />
        <Route path="/admin/orders"             element={<OrdersAdmin />} />
        <Route path="/admin/products"           element={<ProductAdmin />} />
        <Route path="/admin/notifications"      element={<SendNotificationAdmin />} />
        <Route path="/admin/users"              element={<UserAdmin />} />
        <Route path="/admin/shop-reviews"       element={<ShopReviewsAdmin/>} />                 


      </Routes>

  );
}

export default App;