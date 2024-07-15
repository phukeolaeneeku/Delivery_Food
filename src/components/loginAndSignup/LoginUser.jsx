import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./loginUser.css";
import { MdArrowBack } from "react-icons/md";
// import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
// import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

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
        text: "Please fill the email!",
        icon: "question",
      });
      return;
    }
    if (!pass) {
      MySwal.fire({
        text: "Please fill the password!",
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
          text: `${error.response.data.message}`,
          icon: "question",
        });

        if (error.response.data.message == "Email does not exist.") {
          MySwal.fire({
            text: "Email does not exist. Please register first!",
            icon: "question",
          });
          navigate("/loginuser", { replace: true });
          MySwal.fire({
            text: `${error.response.data.message} `,
            icon: "question",
          });
        }
      });
  };

  const [authUrl, setAuthUrl] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API + "/user/social/url/",
        {
          code: "your_code_here", // Replace 'your_code_here' with the actual code
        }
      );
      setAuthUrl(response.data.url);
    } catch (error) {
      console.error("Error fetching Google auth URL:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="login_footer">
        <div className="box_container_login2">
          <form onSubmit={Login}>
            <Link to="/">
              <MdArrowBack id="iconBack" />
            </Link>
            <h2>{login_en}</h2>
            <p>Please Log in to use the service!</p>

            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input_form"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={handleEmail}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input_form"
              type="password"
              placeholder="Enter your password"
              required
              value={pass}
              onChange={handlePass}
            />

            {/* {errorText.length > 0 && (
            <div id="error_msg" className="error mt20">
              {errorText}
            </div>
          )} */}

            <div className="forgot_password">
              Forgot your password?{" "}
              <Link to="/forgotPassword">Find password</Link>
            </div>

            <button type="submit" className="login_btn">
              Login
            </button>

            <div className="googlebtn_btn">
              Is this your first time?{" "}
              <Link to="/signup2" className="loginmoreLink">
                Join the membership
              </Link>
            </div>
          </form>
        </div>

        <Menu />
      </div>
    </>
  );
};

export default LoginUser;
