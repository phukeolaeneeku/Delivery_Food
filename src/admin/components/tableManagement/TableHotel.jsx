import React, { useState } from "react";
import "./table.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { Link } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import Swal from 'sweetalert2';

const TableHotel = () => {
  const [data, setData] = useState([
    { id: 1, name: "Rasavong", address: "123 Main St", room: "101" },
    { id: 2, name: "Nanaxad", address: "456 Oak Ave", room: "202" },
    { id: 3, name: "Somchai", address: "789 Pine Rd", room: "303" },
  ]);

  const handleDeleteClick = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f44336",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = data.filter((_, i) => i !== index);
        setData(newData);

        Swal.fire({
          title: "Deleted!",
          text: "The hotel has been deleted.",
          icon: "success"
        });
      }
    });
  };

  return (
    <>
      <AdminMenu />
      <div className="conainer_hotel">
        <div className="container_from">
          <div className="txtAddButton">
            <h2>Hotels</h2>
            <Link to="/add-hotel" className="btn_addtable">
              <BiPlus id="icon_BiPlus" />
              Add Hotel
            </Link>
          </div>

          <table className="tableStyle">
            <thead>
              <tr>
                <th className="thTdStyle">ID</th>
                <th className="thTdStyle">Hotel name</th>
                <th className="thTdStyle">Address</th>
                <th className="thTdStyle">Room</th>
                <th className="thTdStyle">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="thTdStyle">{item.id}</td>
                  <td className="thTdStyle">{item.name}</td>
                  <td className="thTdStyle">{item.address}</td>
                  <td className="thTdStyle">{item.room}</td>
                  <td className="thTdStyle">
                    <Link to="/edit-hotel" className="buttonStyle">
                      Edit
                    </Link>
                    <button
                      className="deleteButtonStyle"
                      onClick={() => handleDeleteClick(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TableHotel;
