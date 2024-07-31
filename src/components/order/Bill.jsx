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

const Bill = ({ currency }) => {
  const token = localStorage.getItem("token");
  const { bill_id: order_id } = useParams();
  const [order_list, setOrderList] = useState(null); // Initialized to null for conditional rendering
  const [showReview, setShowReview] = useState(false);
  const [product_id, setProductId] = useState(null);
  const usdToKrw = 15.0;
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.post(import.meta.env.VITE_API + "/user/check-token", 
          JSON.stringify({ token }), 
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
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
        const response = await axios.get(import.meta.env.VITE_API + `/store/order/${order_id}`, {
          headers: { "Content-Type": "application/json" },
        });
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
      const response = await axios.post(import.meta.env.VITE_API + "/store/review/create", 
        JSON.stringify({
          product: product_id,
          user: localStorage.getItem("user_id"), // Assuming user_id is stored in localStorage
          rating,
          comment,
        }), 
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Review submitted:", response.data);
      alert("Review submitted successfully.");
      setRating(0);
      setComment("");
      setShowReview(false); // Close the review form after submission
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!order_list) {
    return <div className="box_OrderBill_RotatingLines">
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
  </div>;
  }

  const totalPrice = order_list.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

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
            <Link to="/order" className="box_container_back_icons_backs">
              <IoIosArrowBack id="icons_back" />
              <div>Back</div>
            </Link>
            <div className="bill-detial">
              <div className="guopoidHead">
                <div className="box_containner_txt">
                  <p>Order ID: {order_list.id}</p>
                  <p>Date: {new Date(order_list.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="billGopBox">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Amount</th>
                      <th>Size</th>
                      {order_list.status === "Delivered" && <th>Review</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {order_list.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product.name}</td>
                        <td>
                          {parseFloat(item.price).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            useGrouping: true,
                          })}
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.size}</td>
                        {order_list.status === "Delivered" && (
                          <th>
                            <button
                              className="Delivered_review"
                              onClick={() => handleReview(item.product.id)}
                            >
                              Review
                            </button>
                          </th>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="box_more_details">More details: {order_list.province}</p>
              <div className="titlePrice">
                <h4>Total USD:</h4>
                <p>${totalPrice.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: true })}</p>
              </div>
              <div className="titlePrice">
                <h4>Total KRW:</h4>
                <p>₩{(totalPrice * usdToKrw).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: true })}</p>
              </div>

              <div className="box_place">
                <div className="place-on">
                  <p>Payment method: {order_list.account_name}</p>
                  <p>Contact number: +856{order_list.tel}</p>
                  <p>Address for delivery: {order_list.district}</p>
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
