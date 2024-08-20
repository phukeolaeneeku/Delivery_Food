import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import { IoIosArrowBack } from "react-icons/io";
import "./bill.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReviewProduct from "./ReviewProduct";
import productImage from "../../img/productImage.png";
import { RotatingLines } from "react-loader-spinner";
import { FiPrinter } from "react-icons/fi";

const Bill = () => {
  const token = localStorage.getItem("token");
  const { bill_id: order_id } = useParams();
  const [order_list, setOrderList] = useState(null); // Initialized to null for conditional rendering
  const [showReview, setShowReview] = useState(false);
  const [product_id, setProductId] = useState(null);
  const usdToKrw = 15.0;
  const usdToKIP = 25000;
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");


  console.log("order_list...", order_list)

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

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_API + "/user/check-token",
          JSON.stringify({ token }),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.result !== "success") {
          localStorage.clear();
          navigate("/loginuser");
        }
      } catch (error) {
        console.error("Token check failed:", error);
        localStorage.clear();
        navigate("/loginuser");
      }
    };
    checkToken();
  }, [token, navigate]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API + `/store/order/${order_id}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setOrderList(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchOrderDetails();
  }, [order_id]);

  const handleReview = (id) => {
    setProductId(id);
    setShowReview(true);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_API + "/store/review/create",
        JSON.stringify({
          product: product_id,
          user: localStorage.getItem("user_id"), // Assuming user_id is stored in localStorage
          rating,
          comment,
        }),
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Review submitted:", response.data);
      alert("리뷰가 성공적으로 제출되었습니다.");
      setRating(0);
      setComment("");
      setShowReview(false); // Close the review form after submission
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!order_list) {
    return (
      <div className="box_OrderBill_RotatingLines">
        <RotatingLines
          visible={true}
          height="45"
          width="45"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }
  const totalPrice =
    order_list.items?.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ) || 0;

  return (
    <>
      {showReview ? (
        <ReviewProduct
          id={product_id}
          rating={rating}
          onRatingChange={handleRatingChange}
          comment={comment}
          onCommentChange={handleCommentChange}
          onSubmitReview={handleSubmitReview}
        />
      ) : (
        <>
          <Header />
          <div className="header"></div>
          <div className="bill">
            <div className="bill-detial">
              <div className="guopoidHead">
                <p>Orders ID: {order_list.id}</p>
                <p>Date time: {new Date(order_list.created_at).toLocaleString()}</p>
              </div>
              <div className="billGopBox">
                <div className="box_table">
                  <div className="txtHeader">
                    <div className="Header">Product name</div>
                    <div className="Header">Price</div>
                    <div className="Header">Amount</div>
                    <div className="Header">Water</div>
                    {order_list.status === "Delivered" && (
                      <div className="Header_review">리뷰</div>
                    )}
                  </div>
                  <div>
                    {order_list.items?.map((item, index) => (
                      <div className="txtHeader" key={index}>
                        <div className="txt_Des">{item.product.name}</div>
                        <div className="txt_Des">
                          {parseFloat(item.price).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            useGrouping: true,
                          })}
                        </div>
                        <div className="txt_Des">{item.quantity}</div>
                        <div className="txt_Des">{item.size}</div>
                        {order_list.status === "Delivered" && (
                          <div className="Header_review">
                            <button
                              className="Delivered_review"
                              onClick={() => handleReview(item.product.id)}
                            >
                              Review
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="box_totleAdd_container">
                <p className="box_more_details">
                More details: {order_list.province}
                </p>
                <div className="titlePrice">
                  <h4>Total USD:</h4>
                  <p>
                    ${" "}
                    {totalPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      useGrouping: true,
                    })}
                  </p>
                </div>

                <div className="titlePrice">
                  <h4>Total KRW:</h4>
                  <p>
                    ₩{" "}
                    {(totalPrice * convertCurrency()).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      useGrouping: true,
                    })}
                  </p>
                </div>
                <div className="titlePrice">
                  <h4>Total KIP:</h4>
                  <p>
                    {(totalPrice * convertCurrencyKIP()).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      useGrouping: true,
                    })}{" "}
                    KIP
                  </p>
                </div>
              </div>

              <div className="box_place">
                <div className="place-on">
                  <p>Payment method: {order_list.account_name}</p>
                  <p>Contact: +856{order_list.tel}</p>
                  <p>Delivery address: {order_list.district}</p>
                  <p>Status: {order_list.status}</p>
                </div>
              </div>
            </div>
          </div>
          <Menu />
        </>
      )}
    </>
  );
};

export default Bill;
