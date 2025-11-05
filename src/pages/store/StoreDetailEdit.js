import "./StoreDetailEdit.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../config";
import { CustomError } from "../../CustomError";

export default function StoreDetailEdit() {
  const { storeId } = useParams();
  const [storeName, setStoreName] = useState("");
  const [songForm, setSongForm] = useState("");
  const [theme, setTheme] = useState("");
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    fetch(`${config.API_URL}/stores/${storeId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (res) => {
        if (res.ok) return res.json();

        const { message } = await res.json();
        throw new CustomError(res.status, message);
      })
      .then((res) => {
        setStoreName(res.name);
        setSongForm(res.songForms.join(","));
        setTheme(res.themes.join(","));
        setAddress(res.address);
        setRegion(res.region);
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
  }, [storeId, navigate]);

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

    const store = {
      name: storeName,
      songForms: songForm.split(",").map((temp) => temp.trim()),
      themes: theme.split(",").map((temp) => temp.trim()),
      address,
      region,
      imageUrl,
    };

    const accessToken = localStorage.getItem("accessToken");
    fetch(`${config.API_URL}/stores/${storeId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(store),
    })
      .then(async (res) => {
        if (res.ok) return res;

        const { message } = await res.json();
        throw new CustomError(res.status, message);
      })
      .then(() => {
        alert("매장 정보가 수정되었습니다.");
        navigate(`/store/detail/${storeId}`);
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
    <div className="store-detail-edit-container">
      <h2>매장 정보 수정</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>매장명</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
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
          <label>곡 구성 (쉼표로 구분)</label>
          <input
            type="text"
            value={songForm}
            onChange={(e) => setSongForm(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>테마 (쉽표로 구분)</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>이미지</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="업로드된 이미지"
              style={{ width: "100px" }}
            />
          )}
        </div>

        <button type="submit" className="edit-button">
          수정하기
        </button>
      </form>
    </div>
  );
}
