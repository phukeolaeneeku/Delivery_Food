import React, { useEffect, useState } from "react";
import "./header.css";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FaMagnifyingGlass, FaCartShopping, FaRegUser } from "react-icons/fa6";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo1 from "../../img/Logo1.png";
import axios from "axios";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";

const Header = ({ set_category_name }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [logo, set_logo] = useState(null);
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const navigate = useNavigate();
  const [search, setSearch] = useState(
    new URLSearchParams(window.location.search).get("search")
  );
  var store_id = false;
  var is_admin = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }
  if (localStorage.getItem("user")) {
    is_admin = JSON.parse(window.localStorage.getItem("user")).is_admin;
  }

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
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }
      })
      .catch((error) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log(error);
      });
  }, [token]);

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
        console.log(JSON.stringify(response.data));
        set_logo(response.data[0].logo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [logo]);


  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search/?search=${search}`);
  };

  const handleProductsAll = () => {
    set_category_name("");
  };

  return (
    <section id="header">
      <div className="navbar">
        <div className="headWithBox">
          <div className="headMenu">
            <div className="logo1">
              <Link to="/">
                <img src={logo} alt="Logo" onClick={handleProductsAll} />
              </Link>
            </div>
            <div className="boxLiMenu">
              <div className="linkLi">
                <Link
                  to="/"
                  onClick={handleProductsAll}
                  className={location.pathname === "/" ? "link active" : "link"}
                >
                  Home
                </Link>
                <Link
                  to="https://www.kakaocorp.com/page/service/service/KakaoTalk?lang=en"
                  className="link"
                >
                  Chat
                </Link>
                <Link
                  to="/order"
                  className={
                    location.pathname === "/order" ? "link active" : "link"
                  }
                >
                  Orders
                </Link>
              </div>
            </div>
          </div>

          <div className="ulHead_box">
            <form className="search_wrap search_wrap_2" onSubmit={handleSearch}>
              <div className="search_box">
                <div className="btn_common">
                  <FaMagnifyingGlass className="iconSearch" />
                </div>
                <input
                  id="search"
                  type="text"
                  value={search}
                  className="input_search_heaederr"
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>

            {user ? (
              <div className="right_ofHeadBox">
                <div className="linkLi">
                  <Link
                    to="/cart"
                    className={
                      location.pathname === "/cart" ? "link active" : "link"
                    }
                  >
                    <FaCartShopping className="head_colorr" />
                  </Link>
                </div>
                <div className="linkLi">
                  <Link
                    to="/more"
                    className={
                      location.pathname === "/more" ? "link active" : "link"
                    }
                  >
                    <FaRegUser className="head_colorr" />
                  </Link>
                </div>
                {storage.is_admin !== false && (
                  <div className="userAndstore">
                    <Link to={`/dashboard`}>
                      <AiOutlineDashboard className="head_colorr" />
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="right_ofHeadBox">
                <div className="linkLi">
                  <Link to="/cart">
                    <FaCartShopping className="head_colorr" />
                  </Link>
                </div>
                <div className="linkLi">
                  <Link to="/loginuser" className="Box_icon_login_BiLogIn">
                    Login
                    <BiLogIn id="icon_BiLogIn" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
