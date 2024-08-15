import React, { useState, useEffect } from "react";
import "./orderBill.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { useLocation } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import imageicon from "../../../img/imageicon.jpg";
import { CiCamera } from "react-icons/ci";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiPrinter } from "react-icons/fi";

const OrderBill = () => {
  const token = localStorage.getItem("token");
  const order_id = useParams().bill_id;
  const [order_list, setOrderList] = useState([]);
  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [china_url, set_china_url] = useState("");
  const [lao_url, set_lao_url] = useState("");
  const [order_bill, set_order_bill] = useState(null);
  const MySwal = withReactContent(Swal);
  const usdToKrw = 15.0;
  const usdToKIP = 25000;

  const goBack = () => {
    window.history.back();
  };

  const navigate = useNavigate();

  const handlePrintBill = () => {
    const billElement = document.querySelector(".abill-detial");
    const printWindow = window.open("", "", "height=500px,width=500px");
    printWindow.document.write(`
      <html>
        <head>
          <style>
            @media print {
              @page {
                size: 58mm 210mm;
                margin: 0;
              }
              body {
                width: 58mm;
                margin: 0;
                font-size: 10px;
                font-family: Arial, sans-serif;
              }
              .abill-detial {
                padding: 15px 10px 10px 10px;
                text-align: start;
              }
              .guopoidHead {
                width: 100%;
                text-align: start;
                border-bottom: #4444 solid 1px;
                grid-template-columns: 1fr;
              }
              .billGopBox {
                display: grid;
                width: 100%;
                margin: auto;
                border-bottom: #4444 solid 1px;
              }
              .box_table {
                width: 100%;
              }
              .txtHeader {
                width: 100%;
                display: flex;
                justify-content: space-between;
                margin: 0.5rem 0;
              }
              .Header {
                width: 100%;
                text-align: center;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 5px;
              }
              .Header_review{
                display: none;
              }
              .Delivered_review{
                display: none;
              }
              .txt_Des {
                width: 100%;
                text-align: center;
              }
              .titlePrice {
                padding: 0;
                margin-top: -1.2rem;
                display: flex;
                text-align: center;
                justify-content: space-between;
              }
              .place-on {
                text-align: start;
              }
              .Delivered_review{
                display: none;

              }
              .txtHeader .Header{
                font-size: 12px;
              }
              .titlePrice h4{
                font-size: 12px;
                font-weight: 100;
              }
              .Header{
                padding: 10px 0;
                border-bottom: #4444 solid 1px;
              }
              .box_totleAdd_container{
                border-bottom: #4444 solid 1px;
              }
              .container_Order_Bill{
                display: none;
              }
              .aplace_form_button{
                display: none;
              }

            }
          </style>
        </head>
        <body>
          ${billElement.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  useEffect(() => {
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/check-token",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.result != "success") {
          localStorage.clear();
          navigate("/loginuser");
          return;
        }
      })
      .catch((error) => {
        localStorage.clear();
        console.log(error);
        navigate("/loginuser");
        return;
      });
  }, [token]);

  useEffect(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setOrderList(response.data);
        set_name(response.data.user.name);
        set_email(response.data.user.email);
        set_china_url(response.data.china_url);
        set_lao_url(response.data.lao_url);
        set_order_bill(response.data.order_bill);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [order_id, order_bill]);

  const ConfirmOrder = (e) => {
    e.preventDefault();

    let data = "";
    if (order_list.status == "Pending") {
      data = JSON.stringify({
        status: "Processing",
      });
    } else if (order_list.status == "Processing") {
      data = JSON.stringify({
        status: "Shipped",
      });
    } else if (order_list.status == "Shipped") {
      data = JSON.stringify({
        status: "Delivered",
      });
    } else if (order_list.status == "Delivered") {
      data = JSON.stringify({
        status: "Delivered",
      });
    } else {
      data = JSON.stringify({
        status: "Delivered",
      });
    }

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/update/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (order_list.status == "Pending") {
          MySwal.fire({
            text: "This order has been received.",
            icon: "success",
          });
          navigate("/order/processing");
        } else if (order_list.status == "Processing") {
          MySwal.fire({
            text: "This order has been processed",
            icon: "success",
          });
          navigate("/order/shipped");
        } else if (order_list.status == "Shipped") {
          MySwal.fire({
            text: "This order has been shipped.",
            icon: "success",
          });
          navigate("/order/delivered");
        } else if (order_list.status == "Delivered") {
          MySwal.fire({
            text: "This order has been delivered.",
            icon: "success",
          });
          navigate("/order/delivered");
        } else {
          MySwal.fire({
            text: "This order has been delivered.",
            icon: "success",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // console.log("china_url ", china_url);
  // console.log("lao_url ", lao_url);

  const ChangeChinaURL = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      china_url: china_url,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url:
        import.meta.env.VITE_API + `/store/order/update/china-url/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        MySwal.fire({
          text: "China URL has been added.",
          icon: "success",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ChangeLaoURL = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      lao_url: lao_url,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/update/lao-url/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        MySwal.fire({
          text: "Lao URL has been added.",
          icon: "success",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ChangeOrderBill = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("order_bill", order_bill);

    const requestOptions = {
      method: "PUT",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/order/update/order-bill/${order_id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        MySwal.fire({
          text: "Add bill successfully.",
          icon: "success",
        });
        setPopupImageBill(false);
      })
      .catch((error) => console.error(error));
  };

  // console.log("order bill: ", order_bill);
  // console.log("mainImageBill: ", mainImageBill);
  return (
    <>
      <AdminMenu />
      <section id="abill">
        <div className="abill-detial">
          <div className="container_Order_Bill">
            <button onClick={goBack} className="back_Order_Bill">
              <FaAngleLeft id="box_icon_Back" />
              <div>Back</div>
            </button>
            <div className="box_containner_FiPrinter">
              <FiPrinter id="FiPrinter" onClick={handlePrintBill} />
            </div>
          </div>

          <div className="guopoidHead">
            <p>주문 ID: {order_list.id}</p>
            <p>사용자: {name || email}</p>
          </div>

          <div className="billGopBox">
            <div className="box_table">
              <div className="txtHeader">
                <div className="Header">제품명</div>
                <div className="Header">가격</div>
                <div className="Header">양</div>
                <div className="Header">물</div>
              </div>

              {order_list.items &&
                order_list.items.map((item) => (
                  <div className="txtHeader" key={item.id}>
                    <div className="txt_Des">{item.product.name}</div>
                    <div className="txt_Des">
                      $
                      {parseFloat(item.price).toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                        useGrouping: true,
                      })}
                    </div>
                    <div className="txt_Des">{item.quantity}</div>
                    <div className="txt_Des">{item.size}</div>
                  </div>
                ))}
            </div>
          </div>

          <div className="box_totleAdd_container">
            <p className="box_more_details">
              자세한 내용: {order_list.province}
            </p>

            <div className="titlePrice">
              <h4>합계 USD :</h4>
              <p>$ {order_list.total_prices}</p>
            </div>
            <div className="titlePrice">
              <h4>합계 KIP :</h4>
              <p>{order_list.total_prices * usdToKIP} KIP</p>
            </div>
            <div className="titlePrice">
              <h4>T합계 KRW :</h4>
              <p>₩ {order_list.total_prices * usdToKrw}</p>
            </div>
          </div>

          <div className="aplace-on">
            <div className="box_place">
              <div className="place-on">
                <p className="box_more_details">
                  자세한 내용: {order_list.province}
                </p>
                <p>
                  결제일: {new Date(order_list.created_at).toLocaleString()}
                </p>
                <p>결제수단: {order_list.account_name}</p>
                <p>연락처: +856 {order_list.tel}</p>
                <p>배송받을 주소: {order_list.district}</p>
                <p>지위: {order_list.status}</p>
              </div>
            </div>
            <div className="status btn">
              {order_list.status !== "Delivered" && (
                <button
                  type="submit"
                  className="aplace_form_button "
                  onClick={ConfirmOrder}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderBill;
