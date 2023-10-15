import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "./config";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: fixed;
  z-index: 100000;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 60px;
  background-color: rgba(163, 245, 211, 1);
  border-color: #bcbcbc;
  border-style: solid;
  border-width: 0 0 1px 0;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
`;

const LogoCell = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  margin-left: 20px;
  width: 250px;
`;

const Menus = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 20px;
  height: 100%;
`;

function Header() {
  const [user, setUser] = useState(null); //ユーザ情報
  const logout = () => {
    axios
      .get(`${API_URL}/api/logout/`, {
        withCredentials: true,
      })
      .then((response) => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.log("エラーが発生しました" + error);
        alert("通信に失敗しました");
      });
  };

  const getUserInfo = () => {
    axios
      .get(`${API_URL}/api/get_user_info/`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.id != null) setUser(response.data);
      })
      .catch((error) => {
        console.log("エラーが発生しました" + error);
        alert("通信に失敗しました");
      });
  };

  // 初期処理
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <HeaderContainer id="header">
      <LogoCell>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="text-secondary">Votify 気軽にできる投票サイト</span>
        </Link>
      </LogoCell>
      <Menus className="header-menus">
        {user ? (
          <div
            className="user-cell p-1 text-dark"
            style={{ textDecoration: "none" }}
          >
            <a href="#" style={{ textDecoration: "none" }}>
              <i id="user-icon" className="fa-solid fa-circle-user fa-3x"></i>
            </a>
            <div className="header-user-menu rounded-3 shadow-lg border">
              <ul className="p-2 m-0">
                <li>
                  <Link to="/account_info" style={{ textDecoration: "none" }}>
                    {user.username}
                  </Link>
                </li>
                <li>
                  <a onClick={logout}>ログアウト</a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link to="/login">
            <button className="btn btn-secondary">ログイン</button>
          </Link>
        )}
      </Menus>
    </HeaderContainer>
  );
}

export default Header;
