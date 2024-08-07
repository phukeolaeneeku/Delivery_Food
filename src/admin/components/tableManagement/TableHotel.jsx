import React, { useEffect, useState } from "react";
import "./table.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { Link } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import Swal from 'sweetalert2';
import QRCode from "qrcode.react";
import axios from "axios";

const TableHotel = () => {
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [hotel, setHotel] = useState([]);

  // const handleClickHotel = (id) => {
  //   setSelectedTableId(id);
  //   const qrCodeValue = `https://example.com/hotel/${id}`;
  //   Swal.fire({
  //     title: `QR Code for Hotel ${id}`,
  //     html: (
  //       <QRCode value={qrCodeValue} size={200} />
  //     ),
  //     showCloseButton: true,
  //     // showCancelButton: true,
  //     confirmButtonText: "Close",
  //     // cancelButtonText: "Download",
  //   }).then((result) => {
  //     if (result.dismiss === Swal.DismissReason.cancel) {
  //       const canvas = document.querySelector("canvas");
  //       const url = canvas.toDataURL("image/png");
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download = `qrcode-table-${id}.png`;
  //       link.click();
  //     }
  //   });
  // };

  console.log("hotel...", hotel)

  useEffect(() =>{
    fatchHotel()
  }, [])

  const fatchHotel = (() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/hotel-qr",
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      setHotel(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
  })


  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f44336",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {

        let config = {
          method: 'delete',
          maxBodyLength: Infinity,
          url: `http://43.201.158.188:8000/store/hotel-qr/${id}`,
          headers: { }
        };
        
        axios.request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          Swal.fire({
            title: "Deleted!",
            text: "The hotel has been deleted.",
            icon: "success",
          });
          fatchHotel()
        })
        .catch((error) => {
          console.log(error);
        });

        // const newData = hotel.filter((_, i) => i !== index);
        // setHotel(newData);

        // alert("Deleted")
        

        
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
                <th className="thTdStyle">Room_number</th>
                {/* <th className="thTdStyle">QRCode</th> */}
                <th className="thTdStyle">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotel.map((hotel, index) => (
                <tr key={index} >
                  <td className="thTdStyle">{hotel.id}</td>
                  <td className="thTdStyle" onClick={() => handleClickHotel(hotel.id)}>{hotel.hotel}</td>
                  <td className="thTdStyle">{hotel.address}</td>
                  <td className="thTdStyle">{hotel.room_number}</td>
                  {/* <td className="thTdStyle"><img src={hotel.qr_code} alt="" /></td> */}
                  
                  <td className="thTdStyle">
                    <Link to="/edit-hotel" className="buttonStyle">
                      Edit
                    </Link>
                    <button
                      className="deleteButtonStyle"
                      onClick={() => handleDeleteClick(hotel.id)}
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
