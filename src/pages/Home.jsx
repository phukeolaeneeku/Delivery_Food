import { useState, useEffect } from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import "./styles/home.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const Home = () => {
  const [goods_list, set_goods_list] = useState([]);
  const [category_list, set_category_list] = useState([]);
  const [category_name, set_category_name] = useState("");
  const { hotelName, room_number, address } = useParams();
  const [message, setMessage] = useState([]);

  // console.log("goods_list..", goods_list);

  // Fetch categories
  useEffect(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/categories",
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_category_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    set_category_name(categoryName);
  };

  // Fetch products based on category
  useEffect(() => {
    const my_url = category_name
      ? `/store/?category_name=${category_name}`
      : `/store/?category_type=all`;

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + my_url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_goods_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category_name]); // เพิ่ม category_name เป็น dependency

  // Calculate star rating percentage
  const StarAVG = (value) => {
    let star_avg = (value / 5) * 100;
    return star_avg === 0 ? 100 : star_avg;
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
    };

    axios
      .request(config)
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // เพิ่มการเลื่อนอย่างนุ่มนวล
    });
  };

  return (
    <>
      <div className="container">
        <Header set_category_name={set_category_name} />
        <Banner />
        <div className="category-section">
          {category_list
            .sort((a, b) => a.sorted_ID - b.sorted_ID) // เพิ่มการจัดเรียงจาก sorted_ID น้อยไปมาก
            .map((category, index) => (
              <div
                key={index}
                className="category-item"
                onClick={() => handleCategoryClick(category.name)}
              >
                <img src={category.image} alt={category.name} />
                <span>{category.name}</span>
              </div>
            ))}
        </div>

        {message.length > 0 &&
          message.map((mess, index) => (
            <div className="txt_delivery" key={index}>
              {mess.message}
            </div>
          ))}

        <div className="product-section">
          <h2>주문가능제품</h2>
          <div className="product-grid">
            {goods_list
              .filter(
                (product) =>
                  (product.quantity > 0 && (product.category != 64 && product.category == 64 ) ||
                  (product.colors && product.colors[0]?.name == "open"))
              )
              .map((product, index) => (
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

        <div className="product-section">
          <h2>영업종료</h2>
          <div className="product-grid">
            {goods_list
              .filter(
                (product) =>
                  (product.quantity == 0 && product.category != 64) ||
                  (product.colors && product.colors[0]?.name == "close")
              )

              .map((product, index) => (
                <div className="product-card quantity" key={index}>
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
                </div>
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
