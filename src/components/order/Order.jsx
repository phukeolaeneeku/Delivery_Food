import React, { useState, useEffect } from "react";
import "./order.css";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";

const Order = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  // const user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [order_list, set_order_list] = useState([]);
  const [display_order, set_display_order] = useState([]);
  const [show_all_order, set_show_all_order] = useState(false);
  const [category, set_category] = useState(1);
  const [products_list, set_products_list] = useState([]);

  const { hotelName, room_number, address } = useParams();

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

  var user_id = "";
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

  useEffect(() => {
    let data = JSON.stringify({
      user: 1,
      items: [],
    });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/user/${user_id}/order`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const sortedReviews = response.data.sort((a, b) => b.id - a.id);
        set_order_list(sortedReviews);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user_id]);

  useEffect(() => {
    if (show_all_order) {
      set_display_order(order_list);
    } else {
      set_display_order(order_list.slice(0, 4));
    }
  }, [order_list, show_all_order]);

  const handleToggleOrders = () => {
    set_show_all_order(!show_all_order);
  };

  return (
    <>
      <Header />
      <div className="header"></div>
      <section id="container_order_item">
        <div className="container_order_all">
          {/* <Link to="/" className="box_management_iconnback">
            <IoIosArrowBack id="icons_back" />
            <p>Back</p>
          </Link> */}
          <h2>Orders</h2>

          {loading ? (
            <div className="box_Order_RotatingLines">
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
          ) : display_order.length === 0 ? (
            <p className="no-reviews-message">There are no orders right now</p>
          ) : (
            display_order.map((item) => (
              <Link
                to={`/bill/${item.id}`}
                key={item.id}
                className="box_item_order"
              >
                <div className="box_item_order_text">
                  <p>ID: {item.id}</p>
                  <p className="box_text_ForPC">
                  Date time: {new Date(item.created_at).toLocaleString()}
                  </p>
                  <p>Status: {item.status}</p>
                </div>
                <p className="box_text_ForMobile">
                Date time: {new Date(item.created_at).toLocaleString()}
                </p>
              </Link>
            ))
          )}

          {/* <Link to="/bill" className="box_item_order">
              <div>
                <p className="txtheadeproductorder">No!</p>
              </div>
            </Link> */}
        </div>

        {order_list.length > 3 && (
          <div className="btn_show_more">
            <button
              className="toggle-reviews-button"
              onClick={handleToggleOrders}
            >
              {show_all_order ? "Show less" : "See more"}
            </button>
          </div>
        )}

        <>
          {display_order.length === 0 ? (
            <>
              <h2 className="box_betavinOfob asd2">
                <span className="spennofStyle" />
                More products
              </h2>
              <div className="product-area">
                {products_list.map(
                  (i, index) =>
                    i.category !== "Food" && (
                      <div className="box-product" key={index}>
                        <Link to={"/goods/" + i.id}>
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
                            {/* <li className="desc">{i.description}</li> */}
                          </ul>
                        </Link>
                      </div>
                    )
                )}
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      </section>
      <Menu />
    </>
  );
};

export default Order;
