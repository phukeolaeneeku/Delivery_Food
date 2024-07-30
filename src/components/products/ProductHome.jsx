import "./productHome.css";
import productImage from "../../img/productImage.png";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FaMagnifyingGlass, FaCartShopping, FaRegUser } from "react-icons/fa6";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";
import Header from "../header/Header";
import { RotatingLines } from "react-loader-spinner";

const ProductHome = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [logo, set_logo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = location.state || {};
  const [ShowFilter, setShowFilter] = useState(false);
  const [goods_list, set_goods_list] = useState([]);
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const [search, set_search] = useState("");
  const [filter, set_filter] = useState(1);
  const [category_list, set_category_list] = useState([]);
  const [category_name, set_category_name] = useState(category || "");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(goods_list.length / itemsPerPage);

  // console.log("category_name:", category_name);

  useEffect(() => {
    let config = {
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
        // console.log(JSON.stringify(response.data));
        set_category_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        set_logo(response.data[0].logo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [logo]);

  const handleCategoryClick = (categoryName) => {
    set_category_name(categoryName);
  };

  useEffect(() => {
    let my_url = "";
    if (!category_name == "") {
      my_url = `/store/?category_name=${category_name}&category_type=${filter}`;
    } else {
      my_url = `/store/?category_type=${filter}`;
    }
    let config = {
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
  }, [category_name]);

  function StarAVG(value) {
    let star_avg = (value / 5) * 100;
    if (star_avg === 0) {
      star_avg = 100;
    }
    return star_avg;
  }

  // ==== Paginator management ====

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGoods = goods_list.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage(currentPage === totalPages ? totalPages : currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage === 1 ? 1 : currentPage - 1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    pages.push(
      <button
        key={1}
        style={{
          padding: "10px 20px",
          margin: "0 5px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "3px",
          backgroundColor: currentPage === 1 ? "#007bff" : "white",
          color: currentPage === 1 ? "white" : "black",
          border: "1px solid #ddd",
        }}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    if (startPage > 2) {
      pages.push(
        <span key="start-ellipsis" style={{ margin: "0 10px" }}>
          ...
        </span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          style={{
            padding: "10px 20px",
            margin: "0 5px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "3px",
            backgroundColor: currentPage === i ? "#007bff" : "white",
            color: currentPage === i ? "white" : "black",
            border: "1px solid #ddd",
          }}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(
        <span key="end-ellipsis" style={{ margin: "0 10px" }}>
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          style={{
            padding: "10px 20px",
            margin: "0 5px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "3px",
            backgroundColor: currentPage === totalPages ? "#007bff" : "white",
            color: currentPage === totalPages ? "white" : "black",
            border: "1px solid #ddd",
          }}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };
  return (
    <div>
      <Header set_category_name={set_category_name} />
      <div className="category_container2">
        {category_list.map((category, index) => (
          <div className="box-category" key={index}>
            <button
              value={category.name}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="image">
                <img className="boxImage" src={category.image} alt="image" />
              </div>
              <p>{category.name}</p>
            </button>
          </div>
        ))}
      </div>

      <div className="product">
        <div className="productHead_content">
          <h1 className="htxthead">
            <span className="spennofStyle"></span>Product
          </h1>
          {/* <div className="categoryBoxfiler">
            <form className="boxfilterseach">
              <select
                className="filter_priceProduct"
                onClick={(e) => set_filter(e.target.value)}
              >
                <option value="1">Latest</option>
                <option value="3">Sort by review</option>
                <option value="2">Highest price</option>
                <option value="4">Low to highest prices</option>
              </select>
            </form>
          </div> */}
        </div>
        {currentGoods.length > 0 ? (
          <div className="product-area">
            {currentGoods.map(
              (i, index) =>
                i.category && (
                  <div className="box-product" key={index}>
                    <Link to={`/goods/${i.id}`}>
                      <div className="img">
                        <img src={i.images} alt={i.name} />
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
        ) : (
          <div className="box_RotatingLines">
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
        )}
        {/* Render pagination */}
        <div className="pagination" style={{ textAlign: "center" }}>
          <button
            style={{
              padding: "10px 20px",
              margin: "0 5px",
              fontSize: "16px",
              borderRadius: "5px",
              cursor: "pointer",
              background: "#FF4F16",
              color: "white",
              border: "none",
            }}
            disabled={currentPage === 1}
            onClick={prevPage}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            style={{
              padding: "10px 20px",
              margin: "0 5px",
              fontSize: "16px",
              borderRadius: "5px",
              cursor: "pointer",
              background: "#FF4F16",
              color: "white",
              border: "none",
            }}
            disabled={currentPage === totalPages}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHome;
