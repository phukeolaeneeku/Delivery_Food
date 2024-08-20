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
  const login_en = "로그인";
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
        text: "이메일을 작성해주세요!",
        icon: "question",
      });
      return;
    }
    if (!pass) {
      MySwal.fire({
        text: "비밀번호를 입력해주세요!",
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
          text: "잘못된 비밀번호입니다.",
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
            text: "이메일이 존재하지 않습니다.",
            icon: "question",
          });
        }
      });
  };

  return (
    <>
      <Header />
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
              서비스를 이용하시려면 로그인을 해주세요!
            </p>
            <div className="input">
              <label>이메일</label>
              <input
                className="input_form"
                type="email"
                placeholder="이메일을 입력해주세요..."
                required
                value={email}
                onChange={handleEmail}
              />
              <label>비밀번호</label>
              <input
                className="input_form"
                type="password"
                placeholder="비밀번호를 입력하세요..."
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
              비밀번호를 잊으셨나요?{" "}
              <Link to={"/forgotPassword"} className="findpassword">
                비밀번호 찾기
              </Link>
            </div>

            <div className="loginbtn_login">
              <Link type="submit" className="login_btn" onClick={Login}>
                로그인
              </Link>
            </div>
            <div className="googlebtn_btn">
              <p className="box_dont">
                이번이 처음이신가요?
                <Link to={"/signup2"} className="loginmoreLink">
                  회원가입
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
