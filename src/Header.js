import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./config";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

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
      .get(`${API_URL}/api/get_user_id/`, {
        withCredentials: true,
      })
      .then((response) => {
        const user_id = response.data.user_id;
        if (user_id == -1) {
          setUser(null);
          return;
        }
        axios
          .get(`${API_URL}/api/user/${user_id}/`, {
            withCredentials: true,
          })
          .then((response) => {
            console.log(response.data);
            setUser(response.data);
          })
          .catch((error) => {
            console.log("エラーが発生しました" + error);
            alert("通信に失敗しました");
          });
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
    <div id="header">
      <div className="logo_cell">
        <Link to="/">
          <span>Votify</span> 気軽にできる投票サイト
        </Link>
      </div>
      <div id="header-menus">
        {user ? (
          <div className="user-cell">
            <a href="#">
              <i id="user-icon" className="fa-solid fa-circle-user fa-3x"></i>
            </a>
            <div className="header-user-menu">
              <ul>
                <li>
                  <Link to="/account_info">{user.username}</Link>
                </li>
                <li>
                  <a onClick={logout}>ログアウト</a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link id="login" to="/login">
            ログイン
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
