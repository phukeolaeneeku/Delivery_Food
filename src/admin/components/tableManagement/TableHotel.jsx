import React, { useState } from "react";
import "./table.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { Link } from "react-router-dom";
import { BiPlus } from "react-icons/bi";

const TableHotel = () => {
  const [data, setData] = useState([
    { id: 1, name: "John Doe", address: "123 Main St", room: "101" },
    { id: 2, name: "Jane Smith", address: "456 Oak Ave", room: "202" },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    room: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setFormData(data[index]);
  };

  const handleSaveClick = () => {
    const updatedData = [...data];
    updatedData[editingIndex] = formData;
    setData(updatedData);
    setEditingIndex(null);
  };

  const handleDeleteClick = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  return (
    <>
      <AdminMenu />
      <div className="conainer_hotel">
        <div className="txtAddButton">
          <h2>Table</h2>
          <Link to="#" className="btn_addtable">
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
                  <button
                    className="buttonStyle"
                    onClick={() => handleEditClick(index)}
                  >
                    Edit
                  </button>
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

        {editingIndex !== null && (
          <div>
            <h3>Edit Row</h3>
            <form>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="ID"
                className="inputStyle"
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="inputStyle"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="inputStyle"
              />
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                placeholder="Room"
                className="inputStyle"
              />
              <button
                type="button"
                onClick={handleSaveClick}
                className="formButtonStyle"
              >
                Save
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default TableHotel;
