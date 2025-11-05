import "./Login.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";

export default function Login() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const data = {userId, password}
        fetch(`${config.API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
          }
          return res.json();
        })
        .then((res) => {
          localStorage.setItem("accessToken", res.accessToken);
          alert("로그인 성공")
          navigate("/store")
        })
        .catch((error) => {
          alert(error.message);
          console.log("error:", error);
        });
    };
  
    return (
    <div className="container">
        <h2>로그인</h2>
        <form className="form" onSubmit={handleLogin}>
          <div className="input-group">
            <label className="label" htmlFor="email">아이디</label>
            <input
              type="id"
              id="id"
              className="input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="label" htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button">
            로그인
          </button>
        </form>
      </div>
    );
}