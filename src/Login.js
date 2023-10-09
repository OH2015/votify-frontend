import "./login.css";
import axios from "axios";
import { API_URL, GOOGLE_CLIENT_ID } from "./config";
import React, { useState, useEffect, useRef } from "react";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });

function Login() {
  const googleButton = useRef(null);
  useEffect(() => {
    const src = "https://accounts.google.com/gsi/client";
    const id = GOOGLE_CLIENT_ID;
    loadScript(src)
      .then(() => {
        /*global google*/
        google.accounts.id.initialize({
          client_id: id,
          callback: handleCredentialResponse,
        });
        google.accounts.id.renderButton(googleButton.current, {
          theme: "outline",
          size: "large",
        });
      })
      .catch(console.error);

    return () => {
      const scriptTag = document.querySelector(`script[src="${src}"]`);
      if (scriptTag) document.body.removeChild(scriptTag);
    };
  }, []);

  function handleCredentialResponse(response) {
    if (response.credential) {
      axios
        .post(
          `${API_URL}/google/`,
          { auth_token: response.credential },
          { withCredentials: true }
        )
        .then((res) => {
          document.getElementById("email").value = res.data.email;
          document.getElementById("password").value = res.data.password;
          doLogin();
        })
        .catch((err) => {
          console.log("Error Google login", err);
        });
    }
  }

  const doLogin = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    axios
      .post(
        `${API_URL}/api/login/`,
        { email: email, password: password },
        { withCredentials: true }
      )
      .then((response) => {
        // レスポンス処理
        if (response.data == "Login Success") {
          window.location.href = "/";
        } else {
          alert(response.data);
        }
      })
      .catch((error) => {
        alert("サーバ内部でエラーが発生しました");
        console.log(error);
      });
  };

  return (
    <div id="container" className="container container-fluid">
      <div className="row">
        <label htmlFor="email">メールアドレス</label>
        <input id="email" type="text" name="email" required />
      </div>
      <div className="row">
        <label htmlFor="password">パスワード</label>
        <input id="password" type="password" name="password" required />
      </div>
      <div className="row">
        <input
          type="submit"
          className="btn"
          value="ログイン"
          onClick={doLogin}
        />
      </div>
      <div className="row">
        <div className="col-sm-12">
          <a href="#">メールアドレスで新規登録</a>
        </div>
      </div>
      <div ref={googleButton} id="google-ref"></div>
    </div>
  );
}

export default Login;
