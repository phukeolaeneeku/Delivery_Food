import React from "react";
import { useState, useEffect } from "react";
import "./forgotPassword.css";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import axios from "axios";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [errorText, set_errorText] = useState("");
  const MySwal = withReactContent(Swal);
  const [data, set_data] = useState({
    email: "",
    code: "",
    password: "",
    password2: "",
  });
  const [timer, set_timer] = useState({
    minute: 0,
    second: 0,
  });
  const { minute, second } = timer;
  const { email, code, password, password2 } = data;

  function onChange(e) {
    const { name, value } = e.target;
    set_data({
      ...data,
      [name]: value,
    });
  }

  useEffect(() => {
    const countdown = setInterval(() => {
      if (second > 0) {
        set_timer({
          ...timer,
          second: second - 1,
        });
      }
      if (second === 0) {
        if (minute === 0) {
          clearInterval(countdown);
        } else {
          set_timer({
            minute: minute - 1,
            second: 59,
          });
        }
      }
    }, 1000);
    return () => {
      clearInterval(countdown);
    };
  }, [timer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.email) {
      MySwal.fire({
        text: "이메일을 작성해주세요!",
        icon: "question",
      });
      return;
    }
    if (!data.code) {
      MySwal.fire({
        text: "이메일에 있는 인증번호를 입력해주세요!",
        icon: "question",
      });
      return;
    }
    if (!data.password) {
      MySwal.fire({
        text: "비밀번호를 입력해주세요!",
        icon: "question",
      });
      return;
    }
    if (!data.password2) {
      MySwal.fire({
        text: "확인 비밀번호를 입력해주세요!",
        icon: "question",
      });
      return;
    }
    if (data.password != data.password2) {
      MySwal.fire({
        text: "비밀번호가 일치하지 않습니다!",
        icon: "question",
      });
      return;
    }
    if (data.password.length <= 7 || data.password2.length <= 7) {
      MySwal.fire({
        text: "비밀번호는 8자 이상이어야 합니다!",
        icon: "question",
      });
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API}/user/my-page`, data)
      .then((response) => {
        console.log(response.data);
        // alert("Your password has been changed.");
        MySwal.fire({
          text: "귀하의 비밀번호가 변경되었습니다.",
          icon: "success",
        });
        navigate("/loginuser");
      })
      .catch((error) => {
        console.error(error.response.data.message);

        if (error.response.data.message == "Email does not exist.") {
          // alert("Email does not exist. Please register first!");
          MySwal.fire({
            text: "이메일이 존재하지 않습니다. 먼저 등록해주세요!",
            icon: "question",
          });
          navigate("/signup2", { replace: true });
        } else {
          alert(error.response.data.message);
        }
      });
  };

  return (
    <>
      <Header />
      <div className="container_form_forgot">
        <form onSubmit={handleSubmit}>
          
          <h2 className="box_container_login_text">비밀번호 찾기</h2>
          <p>이메일 인증 후 비밀번호를 변경해주세요!</p>
          {/* <div className="box_infor">Enter basic information</div> */}
          <label htmlFor="email">이메일</label>
          <div className="container_form_forgot2">
            <input
              type="email"
              placeholder="이메일을 입력해주세요..."
              id="email"
              name="email"
              value={email}
              onChange={onChange}
            />

            {minute > 0 || second > 0 ? (
              <div id="email_send_btn" className="verification">
                {minute < 10 ? `0${minute}` : minute}:
                {second < 10 ? `0${second}` : second}
              </div>
            ) : (
              <div
                onClick={() => {
                  if (data.email.length > 0) {
                    set_timer({ minute: 3, second: 0 });
                    let config = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: import.meta.env.VITE_API + "/user/send-email",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      data: data,
                    };

                    axios
                      .request(config)
                      .then((response) => {
                        console.log(JSON.stringify(response.data));
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else {
                    set_errorText("Please enter your e-mail.");
                  }
                }}
                id="email_send_btn"
                className="verification"
              >
                확인하다
              </div>
            )}
          </div>
          <label htmlFor="code">코드 확인</label>
          <input
            type="text"
            id="code"
            placeholder="인증번호를 입력해주세요..."
            name="code"
            value={code}
            onChange={onChange}
          />
          <label htmlFor="password">새 비밀번호</label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            placeholder="새 비밀번호를 입력하세요..."
            value={password}
            onChange={onChange}
            name="password"
          />
          <label htmlFor="password2">비밀번호 확인</label>
          <input
            type="password"
            id="password2"
            autoComplete="new-password"
            placeholder="확인 비밀번호를 입력해주세요..."
            value={password2}
            onChange={onChange}
            name="password2"
          />
          <button type="submit">확인</button>
        </form>
        {errorText.length > 0 && (
          <div id="error_msg" className="error mt20">
            {errorText}
          </div>
        )}
      </div>
      <Menu />
    </>
  );
};

export default ForgotPassword;
