import "./menu.css";
import { Link, useLocation } from "react-router-dom";
import QRCode_delivery from "../../img/QRCode_delivery.png";
import Logo1 from "../../img/Logo1.png";
import { FaRegUser } from "react-icons/fa6";
import { HiOutlineHome } from "react-icons/hi";
import { BsShop, BsClipboardCheck } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { GrContact } from "react-icons/gr";
import { BsCart3 } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Menu = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");
  const [data, setData] = useState([]);

  // console.log("data.....", data)

  // Function to handle click on menu item
  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem);
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
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // console.log("data.tel1......",data.tel1)
  return (
    <section>
      {/*Footer Menu For PC */}

      <footer className="footerBox">
        {data.map((i, index) => (
          <div className="footer_Container" key={index}>
            <div className="footconentBox">
              <h3 className="txt_footHead">About us</h3>
              <Link to="/" className="txt_pFoot">
                <img src={i.logo} alt="" />
              </Link>
              <p className="txt_pFoot">{i.name}</p>
            </div>

            <div className="footconentBox">
              <h3 className="txt_footHead">Contact us</h3>
              <p className="txt_pFoot">Phone: {i.tel1}</p>
              {/* <p className="txt_pFoot">Phone: {i.tel2}</p> */}
              <p className="txt_pFoot">Email: {i.email}</p>
              <p className="txt_pFoot">Address: {i.address}</p>
            </div>
            <div className="footconentBox3">
              <h3 className="txt_footHead txh3">Find foodURL</h3>
              <div className="foot_contentItem">
                <img src={QRCode_delivery} alt="QrdownloadApp" />
              </div>
            </div>
          </div>
        ))}

        <hr className="hrfoo" />
        <p className="lastFooter">Copyright &#169; Delivery 2024</p>
      </footer>

      {/* Footer Menu For Mobile */}

      <div className="menubar">
        <Link
          to="/"
          className={location.pathname === "/" ? "box-menu active" : "box-menu"}
          onClick={() => handleMenuClick("/")}
        >
          <span className="iconMenuSpan">
            <HiOutlineHome />
          </span>
          <span>Home</span>
        </Link>
        <Link
          to="/order"
          className={
            location.pathname === "/order" ? "box-menu active" : "box-menu"
          }
          onClick={() => handleMenuClick("/order")}
        >
          <span className="iconMenuSpan">
            <BsClipboardCheck />
          </span>
          <span>Order</span>
        </Link>
        <Link
          to="/cart"
          className={
            location.pathname === "/cart" ? "box-menu active" : "box-menu"
          }
          onClick={() => handleMenuClick("/cart")}
        >
          <span className="iconMenuSpan">
            <BsCart3 />
          </span>
          <span>Cart</span>
        </Link>
        <Link
          to="https://open.kakao.com/o/gUkkzsIg"
          className={
            location.pathname ===
            "https://open.kakao.com/o/gUkkzsIg"
              ? "box-menu active"
              : "box-menu"
          }
          onClick={() =>
            handleMenuClick(
              "https://open.kakao.com/o/gUkkzsIg"
            )
          }
        >
          <span className="iconMenuSpan">
            <GrContact />
          </span>

          <span>Kakao</span>
        </Link>

        <Link
          to="/more"
          className={location.pathname === "/more" ? "box-menu active" : "box-menu"}
        >
          <span className="iconMenuSpan">
            <FaRegUser />
          </span>
          <span>User</span>
        </Link>
      </div>
    </section>
  );
};

export default Menu;
