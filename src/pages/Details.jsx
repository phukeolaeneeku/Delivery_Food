import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles/details.css";
import axios from "axios";
import Swal from "sweetalert2";
import { BsCart3 } from "react-icons/bs";
import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate, useParams } from "react-router-dom";

const Details = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { hotelName, room_number, address, id, category } = useParams();
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );
  const MySwal = withReactContent(Swal);
  const [productsList, setProductsList] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const navigate = useNavigate();
  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(Math.max(1, quantity - 1));

  // console.log("productproduct....", product)

  ////////////// Product_Detail ////////////////
  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API}/store/detail/${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  //////////// Add to Cart ///////////
  const addToCart = () => {
    // if (!token) {
    //   MySwal.fire({
    //     text: "먼저 로그인하거나 QR 코드를 스캔하세요",
    //     icon: "info",
    //   });
    //   return;
    // }

    const existingProduct = cart.find(
      (item) => item.id === product.id && item.store_name === product.store_name
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.store_name === product.store_name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    MySwal.fire({
      text: "이 제품이 장바구니에 추가되었습니다.",
      icon: "success",
    });
  };

  //////////// Checkout ///////////
  const handleCheckout = () => {
    // if (!token) {
    //   MySwal.fire({
    //     text: "먼저 로그인하거나 QR 코드를 스캔하세요",
    //     icon: "info",
    //   });
    //   return;
    // }

    const orderData = {
      user: user.user_id,
      store: product.store_id,
      items: [
        {
          id: product.id,
          name: product.name,
          images: product.images,
          quantity,
          price: product.price,
        },
      ],
    };

    // ใช้ navigate เพื่อไปยังหน้า Checkout พร้อมส่งข้อมูล
    navigate("/checkout", { state: { order: orderData } });
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // console.log("cart......", cart)

  ///////////// ProductsList ///////////////
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/store/?category=${category}`)
      .then((response) => setProductsList(response.data))
      .catch((error) => console.error("Error fetching products list:", error));
  }, [category]);

  /////////// StarAVG ////////////
  const StarAVG = (value) => (value / 5) * 100 || 100;

  ////////////// Review /////////////
  useEffect(() => {
    setDisplayedReviews(showAllReviews ? reviews : reviews.slice(0, 3));
  }, [reviews, showAllReviews]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/store/product/${id}/review`)
      .then((response) => {
        const sortedReviews = response.data.sort((a, b) => b.id - a.id);
        setReviews(sortedReviews);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [id]);

  useEffect(() => {
    setDisplayedReviews(showAllReviews ? reviews : reviews.slice(0, 3));
  }, [reviews, showAllReviews]);

  const handleToggleReviews = () => setShowAllReviews((prev) => !prev);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // เพิ่มการเลื่อนอย่างนุ่มนวล
    });
  };

  return (
    <>
      <div className="details-container">
        <Header />
        <div className="product-details">
          <img src={product.images} alt="꼬치" className="product-image" />
          <div className="product-info">
            <h1>제품명: {product?.name}</h1>
            <div className="price">
              가격: <div className="txt_price">${product.price}</div>
            </div>
            <div className="stock">남은 수량: {product.quantity}</div>
            <div className="description">설명: {product.description}</div>
            <div className="quantity-selector">
              <button onClick={handleDecrement}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncrement}>+</button>
            </div>
            <div className="action-buttons">
              <button className="buy-now" onClick={handleCheckout}>
                지금 구매
              </button>
              <button className="echbtn btnAdd" onClick={addToCart}>
                장바구니에 추가
              </button>
            </div>
          </div>
        </div>

        <div className="reviews">
          <h2>모든 리뷰</h2>
          {displayedReviews.length === 0 ? (
            <div>이용 가능한 리뷰가 없습니다.</div>
          ) : (
            <ul>
              {displayedReviews.map((review) => (
                <li key={review.id}>
                  <h1>{review.user.nickname || "null"}:</h1>
                  <div>{review.comment || "null"}</div>
                </li>
              ))}
            </ul>
          )}
          {reviews.length > 3 && (
            <button
              className="toggle-reviews-button"
              onClick={handleToggleReviews}
            >
              {showAllReviews ? "간략히 표시" : "더보기"}
            </button>
          )}
        </div>

      </div>
      <div className="product-section section-detail">
          <h2>주문가능제품</h2>
          <div className="product-grid">
            {productsList.filter(product => product.quantity > 0 || product.category == 64).map((product, index) => (
              <div className="product-card" key={index}>
                <Link
                  to={
                    hotelName && room_number && address
                      ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/details/${product.id}`
                      : `/details/${product.id}`
                      
                  }
                  onClick={handleClick}
                >
                  <img src={product.images} alt="image" />
                  <div className="star-rating">
                    <div className="stars-outer">
                      <div
                        className="stars-inner"
                        style={{ width: `${StarAVG(product.star_avg)}%` }}
                      ></div>
                    </div>
                  </div>
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-price">${product.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      <Footer />
    </>
  );
};

export default Details;
