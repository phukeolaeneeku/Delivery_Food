import React from "react";
import "./more.css";
import { MdDelete } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { IoKeySharp } from "react-icons/io5";
import { BsBackpack4Fill } from "react-icons/bs";
import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdStorefront } from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import profile from "../../img/profile.jpg";
import axios from "axios";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const More = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);

  const storage = JSON.parse(window.localStorage.getItem("user"));
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    return;
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setShowConfirmation(false);
  };
  const handleCancelLogout = () => {
    setShowConfirmation(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteAccount();
    setShowConfirmationDelete(false);
  };
  const handleCancelDelete = () => {
    setShowConfirmationDelete(false);
  };

  const user = localStorage.getItem("user");

  //Function Delete
  const handleDeleteAccount = async () => {
    try {
      const config = {
        method: "delete",
        url: `${import.meta.env.VITE_API}/user/my-page`, // Assuming your API URL is stored in environment variables
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
        },
      };

      const response = await axios(config);
      if (response.status === 204) {
        // Account deleted successfully
        MySwal.fire({
          text: "Account deleted successfully",
          icon: "success",
        });
        console.log("Account deleted successfully");
        localStorage.clear();
        navigate("/");
        // Perform any other actions (e.g., redirect to home page)
      } else {
        console.error("Failed to delete account:", response.data.message);
        alert("Failed to delete account:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <>
      <Header />
      {/* <div className="header_box_management">
      </div> */}
      <h3>Setting Account</h3>
      <div className="MorePage">
        <div className="profile_box">
          <div className="left_box">
            {storage.image != false ? (
              <img src={storage.image} alt="" />
            ) : (
              <img src={profile} alt="" />
            )}
            <div className="user_name">
              Name: {storage.nickname || storage.email}
            </div>
          </div>
          {/* <Link to="/profileedit" className="right_box">
            <button>View</button>
          </Link> */}
        </div>

        <div className="more-menu-list">
          <hr className="hr" />
          <div onClick={() => setShowConfirmation(true)} className="menu_icon">
            <IoLogOutOutline id="icon_more" />
            <div>Log out </div>
          </div>

          {showConfirmation && (
            <div className="background_addproductpopup_logoutAndDelete">
              <div className="hover_addproductpopup_logoutAndDelete">
                <div className="box_logout">
                  <p>Are you sure you want to log out?</p>
                </div>
                <div className="btn_foasdf">
                  <button
                    className="btn_cancel btn_addproducttxt_popup"
                    onClick={handleCancelLogout}
                  >
                    No
                  </button>
                  <button
                    className="btn_confirm btn_addproducttxt_popup"
                    onClick={handleConfirmLogout}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          <hr className="hr" />
          <div
            className="menu_icon"
            onClick={() => setShowConfirmationDelete(true)}
          >
            <MdDelete id="icon_more" />
            <div>Delete account</div>
          </div>

          {showConfirmationDelete && (
            <div className="background_addproductpopup_logoutAndDelete">
              <div className="hover_addproductpopup_logoutAndDelete">
                <div className="box_logout">
                  <p>Are you sure you want to Delete?</p>
                </div>
                <div className="btn_foasdf">
                  <button
                    className="btn_cancel btn_addproducttxt_popup"
                    onClick={handleCancelDelete}
                  >
                    No
                  </button>
                  <button
                    className="btn_confirm btn_addproducttxt_popup"
                    onClick={handleConfirmDelete}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          <hr className="hr" />
        </div>
      </div>
      <Menu />
    </>
  );
};
export default More;
