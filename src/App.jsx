import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

//------ Login-SignUp Page ------//
import LoginUser from "./components/loginAndSignup/LoginUser";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import Signup2 from "./components/loginAndSignup/Signup2";
import AddProduct from "./components/seller/addProduct/AddProduct";
import QRCode from "../QRCode";

//------ Home Page ------//
import Home from "./components/homePage/HomePage";
import ProductDetails from "./components/products/ProductDetails";
import Cart from "./components/cart/Cart";
import Address from "./components/cart/Address";
import Payment from "./components/cart/Payment";
import Order from "./components/order/Order";
import Bill from "./components/order/Bill";
import Contact from "./components/contact/Contact";
import ProfileEdit from "./components/profile/ProfileEdit";
import More from "./components/more/More";
import Search from "./components/header/Search";
import Table from "./components/table/Table";

//------ Admin ------//
import Dashboard from "./admin/Dashboard";
import ProductAdmin from "./admin/components/products/Product_Admin";
import AddProductAdmin from "./admin/components/products/AddProduct";
import Users from "./admin/components/menagerUser/Users";
import UserDetails from "./admin/components/menagerUser/User_details";
import OrderBillAdmin from "./admin/components/orderPage/OrderBill";
import Admins from "./admin/components/menagerAdmin/Admins";
import AddAdmin from "./admin/components/menagerAdmin/AddAdmin";
import StoreAdmin from "./admin/components/storeMenagement/StoreAdmin";
import AccountAdmin from "./admin/components/accountAdmin/AccountAdmin";
import OrderPending from "./admin/components/orderPage/OrderPending";
import OrderProcess from "./admin/components/orderPage/OrderProcess";
import OrderShipped from "./admin/components/orderPage/OrderShipped";
import OrderDelivered from "./admin/components/orderPage/OrderDelivered";
import PaymentStore from "./admin/components/payment_store/PaymentStore";
import AddPaymentStore from "./admin/components/payment_store/AddPaymentStore";
import EditAdmin from "./admin/components/menagerAdmin/EditAdmin";
import TableHotel from "./admin/components/tableManagement/TableHotel";
import AddHotel from "./admin/components/tableManagement/AddHotel";
import EditHotel from "./admin/components/tableManagement/Edit";
import AddCategory from "./admin/components/products/AddCategory";
import WebInfo from "./admin/components/managementInfo/WebInfo";
import AddInfo from "./admin/components/managementInfo/AddInfo";
import EditInfo from "./admin/components/managementInfo/EditInfo";
import { CartProvider } from "./components/cart/CartContext";

function App() {

  function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 50);
    };

    useEffect(() => {
      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
      <div className="scroll-to-top">
        {isVisible && (
          <button onClick={scrollToTop}>
            <i>Click to top</i>
          </button>
        )}
      </div>
    );
  }

  return (
    <>

      <CartProvider>
        <Router>
          <Routes>
            {/* --------- Login-Signup page---------- */}
            <Route path="/loginuser" element={<LoginUser />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/qrcode" element={<QRCode />} />
            <Route path="/signup2" element={<Signup2 />} />

            {/* --------- Profile page---------- */}
            <Route path="/profileedit" element={<ProfileEdit />} />
            <Route path="/more" element={<More />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<Search />} />

            {/* --------- Home Page ---------- */}
            <Route
              path="/hotel/:hotelName/room_number/:room_number/address/:address" element={<Home />}
            />
            <Route path="/" element={<Home />} />
            <Route path="/goods/:goods_id" element={<ProductDetails />} />
            <Route
              path="/hotel/:hotelName/room_number/:room_number/address/:address/cart" element={<Cart />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/address" element={<Address />} />
            <Route path="/payment" element={<Payment />} />
            <Route
              path="/hotel/:hotelName/room_number/:room_number/address/:address/order" element={<Order />}
            />
            <Route path="/order" element={<Order />} />
            <Route path="/bill/:bill_id" element={<Bill />} />
            <Route path="/table" element={<Table />} />

            {/* --------- Admin ---------- */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product-admin" element={<ProductAdmin />} />
            <Route path="/addproduct-admin" element={<AddProductAdmin />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user-details/:id" element={<UserDetails />} />
            <Route
              path="/orderbill-admin/:bill_id"
              element={<OrderBillAdmin />}
            />
            <Route path="/admins" element={<Admins />} />
            <Route path="/add-admin" element={<AddAdmin />} />
            <Route path="/edit-admin/:id" element={<EditAdmin />} />
            <Route path="/store-admin" element={<StoreAdmin />} />
            <Route path="/account-admin" element={<AccountAdmin />} />
            <Route path="/order/pending" element={<OrderPending />} />
            <Route path="/order/processing" element={<OrderProcess />} />
            <Route path="/order/shipped" element={<OrderShipped />} />
            <Route path="/order/delivered" element={<OrderDelivered />} />
            <Route path="/payment-store" element={<PaymentStore />} />
            <Route path="/add-payment-store" element={<AddPaymentStore />} />
            <Route path="/table-hotel" element={<TableHotel />} />
            <Route path="/add-hotel" element={<AddHotel />} />
            <Route path="/edit-hotel/:id" element={<EditHotel />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/info" element={<WebInfo />} />
            <Route path="/add-info" element={<AddInfo />} />
            <Route path="/edit-info" element={<EditInfo />} />
          </Routes>
        </Router>
      </CartProvider>
      <ScrollToTopButton />
    </>
  );
}

export default App;
