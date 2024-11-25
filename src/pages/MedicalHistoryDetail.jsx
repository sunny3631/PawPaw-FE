import React, { useState } from "react";
import styled from "styled-components";
import Check from "../assets/check.svg";
import Layout from "../components/common/Layout";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const DetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 8px 16px;
  margin: -8px -16px;
  color: #4a4343;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &::before {
    content: "";
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: ${`url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 12H5M5 12L12 19M5 12L12 5' stroke='%234A4343' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`};
    background-repeat: no-repeat;
    background-position: center;
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #000;
    &::before {
      transform: translateX(-4px);
    }
  }
`;

const Title = styled.h1`
  color: #4a4343;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  background: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .info {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 140px;
    flex-shrink: 0;

    .check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: rgba(255, 204, 128, 0.2);
      border-radius: 50%;

      img {
        width: 16px;
        height: 16px;
      }
    }

    .name {
      font-size: 16px;
      font-weight: 600;
      color: #4a4343;
    }
  }

  .value {
    flex: 1;
    padding: 12px 16px;
    background: rgba(255, 252, 245, 0.75);
    border-radius: 8px;
    border: 1px solid rgba(182, 182, 182, 0.3);
    color: #4a4343;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  background: #fffcf5;
  border-radius: 16px;
  margin-top: 32px;
`;

const ErrorTitle = styled.h2`
  color: #4a4343;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
`;

const ErrorMessage = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0 0 24px 0;
`;

const ReturnButton = styled.button`
  background: #ffcc80;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: #4a4343;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ffb74d;
    transform: translateY(-2px);
  }
`;

const ContentSection = styled.div`
  background: #fffcf5;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const BasicInfoSection = styled(ContentSection)`
  margin-bottom: 24px;
`;

const DetailSection = styled(ContentSection)`
  position: relative;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => (props.$isExpanded ? "16px" : "0")};
  padding-bottom: ${(props) => (props.$isExpanded ? "16px" : "0")};
  border-bottom: ${(props) =>
    props.$isExpanded ? "1px solid rgba(74, 67, 67, 0.1)" : "none"};
`;

const DetailTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4a4343;
  font-size: 18px;
  font-weight: 600;
  margin: 0;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 204, 128, 0.2);
    border-radius: 50%;

    img {
      width: 16px;
      height: 16px;
    }
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #4a4343;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: #000;
  }
`;

const DetailContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: ${(props) => (props.$isExpanded ? "16px" : "0")};
  max-height: ${(props) => (props.$isExpanded ? "400px" : "0")};
  overflow-y: auto;
  opacity: ${(props) => (props.$isExpanded ? "1" : "0")};
  transition: all 0.3s ease;

  .content-text {
    white-space: pre-wrap;
    line-height: 1.6;
    color: #4a4343;
    font-size: 14px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ffcc80;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ffb74d;
  }
`;

const MedicalDetail = () => {
  const { childAddress, childID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const medical = location.state?.medicalDetail;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  if (!medical) {
    return (
      <Layout childAddress={childAddress} childID={childID}>
        <DetailContainer>
          <ErrorContainer>
            <ErrorTitle>데이터를 찾을 수 없습니다</ErrorTitle>
            <ErrorMessage>
              요청하신 진료 기록을 찾을 수 없습니다. 페이지를 새로고침하거나
              목록으로 돌아가주세요.
            </ErrorMessage>
            <ReturnButton
              onClick={() =>
                navigate(`/medicalHistory/${childAddress}/${childID}`)
              }
            >
              목록으로 돌아가기
            </ReturnButton>
          </ErrorContainer>
        </DetailContainer>
      </Layout>
    );
  }

  console.log(medical);

  return (
    <Layout childAddress={childAddress} childID={childID}>
      <DetailContainer>
        <Header>
          <HeaderContent>
            <BackButton onClick={handleBack} />
            <Title>
              {medical.date} / {medical.symptoms}
            </Title>
          </HeaderContent>
        </Header>

        <BasicInfoSection>
          <DetailItem>
            <div className="info">
              <div className="check">
                <img src={Check} alt="checked" />
              </div>
              <div className="name">
                {medical.medicalType === 0 ? "병원명" : "약국명"}
              </div>
            </div>
            <div className="value">{medical.visitedName}</div>
          </DetailItem>

          <DetailItem>
            <div className="info">
              <div className="check">
                <img src={Check} alt="checked" />
              </div>
              <div className="name">
                {medical.medicalType === 0 ? "의사 이름" : "약사 이름"}
              </div>
            </div>
            <div className="value">
              {medical.doctorName === ""
                ? "정보가 없습니다"
                : medical.doctorName}
            </div>
          </DetailItem>

          <DetailItem>
            <div className="info">
              <div className="check">
                <img src={Check} alt="checked" />
              </div>
              <div className="name">증상</div>
            </div>
            <div className="value">{medical.symptoms}</div>
          </DetailItem>
        </BasicInfoSection>

        <DetailSection>
          <DetailHeader $isExpanded={isExpanded}>
            <DetailTitle>
              <div className="icon">
                <img src={Check} alt="checked" />
              </div>
              {medical.medicalType === 0 ? "진단 내용" : "처방 내용"}
            </DetailTitle>
            <ExpandButton
              onClick={() => setIsExpanded(!isExpanded)}
              $isExpanded={isExpanded}
            >
              {isExpanded ? "접기" : "펼치기"}
            </ExpandButton>
          </DetailHeader>
          <DetailContent $isExpanded={isExpanded}>
            <div className="content-text">{medical.diagnosis}</div>
          </DetailContent>
        </DetailSection>
      </DetailContainer>
    </Layout>
  );
};

export default MedicalDetail;
