import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./loginUser.css";
import axios from "axios";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const LoginUser = () => {
  const login_en = "Login";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errorText, set_errorText] = useState("");
  const MySwal = withReactContent(Swal);

  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePass = (e) => {
    const value = e.target.value;
    setPass(value);
  };

  const Login = (e) => {
    if (!email) {
      MySwal.fire({
        text: "Please enter your email!",
        icon: "question",
      });
      return;
    }
    if (!pass) {
      MySwal.fire({
        text: "Please enter your password!",
        icon: "question",
      });
      return;
    }

    e.preventDefault(); // Prevent the default form submission behavsior
    let data = JSON.stringify({
      email: email,
      password: pass,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,

      url: import.meta.env.VITE_API + "/user/signin",

      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((res) => {
        const result = res.data;
        const user = {
          email: result.email,
          image: result.image,
          is_admin: result.is_admin,
          store_id: result.store_id,
          origin_store_name: result.origin_store_name,
          user_id: result.user_id,
          user_name: result.user_name,
          is_first: result.is_first,
        };
        const token = result.token.access;
        if (token) {
          window.localStorage.setItem("token", token);
        }
        window.localStorage.setItem("user", JSON.stringify(user));
        navigate("/", { replace: true });
      })
      .catch((error) => {
        // console.error(error.response.data.message);
        MySwal.fire({
          // text: `${error.response.data.message}`,
          text: "Invalid password.",
          icon: "question",
        });

        if (error.response.data.message == "Email does not exist.") {
          MySwal.fire({
            text: "Email does not exist. Please register first!",
            icon: "question",
          });
          navigate("/loginuser", { replace: true });
          MySwal.fire({
            // text: `${error.response.data.message} `,
            text: "Email does not exist.",
            icon: "question",
          });
        }
      });
  };

  return (
    <>
      <Header />
      <div className="header"></div>
      <div className="login_footer">
        <form className="box_container_login2">
          <div className="cover">
            {/* <div className="box_back">
              <Link to="/" className="box_iconBack">
                <MdArrowBack id="iconBack" />
              </Link>
            </div> */}

            <h2 className="box_container_login_text">{login_en}</h2>
            <p className="box_pleaselogin">
            Please log in to use the service!
            </p>
            <div className="input">
              <label>Email</label>
              <input
                className="input_form"
                type="email"
                placeholder="Please enter your email..."
                required
                value={email}
                onChange={handleEmail}
              />
              <label>Password</label>
              <input
                className="input_form"
                type="password"
                placeholder="Please enter your password..."
                required
                value={pass}
                onChange={handlePass}
              />
            </div>

            {/* {errorText.length > 0 && (
            <div id="error_msg" className="error mt20">
              {errorText}
            </div>
          )} */}

            <div className="forgot_password">
            Forgot your password?{" "}
              <Link to={"/forgotPassword"} className="findpassword">
              Find password
              </Link>
            </div>

            <div className="loginbtn_login">
              <Link type="submit" className="login_btn" onClick={Login}>
                Login
              </Link>
            </div>
            <div className="googlebtn_btn">
              <p className="box_dont">
              Is this your first time?
                <Link to={"/signup2"} className="loginmoreLink">
                join the membership
                </Link>
              </p>
            </div>
          </div>
        </form>

        <Menu />
      </div>
    </>
  );
};

export default LoginUser;
