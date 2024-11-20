import React from "react";
import styled from "styled-components";
import Check from "../assets/check.svg"
import Layout from "../components/common/Layout";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Addbutton from "../assets/addbutton.svg"
const DetailContainer = styled.div`
  padding: 32px;

`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #4A4343;
font-family: Karla;
font-size: 20px;
font-style: normal;
font-weight: 700;
line-height: normal;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: #4a4343;
  cursor: pointer;
`;

const Title = styled.h1`
  margin-left: 10px;
  color: #4A4343;
font-family: Karla;
font-size: 20px;
font-style: normal;
font-weight: 700;
line-height: normal;
  font-weight: bold;
  color: #4a4343;

`;

const DetailItem = styled.div`
margin-left : 10px;
margin-top : 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #adadad;
  color: #4A4343;
font-family: Karla;
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: normal;



  .info {
    display: flex;
    //align-items: center;
   

    .check img {
      margin-right: 10px;
      width: 20px;
      height: 20px;
    }

    .name {
      font-size: 16px;
      font-weight: bold;
      color: #4a4343;
     

    }
  }

  .value {
    border-radius: 7px;
    border: 1px solid #B6B6B6;
    background: #FFF;
    padding: 5px 10px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    width : 121px;
    color: #4a4343;
  }

 
`;

const Prescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  img {
    max-width: 100%;
    height: auto;
    border: 1px solid #adadad;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  button {
    background-color: #fff;
    border: 1px solid #adadad;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 14px;
    font-weight: bold;
    color: #4a4343;
    cursor: pointer;
  }
`;



const MedicalDetail = ({ name, age, imgUrl }) => {
  const { id } = useParams(); // URL에서 ID 가져오기
  const navigate = useNavigate(); // useNavigate 훅 사용
  const location = useLocation(); // Link의 state로 전달된 데이터 가져오기
 // const { item } = location.state || {};

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };
  //  // ID에 해당하는 데이터 찾기
  //  const medical = historyData.find((item) => item.id === parseInt(id, 10));
  //  const historyData = location.state?.historyData || []; // 전달받은 historyData

// 기본값으로 빈 배열 설정
const historyData = location.state?.historyData || [];

// historyData가 빈 배열일 경우에 대한 처리
const medical = historyData.find((item) => item.id === parseInt(id, 10));

if (!medical) {
  return (
    <div>
      데이터를 찾을 수 없습니다.
      <button onClick={() => navigate(-1)}>돌아가기</button>
    </div>
  );
}




  // 상세 데이터 예시
  
  // const medicalDetail = {
  //   1: { date : "2024년 10월 19일", symptom: "고열, 두통",  hospital: "행복한 내과",  
  //      doctor: "이수민", dianosis : "고열, 두통 증세가 보임, 3일 뒤에 병원 재방문 요망",
  //      prescription :  "1일 3회 식후 복용", feedback : "꼼꼼히 진료를 잘해주셨다." },
  //   2: { date : "2024년 10월 15일", symptom: "사랑니 발치",  hospital: "미소 치과",  
  //       doctor: "김세종", dianosis : "사랑니 2개 발치함, 3일 뒤에 병원 재방문 요망",
  //       prescription :  "1일 2회 식전 복용", feedback : "꼼꼼히 진료를 잘해주셨다." },
  //   3: { date : "2024년 9월 28일", symptom: "급성 위염",  hospital: "급성 위염",  
  //       doctor: "박진환", dianosis : "급성 위염 증세가 보임, 3일 뒤에 병원 재방문 요망",
  //       prescription :  "1일 2회 식후 복용", feedback : "꼼꼼히 진료를 잘해주셨다." },
   
    
  // };
  // const medical = medicalDetail[id];
   

  return (
    <Layout name={name} age={age} imgUrl={imgUrl}>
      <DetailContainer>
        <Header>
          <BackButton onClick = {handleBack}>{"<"}</BackButton>
          <Title>
            {medical.date} / {medical.symptoms}
          </Title>
        </Header>

        <DetailItem>
          <div className="info">
            <div className="check">
              <img src={Check} alt="checked" />
            </div>
            <div className="name">병원명</div>
          </div>
          <div className="value">{medical.hospitalName}</div>
        </DetailItem>

        <DetailItem>
          <div className="info">
            <div className="check">
            <img src={Check} alt="checked" />
            </div>
            <div className="name">의사 이름</div>
          </div>
          <div className="value">{medical.doctor}</div>
        </DetailItem>

        <DetailItem>
          <div className="info">
            <div className="check">
            <img src={Check} alt="checked" />
            </div>
            <div className="name">진단 내용</div>
          </div>
          <div className="value">{medical.diagnosis}</div>
          
        </DetailItem>

        <DetailItem>
          <div className="info">
            <div className="check">
            <img src={Check} alt="checked" />
            </div>
            <div className="name">처방전</div>
          </div>
          <div className="value">{medical.prescription}</div>
        </DetailItem>

        <DetailItem>
          <div className="info">
            <div className="check">
            <img src={Check} alt="checked" />
            </div>
            <div className="name">후기</div>
          </div>
          <div className="value">{medical.feedback}</div>
         
        </DetailItem>
      </DetailContainer>
    </Layout>
  );
};

export default MedicalDetail;


