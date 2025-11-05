import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Store.css";
import config from "../../config";
import { CustomError } from "../../CustomError";

export default function Store() {
  const [stores, setStores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    fetch(
      `${config.API_URL}/stores?page=${currentPage - 1}&size=${itemsPerPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then(async (res) => {
        if (res.ok) return res.json();

        const { message } = await res.json();
        throw new CustomError(res.status, message);
      })
      .then((res) => {
        setStores(res.stores);
        setTotalPages(Math.ceil(res.pageInfo.totalElements / itemsPerPage));
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
  }, [currentPage, navigate]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="store-list-container">
      <h2>매장 목록</h2>
      <ul className="store-list">
        {stores.map((store) => (
          <Link to={`/store/detail/${store.id}`} key={store.id}>
            <li className="store-item">
              <div>
                <div>{store.name}</div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
      <div className="pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
      <div className="add-store-button">
        <Link to="/store/add">
          <button>매장 추가</button>
        </Link>
      </div>
    </div>
  );
}
