import React, { useState } from "react";
import "./addInfo.css";
import AdminMenu from "../adminMenu/AdminMenu";
import axios from "axios";
import Swal from "sweetalert2";

function AddInfo() {


  return (
    <>
      <AdminMenu />
      <div className="container_from_info">
        <div className="box_container_from">
          <h4>Add Web info</h4>
          <form >
            <input
              type="text"
              name="email"
              placeholder="Email..."
              className="inputStyle"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone number..."
              className="inputStyle"
            />
            <input
              type="text"
              name="address"
              placeholder="Address..."
              className="inputStyle"
            />
            <button
              type="submit"
              className="Btn_BoxSubmit"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddInfo;
