import React, { useState, useEffect } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import axios from "axios";
import Swal from "sweetalert2";

function EditInfo() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [webInfo, setWebInfo] = useState({});

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
    };

    axios
      .request(config)
      .then((response) => {
        const info = response.data[0];
        setWebInfo(info);
        setEmail(info.email);
        setPhone(info.tel1);
        setAddress(info.address);
        setName(info.name);
      })
      .catch((error) => {
        console.error("Error fetching info:", error);
      });
  };

  const updateInfo = (event) => {
    event.preventDefault();

    let data = new FormData();
    data.append("tel1", phone);
    data.append("email", email);
    data.append("address", address);
    data.append("name", name);

    const config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info/create_update",
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        Swal.fire({
          text: "The web info update was successful.",
          icon: "success",
        });
        setEmail("");
        setPhone("");
        setAddress("");
        setName("");
      })
      .catch((error) => {
        console.error("Error updating info:", error);
        Swal.fire({
          text: "There was an error updating the web info.",
          icon: "error",
        });
      });
  };

  return (
    <>
      <AdminMenu />
      <div className="container_from_info">
        <div className="box_container_from">
          <h4>Edit Web Info</h4>
          <form onSubmit={updateInfo}>
            <input
              type="text"
              name="email"
              value={name}
              placeholder="Name..."
              className="inputStyle"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              name="email"
              value={email}
              placeholder="Email..."
              className="inputStyle"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              name="phone"
              value={phone}
              placeholder="Phone number..."
              className="inputStyle"
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              name="address"
              value={address}
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

export default EditInfo;
