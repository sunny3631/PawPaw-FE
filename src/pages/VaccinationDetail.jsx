import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import Check from "../assets/check.svg";

const DetailContainer = styled.div`
  padding: 40px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: #4a4343;
  cursor: pointer;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  & > h2 {
    display: flex;
    flex-direction: column;
    color: #4a4343;
    font-family: Karla;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center; /* 체크박스와 텍스트, 입력 요소를 수직 중앙 정렬 */
  justify-content: space-between; /* 텍스트와 입력 요소를 양쪽으로 배치 */
  padding: 20px 0;
  border-bottom: 1px solid #adadad;
  color: #4a4343;
  font-family: Karla;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 10px;

  .info {
    display: flex;
    align-items: center; /* 체크박스와 텍스트를 수직 정렬 */
    flex: 1; /* 텍스트 영역 확장 */
  }

  .check img {
    margin-right: 10px;
    width: 21px;
    height: 21px;
  }

  .name {
    font-size: 16px;
    font-weight: bold;
    color: #4a4343;
  }

  .value {
    border-radius: 7px;
    border: 1px solid #b6b6b6;
    background: rgba(255, 252, 245, 0.75);
    padding: 5px 10px;
    font-size: 14px;
    font-weight: bold;
    color: #4a4343;
    //color: ${(props) => (props.isStatus ? "#80d0ff" : "#4a4343")};
    text-align: center;
    width: 121px;
    height: 27px;
    flex-shrink: 0;
    font-family: Karla;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    &:first-child {
      color: #0486ff;
    }
  }
`;

const VaccinationDetail = ({ name, age, imgUrl }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const location = useLocation(); // useLocation 추가

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const vaccine = location.state?.vaccineInfo;

  if (!vaccine) {
    return <p>백신 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <Layout
      name={name}
      age={age}
      imgUrl={imgUrl}
      childAddress={vaccine.childAddress}
    >
      <DetailContainer>
        <TextContainer>
          <BackButton onClick={handleBack}>{"<"}</BackButton>
          <h2>{vaccine.name}</h2>
        </TextContainer>
        <DetailItem>
          <div className="info">
            <div className="check">
              <img src={Check} alt="checked" />
            </div>
            <div className="name">접종 상태</div>
          </div>
          <div
            className="value"
            style={{
              color: vaccine.status === "접종" ? "#0080FF" : "#FF6B6B", // 텍스트 색상
            }}
          >
            {" "}
            {vaccine.status}
          </div>
        </DetailItem>
        <DetailItem>
          <div className="info">
            <div className="check">
              <img src={Check} alt="checked" />
            </div>
            <div className="name">현재 백신 차수</div>
          </div>
          <div className="value">{vaccine.doses}</div>
        </DetailItem>
        <DetailItem>
          <div className="info">
            <div className="check">
              <img src={Check} alt="checked" />
            </div>
            <div className="name">백신 종류</div>
          </div>
          <div className="value">{vaccine.type}</div>
        </DetailItem>
        {vaccine.status === "접종" && (
          <DetailItem>
            <div className="info">
              <div className="check">
                <img src={Check} alt="checked" />
              </div>
              <div className="name">접종 날짜</div>
            </div>
            <div className="value">{vaccine.date}</div>
          </DetailItem>
        )}
        <DetailItem>
          <div className="info">
            <div className="check">
              <img src={Check} alt="checked" />
            </div>
            <div className="name">
              {vaccine.status === "미접종" ? "접종 기간" : "다음 접종 기간"}
            </div>
          </div>
          <div className="value">{vaccine.next}</div>
        </DetailItem>
      </DetailContainer>
    </Layout>
  );
};

export default VaccinationDetail;
