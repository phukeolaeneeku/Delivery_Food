import React, { useState, useEffect } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import axios from "axios";
import Swal from "sweetalert2";

function AddInfo() {
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [webInfo, setWebInfo] = useState([]);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setWebInfo(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(webInfo)

  const UpdateInfo = (event) => {
    event.preventDefault();

    let data = JSON.stringify({
      email: email,
      phone: phone,
      address: address,
    });

    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API}/store/web-info/create_update`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        Swal.fire({
          text: "The web info update was successful.",
          icon: "success",
        });
        setEmail("");
        setPhone("");
        setAddress("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <AdminMenu />
      <div className="container_from_info">
        <div className="box_container_from">
          <h4>Edit Web Info</h4>
          <form onSubmit={UpdateInfo}>
            <input
              type="text"
              name="email"
              value={webInfo.email}
              placeholder="Email..."
              className="inputStyle"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              name="phone"
              value={webInfo.tel1}
              placeholder="Phone number..."
              className="inputStyle"
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              name="address"
              value={webInfo.address}
              placeholder="Address..."
              className="inputStyle"
              onChange={(e) => setAddress(e.target.value)}
            />
            <button type="submit" className="Btn_BoxSubmit">
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddInfo;
