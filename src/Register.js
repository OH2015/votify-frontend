import React, { useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { API_URL } from "./config";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

const Container = styled.div`
  max-width: 400px;
  width: 100%;
`;

function Register() {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = () => {
    if (document.forms[0].reportValidity()) {
      axios
        .post(
          API_URL + "/api/account_register/",
          {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          window.alert(response.data.message);
        })
        .catch((error) => {
          console.log("エラーが発生しました" + error);
          alert("通信に失敗しました");
        });
    }
  };
  return (
    <Container className="border rounded mx-auto bg-white">
      <form>
        <div className="border-bottom p-3">
          <h4>新規登録</h4>
        </div>
        <div className="border-bottom p-3">
          <p>ユーザ名:</p>
          <input ref={usernameRef} maxLength="20" required className="w-100"></input>
        </div>
        <div className="border-bottom p-3">
          <p>メールアドレス:</p>
          <input ref={emailRef} type="email" required className="w-100"></input>
        </div>
        <div className="border-bottom p-3">
          <p>パスワード:</p>
          <input
            ref={passwordRef}
            type="password"
            minLength="8"
            maxLength="20"
            required
            className="w-100"
          ></input>
        </div>
        <div className="border-bottom p-3">
          <input
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            value="送信"
          ></input>
        </div>
      </form>
    </Container>
  );
}

export default Register;
