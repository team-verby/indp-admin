import "./Main.css";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import Login from "../login/Login";

export default function Main() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking|authed|unauthed

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setStatus("unauthed"); return; }
    fetch(`${config.API_URL}/stores?page=0&size=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => setStatus(r.status === 200 ? "authed" : "unauthed"))
      .catch(() => setStatus("unauthed"));
  }, []);

  if (status === "checking") return null;
  if (status === "unauthed") return <Login onSuccess={() => setStatus("authed")} />;

  return (
    <div className="main-container">
      <h2>관리자 메인</h2>
      <div className="card-grid">
        <button onClick={() => navigate("/store")}>매장 관리</button>
        {/* 추후 기능 카드 추가 */}
      </div>
    </div>
  );
}