import { FiPlus, FiCopy } from "react-icons/fi";
import "./payment.css";
import Menu from "../menuFooter/Menu";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
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
  const usdToKrw = 15.0;
  const usdToKIP = 25000;

   ////////////////

   const [amount, setAmount] = useState(1);
   const [amountKIP, setAmountKIP] = useState(1);
   const [fromCurrency, setFromCurrency] = useState("USD");
   const [toCurrency, setToCurrency] = useState("KRW");
   const [toCurrencyKIP, setToCurrencyKIP] = useState("LAK");
   const [exchangeRate, setExchangeRate] = useState(1);
   const [exchangeRates, setExchangeRates] = useState(1);
   const [currencies, setCurrencies] = useState([]);
 
   useEffect(() => {
     // Fetch the list of currencies and exchange rates from an API
     const getCurrencies = async () => {
       try {
         const response = await fetch(
           "https://api.exchangerate-api.com/v4/latest/USD"
         );
         const data = await response.json();
         const uniqueCurrencies = Array.from(
           new Set([data.base, ...Object.keys(data.rates)])
         );
         setCurrencies(uniqueCurrencies);
         setExchangeRate(data.rates[toCurrency]);
         setExchangeRates(data.rates[toCurrencyKIP]);
       } catch (error) {
         console.error("Error fetching the currencies:", error);
       }
     };
 
     getCurrencies();
   }, []);
 
   useEffect(() => {
     const getExchangeRate = async () => {
       if (fromCurrency !== toCurrency) {
         try {
           const response = await fetch(
             `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
           );
           const data = await response.json();
           setExchangeRate(data.rates[toCurrency]);
         } catch (error) {
           console.error("Error fetching the exchange rate:", error);
         }
       }
     };
 
     getExchangeRate();
   }, [fromCurrency, toCurrency]);
 
 
   useEffect(() => {
     const getExchangeRates = async () => {
       if (fromCurrency !== toCurrencyKIP) {
         try {
           const response = await fetch(
             `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
           );
           const data = await response.json();
           setExchangeRates(data.rates[toCurrencyKIP]);
         } catch (error) {
           console.error("Error fetching the exchange rate:", error);
         }
       }
     };
 
     getExchangeRates();
   }, [fromCurrency, toCurrencyKIP]);
 
   const convertCurrency = () => {
     return (amount * exchangeRate).toFixed(2);
   };
   const convertCurrencyKIP = () => {
     return (amountKIP * exchangeRates).toFixed(2);
   };
   ///////////////////

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
    MySwal.fire({
      text: "Your account number has been copied to your clipboard!",
      icon: "success",
    });
  };

  const handlePay = () => {
    if (!tel) {
      MySwal.fire({
        text: "Please add your contact information or KakaoTalk ID!",
        icon: "question",
      });
      return;
    }
    if (!district) {
      MySwal.fire({
        text: "Please add your address!",
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
        size: item.size || "0",
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
          text: "Your order has been completed.",
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
        if (error.response) {
          const quantity = error.response.data?.quantity;
          console.log("Quantity:", quantity); // Debugging line
          console.log("Status:", error.response.status); // Debugging line

          if (error.response.status === 400) {
            if (quantity === 0) {
              MySwal.fire({
                text: "The product is out of stock!",
                icon: "info",
              });
            } else {
              MySwal.fire({
                text: "The product is still not enough.",
                icon: "warning",
              });
            }
          }
        }
      });
  };

  return (
    <>
      <Header />
      <div className="header"></div>
      <div className="guopBoxPayment_container">
        <h2 className="h2_boxPayment">Payment</h2>
        <div className="adress_payment_content">
          <h4>Details:</h4>
          {orders.map((product, index) => (
            <div key={index}>
              {product.items.map((item, itemIndex) => (
                <div className="box_item_gourp" key={itemIndex}>
                  <div className="box_item_images">
                    <img src={item.images} alt="" />
                    <div className="box_item_text_payment">
                      <p>Product name: {item.name}</p>
                      {/* {item.color != 0 ?(
                        <p>Type of menu: {item.color}</p>
                      ):(
                        <p></p>
                      )} */}

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
                      {item.size != 0 ? (
                        <p className="box_txtFor_PC">Type of water: {item.size}</p>
                      ) : (
                        <p></p>
                      )}
                      <div className="box_txtFor_PC">Additional Requests:</div>
                      <textarea
                        type="text"
                        placeholder="Description..."
                        className="txt_textarea_descriptionPC"
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
                  {item.size != 0 ? (
                    <p className="box_txtFor_Mobile">Type of water: {item.size}</p>
                  ) : (
                    <p></p>
                  )}
                  <div className="txt_textarea_description_Mobiles">
                  Additional requests:
                  </div>

                  <textarea
                    type="text"
                    placeholder="Description..."
                    className="txt_textarea_description_Mobile"
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
                  <hr className="Line" />
                </div>
              ))}
            </div>

            
          ))}
          <div className="box_address">
            <h4>Address:</h4>
            <form className="box_address_input">
              <div className="box">
                <label htmlFor="prov">Contact:</label>
                <input
                  type="text"
                  id="prov"
                  value={tel}
                  onChange={handleTel}
                  placeholder="Phone number or KakaoTalk ID... "
                />
              </div>

              <div className="box">
                <label htmlFor="city">Address:</label>
                <input
                  type="text"
                  id="city"
                  value={district}
                  onChange={handleDistrict}
                  placeholder="Detailed address village, city, hotel..."
                />
              </div>

              <div className="box">
                <label htmlFor="category">
                For remittance, enter your bank account name, and for cash payment, enter “cash.”
                </label>
                <select
                  name="category"
                  className="product_category"
                  required
                  onChange={handlePaymentMethod}
                >
                  <option value="">Choose cash or transfer</option>
                  <option value="USD">USD</option>
                  <option value="KIP">KIP</option>
                  <option value="TransferKRW"> transfer KRW</option>
                </select>
              </div>
            </form>
          </div>
          <div className="box_transfer">
            {paymentMethod === "KIP" ? (
              <div className="box_address_input">
                <p className="box_containner_totals">
                Total price:
                  <span>
                    {" "}
                    {parseFloat(totalPrice * convertCurrencyKIP()).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      useGrouping: true,
                    })}{" "}
                    KIP
                  </span>
                </p>
              </div>
            ) : paymentMethod === "TransferKRW" ? (
              <div className="box_address_input">
                <div className="box">
                  <label htmlFor="name">
                  Please send the remittance to the name of the orderer:
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={account_name}
                    onChange={handleAccountName}
                    placeholder="Please set the remittance sender to the name of the orderer and send it..."
                  />
                </div>

                <p className="box_transfer_p_line">Depositor Lee Chang-seop Shinhan Bank</p>
                <div className="boxaccount_number">
                  <div className="boxaccount_number_p">
                    <p>Account number:</p>
                    <p>{store_account_number}</p>
                  </div>
                  <FiCopy
                    className="iconnn_copy_account"
                    onClick={copyToClipboard}
                  />
                </div>

                <p className="box_containner_totals">
                Total price:
                  <span>
                    {" "}
                    ₩{" "}
                    {parseFloat(totalPrice * convertCurrency()).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      useGrouping: true,
                    })}
                  </span>
                </p>
              </div>
            ) : (
              <input
                className="disable_input"
                type="text"
                id="name"
                value={account_name}
                onChange={handleAccountName}
                placeholder="주문자 성함으로 송금인을 설정해서 보내주십시오..."
              />
            )}

            {paymentMethod !== "KIP" && paymentMethod !== "TransferKRW" && (
              <>
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
              </>
            )}
          </div>
         
          <div></div>
          <Link onClick={handlePay} className="save">
          Check
          </Link>
        </div>
      </div>
      <Menu />
    </>
  );
};

export default Payment;
