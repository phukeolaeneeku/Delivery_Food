import React from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCode = () => {
  return (
    <div style={{ textAlign: "center", width: "100%", marginTop: "15rem", fontSize: "100%"}}>
      <p>My scan QR code</p>
      <QRCodeSVG value="http://Findfood.com/" />
    </div>
  );
};

export default QRCode;
