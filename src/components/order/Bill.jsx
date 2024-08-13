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

  const handlePrintBill = () => {
    const billElement = document.querySelector(".bill-detial");
    const printWindow = window.open("", "", "height=500px,width=500px");
    printWindow.document.write(`
      <html>
        <head>
          <style>
            @media print {
              @page {
                size: 58mm 210mm;
                margin: 0;
              }
              body {
                width: 58mm;
                margin: 0;
                font-size: 10px;
                font-family: Arial, sans-serif;
              }
              .bill-detial {
                padding: 15px 10px 10px 10px;
                text-align: start;
              }
              .guopoidHead {
                width: 100%;
                text-align: start;
                border-bottom: #4444 solid 1px;
                grid-template-columns: 1fr;
              }
              .billGopBox {
                display: grid;
                width: 100%;
                margin: auto;
                border-bottom: #4444 solid 1px;
              }
              .box_table {
                width: 100%;
              }
              .txtHeader {
                width: 100%;
                display: flex;
                justify-content: space-between;
                margin: 0.5rem 0;
              }
              .Header {
                width: 100%;
                text-align: center;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 5px;
              }
              .Header_review{
                display: none;
              }
              .Delivered_review{
                display: none;
              }
              .txt_Des {
                width: 100%;
                text-align: center;
              }
              .titlePrice {
                padding: 0;
                margin-top: -1.2rem;
                display: flex;
                text-align: center;
                justify-content: space-between;
              }
              .place-on {
                text-align: start;
              }
              .Delivered_review{
                display: none;

              }
              .txtHeader .Header{
                font-size: 12px;
              }
              .titlePrice h4{
                font-size: 12px;
                font-weight: 100;
              }
              .Header{
                padding: 10px 0;
                border-bottom: #4444 solid 1px;
              }
              .box_totleAdd_container{
                border-bottom: #4444 solid 1px;
              }

            }
          </style>
        </head>
        <body>
          ${billElement.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
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
          <div className="bill">
            <div className="box_containner_FiPrinter">
              <FiPrinter id="FiPrinter" onClick={handlePrintBill} />
            </div>

            <div className="bill-detial">
              <div className="guopoidHead">
                <p>주문 ID: {order_list.id}</p>
                <p>날짜: {new Date(order_list.created_at).toLocaleString()}</p>
              </div>
              <div className="billGopBox">
                <div className="box_table">
                  <div className="txtHeader">
                    <div className="Header">제품</div>
                    <div className="Header">가격</div>
                    <div className="Header">양</div>
                    <div className="Header">물</div>
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
                              리뷰
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
                  자세한 내용: {order_list.province}
                </p>
                <div className="titlePrice">
                  <h4>합계 USD:</h4>
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
                  <h4>합계 KIP:</h4>
                  <p>
                    {(totalPrice * usdToKIP).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      useGrouping: true,
                    })}{" "}
                    KIP
                  </p>
                </div>
                <div className="titlePrice">
                  <h4>합계 KRW:</h4>
                  <p>
                    ₩{" "}
                    {(totalPrice * usdToKrw).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      useGrouping: true,
                    })}
                  </p>
                </div>
              </div>

              <div className="box_place">
                <div className="place-on">
                  <p>결제수단: {order_list.account_name}</p>
                  <p>연락처: +856{order_list.tel}</p>
                  <p>배송받을 주소: {order_list.district}</p>
                  <p>지위: {order_list.status}</p>
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
