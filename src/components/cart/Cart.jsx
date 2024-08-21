import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import productImage from "../../img/productImage.png";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import "./cart.css";
import axios from "axios";
import Payment from "./Payment";

const Cart = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [store_id, set_store_id] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [show_payment, set_show_payment] = useState(false);
  const navigate = useNavigate();
  const [category, set_category] = useState(1);
  const [products_list, set_products_list] = useState([]);

  ////////////////

  const [amount, setAmount] = useState(1);
  const [amountKIP, setAmountKIP] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KRW");
  const [toCurrencyKIP, setToCurrencyKIP] = useState("LAK");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [exchangeRates, setExchangeRates] = useState(1);
  const [currencies, setCurrencies] = useState([]);

  const { hotelName, room_number, address } = useParams();

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

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/?category=${category}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_products_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category]);

  function StarAVG(value) {
    let star_avg = (value / 5) * 100;
    if (star_avg === 0) {
      star_avg = 100;
    }
    return star_avg;
  }

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }

  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // const addToCart = (product, color, size, quantity) => {
  //   const existingProduct = cart.find(
  //     (item) =>
  //       item.id === product.id &&
  //       item.store_name === product.store_name &&
  //       item.color === color &&
  //       item.size === size
  //   );

  //   if (existingProduct) {
  //     setCart(
  //       cart.map((item) =>
  //         item.id === product.id &&
  //         item.store_name === product.store_name &&
  //         item.color === color &&
  //         item.size === size
  //           ? { ...item, quantity: item.quantity + quantity }
  //           : item
  //       )
  //     );
  //   } else {
  //     setCart([...cart, { ...product, quantity, color, size }]);
  //   }
  // };

  const removeFromCart = (id, store_name, color, size, description) => {
    setCart(
      cart.filter(
        (item) =>
          !(
            item.id === id &&
            item.store_name === store_name &&
            item.color === color &&
            item.description === description &&
            item.size === size
          )
      )
    );
  };

  const updateQuantity = (id, store_name, color, size, quantity, description) => {
    if (quantity <= 0) {
      removeFromCart(id, store_name, color, size);
    } else {
      setCart(
        cart.map((item) =>
          item.id === id &&
          item.store_name === store_name &&
          item.color === color &&
          item.description === description &&
          item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.price * (item.quantity || 0),
      0
    );
  };

  const handlePayment = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    setCartItems(storeItems);
    set_store_id(storeItems[0].store_id);
    set_show_payment(true);
    // alert(
    //   `Payment for ${store_name} completed successfully!\nTotal Price: $${getTotalPriceForStore(
    //     store_name
    //   ).toFixed(2)}`
    // );
    // setCart(cart.filter((item) => item.store_name !== store_name));
  };

  // Order array datas
  const orderitems = [
    {
      user: user_id,
      store: store_id,
      items: cartItems,
    },
  ];

  // console.log(store_id);

  const getTotalItemForStore = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    return storeItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getTotalPriceForStore = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    return storeItems.reduce(
      (total, item) => total + item.price * (item.quantity || 0),
      0
    );
  };

  const getTotalPriceForStoreKRW = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    return storeItems.reduce(
      (total, item) =>
        total + item.price * (item.quantity || 0) * convertCurrency(),
      0
    );
  };
  const getTotalPriceForStoreKIP = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    return storeItems.reduce(
      (total, item) => 
        total + item.price * (item.quantity || 0) * convertCurrencyKIP(),
      0
    );
  };

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }

  useEffect(() => {

    if (hotelName && room_number && address) {
      return;
    }

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
  }, [token, hotelName, room_number, address]);

  // console.log("Cart:", cart); // Add this line to debug

  if (!cart) {
    return <div className="cart">Loading...</div>;
  }

  const stores = [...new Set(cart.map((item) => item.store_name))];

  // const handlePay = () => {
  //   set_show_payment(true);
  // };

  return (
    <>
      {show_payment ? (
        <Payment orders={orderitems} order_from="cart" onPay={handlePayment} />
      ) : (
        <>
          <Header />
          <div className="header"></div>
          <div className="box_cart_container">
            {stores.length === 0 ? (
              <p className="no-reviews-message">Your cart is emty</p>
            ) : (
              <div>
                {stores.map((store) => (
                  <div key={store}>
                    <div className="store">
                      <h3>{store}</h3>
                      <div>
                        {cart
                          .filter((item) => item.store_name === store)
                          .map((item, index) => (
                            <div className="box_item_gourp" key={index}>
                              <div className="box_item_image">
                                <img src={item.images} alt="" />
                                <div className="box_item_text">
                                  <div>Product name: {item.name}</div>
                                  <div>
                                    price{": "} $
                                    {parseFloat(item.price).toLocaleString(
                                      "en-US",
                                      {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                        useGrouping: true,
                                      }
                                    )}
                                  </div>
                                  {/* {item.color != 0 ? (
                                    <p>Type of menu: {item.color}</p>
                                  ) : (
                                    <p></p>
                                  )}
                                  {item.size != 0 ? (
                                    <p>Type of water: {item.size}</p>
                                  ) : (
                                    <p></p>
                                  )} */}

                                  {/* {item.color !== 0 && (
                                    <p>Type of menu: {item.color}</p>
                                  )} */}
                                  <div>Description: {item.description}</div>
                                  {item.size != 0 && (
                                    <div>Type of water: {item.size}</div>
                                  )}
                                </div>
                                <div className="box_icon_order">
                                  <div className="btnicon_delete_order">
                                    <AiOutlineDelete
                                      id="btnicon_delete"
                                      onClick={() =>
                                        removeFromCart(
                                          item.id,
                                          store,
                                          item.color,
                                          item.size
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="box_item_icon">
                                    <div
                                      className="icon_minus_plus"
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          store,
                                          item.color,
                                          item.size,
                                          item.quantity - 1
                                        )
                                      }
                                    >
                                      -
                                    </div>
                                    <span>{item.quantity}</span>
                                    <div
                                      className="icon_minus_plus"
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          store,
                                          item.color,
                                          item.size,
                                          item.quantity + 1
                                        )
                                      }
                                    >
                                      +
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="box_item_total">
                      <div className="cart_Total_box">
                        <h1>Shopping Cart Total</h1>
                        <div className="box_item_total_text">
                          <p>Quantity:</p>
                          <p>{getTotalItemForStore(store)} Item</p>
                        </div>
                        <hr />
                        <div className="box_item_total_text">
                          <p className="txt_Total">Total USD: </p>
                          <p>$ {getTotalPriceForStore(store).toFixed(2)}</p>
                        </div>

                        <div className="box_item_total_text">
                          <p className="txt_Total">Total KRW: </p>
                          <p>₩ {getTotalPriceForStoreKRW(store).toFixed(2)}</p>
                        </div>
                        <div className="box_item_total_text">
                          <p className="txt_Total">Total KIP: </p>
                          <p>
                            {getTotalPriceForStoreKIP(store).toFixed(2)} KIP
                          </p>
                        </div>
                        <div className="btn">
                          <button
                            onClick={() => {
                              handlePayment(store);
                            }}
                            className="checkout_btn"
                          >
                            Checkout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h2 className="box_betavinOfob asd2">
              <span className="spennofStyle" />
              More products
            </h2>
            <div className="product-area">
              {products_list.map(
                (i, index) =>
                  i.category !== "Food" && (
                    <div className="box-product" key={index}>
                      <Link to={(hotelName && room_number && address)
                          ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/goods/${i.id}`
                          : `/goods/${i.id}`}>
                        <div className="img">
                          <img src={i.images} alt="image" />
                        </div>
                        <div className="star">
                          <div
                            className="on"
                            style={{ width: `${StarAVG(i.star_avg)}%` }}
                          ></div>
                        </div>
                        <ul className="txtOFproduct2">
                          <li className="name">{i.name}</li>
                          <li className="price">$ {i.format_price}</li>
                        </ul>
                      </Link>
                    </div>
                  )
              )}
            </div>
          </div>
          <Menu />
        </>
      )}
    </>
  );
};

export default Cart;
