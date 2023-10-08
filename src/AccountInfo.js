import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { API_URL } from "./config";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

const Container = styled.div`
  max-width: 400px;
`;

function AccountInfo() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    profile: "",
  });

  const getUserInfo = () => {
    axios
      .get(`${API_URL}/api/get_user_info/`, { withCredentials: true })
      .then((res) => {
        if (res.data.id === null) {
          window.location.href = "/login";
        } else {
          setUser({
            ...user,
            username: res.data.username,
            email: res.data.email,
            profile: res.data.profile,
          });
        }
      });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Container className="border rounded w-50 mx-auto">
      <div className="border-bottom p-3">
        <p>ユーザ名:</p>
        <p>{user.username}</p>
      </div>
      <div className="border-bottom p-3">
        <label>メールアドレス:</label>
        <p>{user.email}</p>
      </div>
      <div className="p-3">
        <p>プロフィール:</p>
        {user.profile}
      </div>
    </Container>
  );
}

export default AccountInfo;
