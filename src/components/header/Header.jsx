import React, { useEffect, useState, useRef } from "react";
import "./header.css";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FaMagnifyingGlass, FaCartShopping, FaRegUser } from "react-icons/fa6";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import Logo1 from "../../img/Logo1.png";
import axios from "axios";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";
import { RotatingLines } from "react-loader-spinner";
import { CiViewTable } from "react-icons/ci";

const Header = ({ set_category_name }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [logo, setLogo] = useState(null);
  const [search, setSearch] = useState(new URLSearchParams(window.location.search).get("search") || "");
  const [isLoading, setIsLoading] = useState(true);
  const googleTranslateRef = useRef(null);
  const { hotelName, room_number, address } = useParams();

  useEffect(() => {

    if (hotelName && room_number && address) {
      return;
    }

    if (token) {
      const checkToken = async () => {
        try {
          const response = await axios.post(import.meta.env.VITE_API + "/user/check-token", { token }, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          });
          if (response.data.result !== "success") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          console.error(error);
        }
      };
      checkToken();
    }
  }, [token, navigate, hotelName, room_number, address]);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API + "/store/web-info");
        setLogo(response.data[0]?.logo || null);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStoreInfo();
  }, []);

  useEffect(() => {
    const checkGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', 
            includedLanguages: "en,ko,lo",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          googleTranslateRef.current
        );
        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(checkGoogleTranslate, 100);
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search/?search=${search}`);
  };

  const handleProductsAll = () => {
    set_category_name("");
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <section id="header">
      <div className="header"></div>
      <div className="navbar">
        <div className="headWithBox">
          <div className="headMenu">
            <div className="logo1">
              <Link to="/">
                {isLoading && (
                  <div>
                    <RotatingLines
                      visible={true}
                      height="35"
                      width="35"
                      color="Gray"
                      strokeWidth="5"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                    />
                  </div>
                )}
                <img
                  src={logo || Logo1}
                  alt="Logo"
                  onClick={handleProductsAll}
                  onLoad={handleImageLoad}
                  style={{ display: isLoading ? "none" : "block" }}
                />
              </Link>
            </div>
            <div className="boxLiMenu">
              <div className="linkLi">
                <Link
                  to={(hotelName && room_number && address)
                    ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}`
                    : `/`}
                  onClick={handleProductsAll}
                  className={location.pathname === "/" ? "link active" : "link"}
                >
                  Home
                </Link>
                <Link to="https://open.kakao.com/o/gUkkzsIg" className="link">
                  Kakaotalk
                </Link>
                <Link
                  to={(hotelName && room_number && address)
                    ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/order`
                    : `/order`}
                  className={location.pathname === "/order" ? "link active" : "link"}
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

            <div ref={googleTranslateRef} className="google_translateRef"></div>

            {user ? (
              <div className="right_ofHeadBox">
                {/* <div className="linkLi">
                  <Link
                    to="/table"
                    className={location.pathname === "/table" ? "link active" : "link"}
                  >
                    <CiViewTable className="head_colorrCart" />
                  </Link>
                </div> */}
                
                <div className="linkLi">
                  <Link
                    to={(hotelName && room_number && address)
                      ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/cart`
                      : `/cart`}
                    className={location.pathname === "/cart" ? "link active" : "link"}
                  >
                    <FaCartShopping className="head_colorrCart" />
                  </Link>
                </div>

                <div className="linkLi">
                  <Link
                    to="/more"
                    className={location.pathname === "/more" ? "link active" : "link"}
                  >
                    <FaRegUser className="head_colorrCart" />
                  </Link>
                </div>

                {user.is_admin && (
                  <div className="userAndstore">
                    <Link to="/dashboard">
                      <AiOutlineDashboard className="head_colorr" />
                    </Link>
                  </div>
                )}

              </div>
            ) : (
              <div className="right_ofHeadBox">
                <div className="linkLi">
                  <Link to="/cart">
                    <FaCartShopping className="head_colorrCart" />
                  </Link>
                </div>
                <div className="linkLi">
                  <Link to={(hotelName && room_number && address)
                      ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}`
                      : `/loginuser`} 
                  className="Box_icon_login_BiLogIn"
                  >
                    로그인
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