import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import { IoIosArrowBack } from "react-icons/io";
import "./bill.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { format } from "date-fns";
import axios from "axios";
import ReviewProduct from "./ReviewProduct";
import productImage from "../../img/productImage.png";

const Bill = ({ totalPrice, currency }) => {
  const token = localStorage.getItem("token");
  const order_id = useParams().bill_id;
  const [order_list, setOrderList] = useState("");
  var totalPrice = 0;
  const [showReview, setShowReview] = useState(false);
  const [product_id, set_product_id] = useState(null);

  console.log(order_list);

  const navigate = useNavigate();

  // const [rating, setRating] = useState(0);
  // const [comment, setComment] = useState("");
  // const [reviews, setReviews] = useState([]);

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

  useEffect(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        setOrderList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [order_id]);

  const handleReview = (id) => {
    set_product_id(id);
    setShowReview(true);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();
    let data = JSON.stringify({
      product: product_id,
      user: user_id,
      rating: rating,
      comment: comment,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/review/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        alert("Successful review.");
      })
      .catch((error) => {
        console.log(error);
      });

    setRating(0);
    setComment("");
  };

  const usdToKrw = 15.00;

  return (
    <>
      {showReview ? (
        <ReviewProduct id={product_id} />
      ) : (
        <>
          <Header></Header>
          <div className="bill">
            {/* <Link to="/order" className="box_container_back_icons_backs">
              <IoIosArrowBack id="icons_back" />
              <p>Back</p>
            </Link> */}
            <div className="bill-detial">
              <div className="guopoidHead">
                <div className="box_containner_txt">
                  <p>Order ID: {order_list.id}</p>
                  <p>
                    Date: {new Date(order_list.created_at).toLocaleString()}
                  </p>
                  {/* <p>Name:</p> */}
                </div>
              </div>
              <div className="billGopBox">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Amount</th>
                      {/* <th>Type of menu</th> */}
                      <th>Type of water</th>
                      {order_list.status === "Delivered" && <th>Review</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {order_list.items &&
                      order_list.items.map((item, index) => (
                        // console.log(item.product)

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
                          {/* <td>{item.color}</td> */}
                          <td>{item.size}</td>
                          {order_list.status === "Delivered" && (
                            <th>
                              <button
                                className="Delivered_review"
                                onClick={() => {
                                  handleReview(item.product.id);
                                }}
                              >
                                Review
                              </button>
                            </th>
                          )}
                          <p hidden>
                            {(totalPrice += item.price * item.quantity)}
                          </p>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <p className="box_more_details">
                More dtails: {order_list.province}
              </p>
              <div className="titlePrice">
                <h4>TotalUSD:</h4>
                <p>{" "}
                  ${" "}
                  {parseFloat(totalPrice).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    useGrouping: true,
                  })}{" "}
                </p>
              </div>
              <div className="titlePrice">
                <h4>TotalKRW:</h4>
                <p>{" "}
                  ₩{" "}
                  {parseFloat(totalPrice * usdToKrw).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    useGrouping: true,
                  })}{" "}
                </p>
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
