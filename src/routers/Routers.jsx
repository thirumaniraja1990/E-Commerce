import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import TnSpl from "../pages/TnSpl";
import AndhraSpl from "../pages/AndhraSpl";
import Cart from "../pages/Cart";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProductedRoute from "./ProductedRoute";

import AddProducts from "../admin/AddProducts";
import AllProducts from "../admin/AllProducts";
import Dashboard from "../admin/Dashboard";
import Users from "../admin/Users";
import Reviews from "../pages/Reviews";
import AddCategory from "../admin/AddCategory";
import Order from "../pages/Orders";
import AllOrder from "../admin/AllOrders";
import AddBanner from "../admin/AddBanner";
import Thankyou from "../pages/Thankyou";

const Routers = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='home' />} />
      <Route path='home' element={<Home />} />
      <Route path='reviews' element={<Reviews />} />
      <Route path='shop' element={<Shop />} />

      <Route path='tnspl' element={<TnSpl />} />
      <Route path='andhraspl' element={<AndhraSpl />} />

      <Route path='profile' element={<Profile />} />
      <Route path='shop/:id' element={<ProductDetails />} />
      <Route path='cart' element={<Cart />} />
      <Route path='order' element={<Order />} />
      <Route path='checkout' element={<Checkout />} />
      <Route path='/*' element={<ProductedRoute />}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='dashboard/all-products' element={<AllProducts />} />
        <Route path='dashboard/add-product' element={<AddProducts />} />
        <Route path='dashboard/add-category' element={<AddCategory />} />
        <Route path='dashboard/users' element={<Users />} />
        <Route path='dashboard/orders' element={<AllOrder />} />
        <Route path='dashboard/add-banner' element={<AddBanner />} />
      </Route>

      <Route path='login' element={<Login />} />
      <Route path='signup' element={<Signup />} />
      <Route path='Home' element={<Home />} />
      <Route path='thankyou' element={<Thankyou />} />
    </Routes>
  );
};

export default Routers;
