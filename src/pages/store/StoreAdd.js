import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StoreAdd.css";
import config from "../../config";
import { CustomError } from "../../CustomError";

export default function StoreAdd() {
  const [storeName, setStoreName] = useState("");
  const [songForm, setSongForm] = useState("");
  const [theme, setTheme] = useState("");
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const accessToken = localStorage.getItem("accessToken");
      fetch(`${config.API_URL}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })
        .then(async (res) => {
          if (res.ok) return res.json();

          const { message } = await res.json();
          throw new CustomError(res.status, message);
        })
        .then((res) => {
          setImageUrl(res.imageUrl);
        })
        .catch((error) => {
        if (error instanceof CustomError) {
          if (error.code === 401) {
            alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
            navigate("/")
          } else {
            alert(error.message);
          }
        } else {
          alert("문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
          console.log("Unexpected Error:", error);
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newStore = {
      name: storeName,
      songForms: songForm.split(",").map((temp) => temp.trim()),
      themes: theme.split(",").map((temp) => temp.trim()),
      address,
      region,
      imageUrl,
    };

    const accessToken = localStorage.getItem("accessToken");
    fetch(`${config.API_URL}/stores`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStore),
    })
      .then(async (res) => {
        if (res.ok) return res;

        const { message } = await res.json();
        throw new CustomError(res.status, message);
      })
      .then((res) => {
        alert("매장이 추가되었습니다.");
        navigate(`/store`);
      })
      .catch((error) => {
        if (error instanceof CustomError) {
          if (error.code === 401) {
            alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
            navigate("/")
          } else {
            alert(error.message);
          }
        } else {
          alert("문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
          console.log("Unexpected Error:", error);
        }
      });
  };

  return (
    <div className="store-add-container">
      <h2>매장 추가</h2>
      <form onSubmit={handleSubmit} className="store-form">
        <div className="form-group">
          <label>매장명</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>곡 구성 (쉼표로 구분)</label>
          <input
            type="text"
            value={songForm}
            onChange={(e) => setSongForm(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>테마 (쉼표로 구분)</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>지역</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>주소</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>이미지</label>
          <input 
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="업로드된 이미지"
              style={{ width: "100px" }}
            />
          )}
        </div>

        <button type="submit">매장 추가</button>
      </form>
    </div>
  );
}
