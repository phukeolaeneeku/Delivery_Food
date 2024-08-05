import React from "react";
import "./table.css";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";

const Table = () => {
  // Sample data
  const data = [
    { id: 1, date: "2024-08-05", room: "101", orderAmount: 12 },
    { id: 2, date: "2024-08-06", room: "102", orderAmount: 20 },
    { id: 3, date: "2024-08-07", room: "103", orderAmount: 15 },
  ];

  return (
    <>
    <Header />
      <div className="table-container">
        <h2>Order table of the hotel</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Room</th>
              <th>Order Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.date}</td>
                <td>{item.room}</td>
                <td>{item.orderAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Menu/>
    </>
  );
};

export default Table;
