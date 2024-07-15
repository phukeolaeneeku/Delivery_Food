import { FiPlus } from "react-icons/fi";
import "./payment.css";
import qrcode from "../../img/QRCODE.png";
import wechat from "../../img/WeChat.png";
import Menu from "../menuFooter/Menu";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import { IoIosArrowBack } from "react-icons/io";
import { FiCopy } from "react-icons/fi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
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
  const [more, set_more] = useState('');
  const [province, set_province] = useState([]);
  const [district, set_district] = useState("");
  const [shipping_company, set_shipping_company] = useState(0);
  const [branch, set_branch] = useState(0);
  const [copied, setCopied] = useState(false);
  const MySwal = withReactContent(Swal);


  // For order by cart
  if (order_from === "cart") {
    const [cart, setCart] = useState(() => {
      const localCart = localStorage.getItem("cart");
      return localCart ? JSON.parse(localCart) : [];
    });
    useEffect(() => {
      set_store_name(orders[0]?.items[0]?.store_name || ""); // Moved set_store_name inside useEffect
      localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart, orders]);
  }

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }
  var totalPrice = 0;

  useEffect(() => {
    // Extract store_id from each product and update state
    const id = orders.flatMap((order) => order.store);
    set_store_id(id);
  }, [orders]); // Update state whenever orders change

  // console.log("store: ", store_id);
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
        if (response.data.result != "success") {
          localStorage.clear();
          navigate("/loginuser");
          return;
        }
      })
      .catch((error) => {
        localStorage.clear();
        console.log(error);
        navigate("/loginuser");
        return;
      });
  }, [token]);

  // For get bacnk account by store
  useEffect(() => {
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        import.meta.env.VITE_API +
        `/store/bank-accounts/detail/?store_id=${store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response);
        set_store_account_number(response.data[0].account_number);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [store_id]);

  const handleTel = (e) => {
    const value = e.target.value;
    set_tel(value);
  };
  const handleImage = (e) => {
    set_statement_image(e.target.files[0]);
  };
  const handleProvince = (e) => {
    const value = e.target.value;
    set_more(value);
  };
  const handleDistrict = (e) => {
    const value = e.target.value;
    set_district(value);
  };
  // const handlePaymentMethod = (e) => {
  //   const value = e.target.value;
  //   set_payment_method(value);
  // };
  const handleBranch = (e) => {
    const value = e.target.value;
    set_branch(value);
  };
  const handleAccountName = (e) => {
    const value = e.target.value;
    set_account_name(value);
  };

  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(store_account_number);
  //   setCopied(true);
  //   setTimeout(() => {
  //     setCopied(false);
  //   }, 3600000); // Reset the copied state after 1 hour
  // };

  const handlePay = () => {
    if (!tel) {
      MySwal.fire({
        text: "Please add the contact number or kakaotalkID!",
        icon: "question",
      });
      return; // Abort the function if tel is null
    }
    if (!district) {
      MySwal.fire({
        text: "Please add the address!",
        icon: "question",
      });
      return; // Abort the function if district is null
    }
    if (!account_name) {
      MySwal.fire({
        text: "Please add the account name!",
        icon: "question",
      });
      return; // Abort the function if statement_image is null
    }
    // if (!payment_method) {
    //   MySwal.fire({
    //     text: "Please choose payment cash or transfer!",
    //     icon: "question",
    //   });
    //   return; // Abort the function if district is null
    // }

    // if (!shipping_company) {
    //   MySwal.fire({
    //     text: "Please add the money shipping company name!",
    //     icon: "question",
    //   });
    //   return; // Abort the function if shipping_company is null
    // }
    // if (!branch) {
    //   MySwal.fire({
    //     text: "Please add the branch!",
    //     icon: "question",
    //   });
    //   return; // Abort the function if branch is null
    // }

    // Extract product information from each order
    const products = orders.flatMap((order) =>
      order.items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size,
      }))
    );

    // alert(orders[0].store)

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
      items: products.map((product) => ({
        product: product.product,
        quantity: product.quantity,
        price: product.price,
        color: product.color,
        size: product.size,
      })),
    });

    console.log("Dataaaaaa......", data);

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
          text: "The order has been complated.",
          icon: "success",
        });
        if (order_from === "buy_now") {
          navigate("/");
          return;
        } else {
          // Retrieve the current cart data from localStorage
          const storedCartJsonString = localStorage.getItem("cart");
          if (storedCartJsonString) {
            // Parse the JSON string to get the cart array
            const storedCart = JSON.parse(storedCartJsonString);

            // Filter out the paid items based on the store_name
            const updatedCart = storedCart.filter(
              (item) => item.store_name !== store_name
            );

            // Convert the updated cart array to a JSON string
            const updatedCartJsonString = JSON.stringify(updatedCart);

            // Update localStorage with the filtered cart data
            localStorage.setItem("cart", updatedCartJsonString);
          }

          navigate("/");
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // console.log(orders);

  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePaymentMethod = (event) => {
    if (event.target.value == "Cash") {
      set_account_name(event.target.value);
    } else {
      set_account_name("");
    }
    setPaymentMethod(event.target.value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(store_account_number);
    alert("Account number copied to clipboard!");
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
              {product.items.map((item) => (
                <div className="box_item_gourp" key={item.id}>
                  <div className="box_item_image">
                    <img src={item.images} alt="" />
                    <div className="box_item_text">
                      <p>Name: {item.name}</p>
                      {/* <p>Color: {item.color}</p>
                      <p>Size: {item.size}</p> */}
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
                        value={more.id}
                        onChange={handleProvince}
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
