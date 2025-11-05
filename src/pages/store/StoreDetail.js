import React, { useEffect, useState } from "react";
import "./StoreDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../config";
import { CustomError } from "../../CustomError";

export default function StoreDetail() {
  const { storeId } = useParams();
  const [store, setStore] = useState({
    name: "",
    imageUrl: "",
    region: "",
    address: "",
    themes: [],
    songForms: [],
  });

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
      .then((data) => {
        setStore(data);
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

  const handleEdit = () => {
    navigate(`/store/edit/${storeId}`);
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 매장을 삭제하시겠습니까?")) {
      const accessToken = localStorage.getItem("accessToken");
      fetch(`${config.API_URL}/stores/${storeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(async (res) => {
          if (res.ok) return res;

          const { message } = await res.json();
          throw new CustomError(res.status, message);
        })
        .then(() => {
          alert("매장이 삭제되었습니다.");
          navigate("/store");
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

  const handleGoBack = () => {
    navigate("/store"); // 매장 목록 페이지로 이동
  };

  return (
    <div className="store-detail-container">
      <button className="go-back-button" onClick={handleGoBack}>
        ⬅️ 매장 목록
      </button>
      <h2>{store.name}</h2>
      <div className="store-image-container">
        <img src={store.imageUrl} alt={store.name} className="store-image" />
      </div>
      <div className="store-info">
        <p>
          <strong>지역:</strong> {store.region}
        </p>
        <p>
          <strong>주소:</strong> {store.address}
        </p>
        <p>
          <strong>곡 구성:</strong> {store.songForms.join(",")}
        </p>
        <p>
          <strong>테마:</strong> {store.themes.join(",")}
        </p>
      </div>
      <div className="buttons-container">
        <button className="edit-button" onClick={handleEdit}>
          수정하기
        </button>
        <button className="delete-button" onClick={handleDelete}>
          삭제하기
        </button>
      </div>
    </div>
  );
}
