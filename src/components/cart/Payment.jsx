import { FiPlus, FiCopy } from "react-icons/fi";
import "./payment.css";
import qrcode from "../../img/QRCODE.png";
import wechat from "../../img/WeChat.png";
import Menu from "../menuFooter/Menu";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import { IoIosArrowBack } from "react-icons/io";
import { FaAngleLeft, FaUsers } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Payment = ({ orders, order_from, onPay }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [store_name, set_store_name] = useState("");
  const [store_id, set_store_id] = useState([]);
  const [store_account_number, set_store_account_number] = useState("");
  const navigate = useNavigate();
  const [tel, set_tel] = useState("");
  const [account_name, set_account_name] = useState("");
  const [more, set_more] = useState([]);
  const [province, set_province] = useState("");
  const [district, set_district] = useState("");
  const [shipping_company, set_shipping_company] = useState(0);
  const [branch, set_branch] = useState(0);
  const [copied, setCopied] = useState(false);
  const MySwal = withReactContent(Swal);
  const [paymentMethod, setPaymentMethod] = useState("");

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }
  var totalPrice = 0;

  useEffect(() => {
    // Extract store_id from each product and update state
    const id = orders.flatMap((order) => order.store);
    set_store_id(id);
    set_more(
      orders.flatMap((order) =>
        order.items.map((item) => ({ itemName: item.name, description: "" }))
      )
    );
  }, [orders]); // Update state whenever orders change

  useEffect(() => {
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/check-token",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.result !== "success") {
          localStorage.clear();
          navigate("/loginuser");
        }
      })
      .catch((error) => {
        localStorage.clear();
        console.log(error);
        navigate("/loginuser");
      });
  }, [token, navigate]);

  useEffect(() => {
    if (store_id.length > 0) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${
          import.meta.env.VITE_API
        }/store/bank-accounts/detail/?store_id=${store_id}`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .request(config)
        .then((response) => {
          set_store_account_number(response.data[0].account_number);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [store_id]);

  useEffect(() => {
    if (order_from === "cart") {
      const localCart = localStorage.getItem("cart");
      const cart = localCart ? JSON.parse(localCart) : [];
      set_store_name(orders[0]?.items[0]?.store_name || "");
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [order_from, orders]);

  const handleTel = (e) => {
    const value = e.target.value;
    set_tel(value);
  };

  const handleProvince = (e, index) => {
    const value = e.target.value;
    set_more((prevMore) =>
      prevMore.map((item, i) =>
        i === index ? { ...item, description: value } : item
      )
    );

    // Concatenate names and descriptions into province
    const newProvince = more
      .map((item) => `${item.itemName}: ${item.description}`)
      .join(", ");
    set_province(newProvince);
  };

  const handleDistrict = (e) => {
    const value = e.target.value;
    set_district(value);
  };

  const handleAccountName = (e) => {
    const value = e.target.value;
    set_account_name(value);
  };

  const handlePaymentMethod = (event) => {
    const value = event.target.value;
    setPaymentMethod(value);
    if (value === "Cash") {
      set_account_name(value);
    } else {
      set_account_name("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(store_account_number);
    alert("Account number copied to clipboard!");
  };

  const handlePay = () => {
    if (!tel) {
      MySwal.fire({
        text: "Please add the contact number or KakaotalkID!",
        icon: "question",
      });
      return;
    }
    if (!district) {
      MySwal.fire({
        text: "Please add the address!",
        icon: "question",
      });
      return;
    }
    if (!account_name) {
      MySwal.fire({
        text: "Please add the account name!",
        icon: "question",
      });
      return;
    }

    const products = orders.flatMap((order) =>
      order.items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size,
      }))
    );

    let data = JSON.stringify({
      user: user_id,
      store: orders[0].store,
      tel: tel,
      status: "Pending",
      total_prices: totalPrice,
      province: province,
      district: district,
      shipping_company: shipping_company,
      branch: branch,
      account_name: account_name,
      items: products,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/order/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        MySwal.fire({
          text: "The order has been completed.",
          icon: "success",
        });
        if (order_from === "buy_now") {
          navigate("/");
        } else {
          const storedCartJsonString = localStorage.getItem("cart");
          if (storedCartJsonString) {
            const storedCart = JSON.parse(storedCartJsonString);
            const updatedCart = storedCart.filter(
              (item) => item.store_name !== store_name
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));
          }
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Header />
      <div className="guopBoxPayment_container">
        <h2 className="h2_boxPayment">Payment</h2>
        <div className="adress_payment_content">
          <h2>Details:</h2>

          {orders.map((product, index) => (
            <div key={index}>
              {product.items.map((item, itemIndex) => (
                <div className="box_item_gourp" key={item.id}>
                  <div className="box_item_image">
                    <img src={item.images} alt="" />
                    <div className="box_item_text">
                      <p>Name: {item.name}</p>
                      <p>
                        Price: $
                        {parseFloat(item.price).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                          useGrouping: true,
                        })}
                      </p>
                      <p>
                        Quantity:{" "}
                        {parseFloat(item.quantity).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                          useGrouping: true,
                        })}
                      </p>
                      <textarea
                        type="text"
                        placeholder="Description..."
                        className="txt_textarea_description"
                        value={
                          more[index * product.items.length + itemIndex]
                            ?.description || ""
                        }
                        onChange={(e) =>
                          handleProvince(
                            e,
                            index * product.items.length + itemIndex
                          )
                        }
                      />
                      <p hidden>{(totalPrice += item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <h2>Address:</h2>
          <div className="box_address">
            <form className="box_address_input">
              <div className="box">
                <label htmlFor="prov">Contact number:</label>
                <input
                  type="text"
                  id="prov"
                  value={tel}
                  onChange={handleTel}
                  placeholder="Phone number or KakaotalkID "
                />
              </div>

              <div className="box">
                <label htmlFor="city">Address:</label>
                <input
                  type="text"
                  id="city"
                  value={district}
                  onChange={handleDistrict}
                  placeholder="Detail address village, city, hotel"
                />
              </div>

              <div className="box">
                <label htmlFor="category">
                  Enter your bank account name in case of transfer or Enter
                  "Cash" in case of cash payment
                </label>
                <select
                  name="category"
                  className="product_category"
                  required
                  onChange={handlePaymentMethod}
                >
                  <option value="">Select cash or transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </div>
            </form>
          </div>

          <div className="box_transfer">
            {paymentMethod === "Transfer" ? (
              <div className="box_address_input">
                <div className="box">
                  <label htmlFor="name">Account name:</label>
                  <input
                    type="text"
                    id="name"
                    value={account_name}
                    onChange={handleAccountName}
                    placeholder="Account name"
                  />
                </div>
                <p className="box_transfer_p_line">
                  Please transfer money to this account
                </p>
                <div className="boxaccount_number">
                  <div className="boxaccount_number_p">
                    <p>Account number</p>
                    <p>{store_account_number}</p>
                  </div>
                  <FiCopy
                    className="iconnn_copy_account"
                    onClick={copyToClipboard}
                  />
                </div>
              </div>
            ) : (
              <input
                className="disable_input"
                type="text"
                id="name"
                value={account_name}
                onChange={handleAccountName}
                placeholder="Account name"
              />
            )}
            <p className="box_containner_total">
              Total price:
              <span>
                {" "}
                $
                {parseFloat(totalPrice).toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                  useGrouping: true,
                })}
              </span>
            </p>
          </div>
          <Link onClick={handlePay} className="save">
            Confirm
          </Link>
        </div>
      </div>
      <Menu />
    </>
  );
};

export default Payment;
