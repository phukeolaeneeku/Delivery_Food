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
import Contact from "./components/contact/Contact"
import ProfileEdit from "./components/profile/ProfileEdit";
import More from "./components/more/More";
import Search from "./components/header/Search";
import Table from "./components/table/Table"
//------ Admin ------//
import Dashboard from "./admin/Dashboard";
import Product_admin from "./admin/components/products/Product_Admin";
import Addproduct_admin from "./admin/components/products/AddProduct";
import Users from "./admin/components/menagerUser/Users";
import User_details from "./admin/components/menagerUser/User_details";
import OrderBill_Admin from "./admin/components/orderPage/OrderBill";
import Admins from "./admin/components/menagerAdmin/Admins";
import Add_Admin from "./admin/components/menagerAdmin/AddAdmin";
import StoreAdmin from "./admin/components/storeMenagement/StoreAdmin";
import Account_Admin from "./admin/components/accountAdmin/AccountAdmin";
import OrderPending from "./admin/components/orderPage/OrderPending";
import OrderProcess from "./admin/components/orderPage/OrderProcess";
import OrderShipped from "./admin/components/orderPage/OrderShipped";
import OrderDelivered from "./admin/components/orderPage/OrderDelivered";
import Payment_store from "./admin/components/payment_store/PaymentStore";
import AddPaymentStore from "./admin/components/payment_store/AddPaymentStore";
import EditAdmin from "./admin/components/menagerAdmin/EditAdmin";
import AccountAdmin from "./admin/components/accountAdmin/AccountAdmin";
import { CartProvider } from "./components/cart/CartContext";
import TableHotel from "./admin/components/tableManagement/TableHotel";
import AddHotel from "./admin/components/tableManagement/AddHotel";
import Edit from "./admin/components/tableManagement/Edit";
import AddCategory from "./admin/components/products/AddCategory";
import WebInfo from "./admin/components/managementInfo/WebInfo";
import AddInfo from "./admin/components/managementInfo/AddInfo";
import EditInfo from "./admin/components/managementInfo/EditInfo"



function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* --------- Login-Signup page---------- */}
          <Route path="/loginuser" Component={LoginUser} />
          <Route path="/forgotpassword" Component={ForgotPassword} />
          <Route path="/qrcode" Component={QRCode} />
          <Route path="/signup2" Component={Signup2} />

          {/* --------- Profile page---------- */}
          <Route path="/profileedit" Component={ProfileEdit} />
          <Route path="/more" Component={More} />
          <Route path="/contact" Component={Contact} />
          <Route path="/search" Component={Search} />

          {/* --------- Home Page ---------- */}
          <Route path="/hotel/:hotelName/room_number/:room_number/address/:address"  Component={Home} />
          <Route path="/"  Component={Home} />
          <Route path="/goods/:goods_id" Component={ProductDetails} />
          <Route path="/hotel/:hotelName/room_number/:room_number/address/:address/cart" Component={Cart} />
          <Route path="/cart" Component={Cart} />
          <Route path="/address" Component={Address} />
          <Route path="/payment" Component={Payment} />
          <Route path="/hotel/:hotelName/room_number/:room_number/address/:address/order" Component={Order} />
          <Route path="/order" Component={Order} />
          <Route path="/bill/:bill_id" Component={Bill} />
          <Route path="/table" Component={Table} />
      


          {/* --------- Admin ---------- */}
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/product-admin" Component={Product_admin} />
          <Route path="/addproduct-admin" Component={Addproduct_admin} />
          <Route path="/users" Component={Users} />
          <Route path="/user-details/:id" Component={User_details} />
          <Route path="/orderbill-admin/:bill_id" Component={OrderBill_Admin} />
          <Route path="/admins" Component={Admins} />
          <Route path="/add-admin" Component={Add_Admin} />
          <Route path="/edit-admin/:id" Component={EditAdmin} />
          <Route path="/store-admin" Component={StoreAdmin} />
          <Route path="/account-admin" Component={Account_Admin} />
          <Route path="/edit-account" Component={AccountAdmin} />
          <Route path="/order/pending" Component={OrderPending} />
          <Route path="/order/processing" Component={OrderProcess} />
          <Route path="/order/shipped" Component={OrderShipped} />
          <Route path="/order/delivered" Component={OrderDelivered} />
          <Route path="/payment-store" Component={Payment_store} />
          <Route path="/add-payment-store" Component={AddPaymentStore} />
          <Route path="/table-hotel" Component={TableHotel} />
          <Route path="/add-hotel" Component={AddHotel} />
          <Route path="/edit-hotel/:id" Component={Edit} />
          <Route path="/add-category" Component={AddCategory} />
          <Route path="/info" Component={WebInfo} />
          <Route path="/add-info" Component={AddInfo} />
          <Route path="/edit-info" Component={EditInfo} />
          
        </Routes>
      </Router>
    </CartProvider>
  );
}
export default App;
