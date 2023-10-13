import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { API_URL } from "./config";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

const Container = styled.div`
  max-width: 400px;
  width: 100%;
`;

function RegisterComplete() {
  const [message, setMessage] = useState("");

  // 初期処理
  useEffect(() => {
    const token = new URL(window.location.href).searchParams.get("token");
    axios
      .post(
        API_URL + "/api/account_register_complete/",
        { token: token },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.log("エラーが発生しました" + error);
        alert("通信に失敗しました");
      });
  }, []);

  return (
    <>
      <p>{message}</p>
    </>
  );
}

export default RegisterComplete;
