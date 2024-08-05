import React from "react";
import "./addHotel.css";
import AdminMenu from "../adminMenu/AdminMenu";

function Edit() {




  return (
    <>
     <AdminMenu />
      <div className="container_from_hotel">
        <div className="container_from">
        <h4>Edit Hotel</h4>
          <form>
            <input
              type="text"
              name="name"
              placeholder="Hotel name..."
              className="inputStyle"
            />
            <input
              type="text"
              name="address"
              placeholder="Address..."
              className="inputStyle"
            />
            <input
              type="text"
              name="room"
              placeholder="Room number..."
              className="inputStyle"
            />
            <button
              type="submit"
              className="BoxSubmit"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Edit;
