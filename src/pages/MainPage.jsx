import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import main from "../assets/image/main.png";

const MainPage = () => {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/login");
  }, 2000);

  return (
    <Container>
      <Image src={main} alt="" />
      <Title>PAWPAW</Title>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ffcc80;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; // 이미지 위에 텍스트 배치를 위한 설정
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;

const Title = styled.span`
  position: absolute; // 이미지 위에 텍스트 위치 설정
  font-family: KOTRA HOPE;
  font-size: 32px;
  font-weight: 900;
  color: #4f2304;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); // 텍스트를 이미지 중앙에 배치
`;

export default MainPage;
