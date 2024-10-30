import React from "react";
import styled from "styled-components";
import defaultImage from "../assets/image/defaultImage.svg";
import addImage from "../assets/image/addImage.svg";
import { useNavigate } from "react-router-dom";

const SelectChild = () => {
  // 메타마스크와의 연결을 확인하고 만약 연결되어 있지 않다면 처음으로 돌아가도록

  // 정보를 가져오는 로직이 추가 되어야 함.
  const childrens = [
    {
      name: "땡땡이",
      address: "",
      imgUrl: "", // if url is empty, use default image
    },
    {
      name: "땡땡이",
      address: "",
      imgUrl: "", // if url is empty, use default image
    },
    {
      name: "땡땡이",
      address: "",
      imgUrl: "", // if url is empty, use default image
    },
  ];

  const navigate = useNavigate();

  return (
    <Container>
      <TopBar>
        <TopBarTitle>PAWPAW</TopBarTitle>
        <TopBarButton
          onClick={() => {
            navigate("/synchronization");
          }}
        >
          동기화 하기
        </TopBarButton>
      </TopBar>
      <SelectContainer>
        <Title>아이의 프로필을 선택해주세요</Title>
        <GridContainer>
          {childrens.map((child, index) => (
            // 누르게 되면 자식의 대시보드로 넘어가도록 개발이 되어야 함.
            // 자식들의 주소를 활용하여 대시보드에 접근
            // 만약 다른 부모들이 자식의 데이터에 접근을 하지 못하도록 함.
            <ProfileBox
              key={index}
              onClick={() => {
                console.log("/dashboard");
              }}
            >
              <ProfileImage src={child.imgUrl || defaultImage} alt="profile" />
              <ProfileName>{child.name}</ProfileName>
            </ProfileBox>
          ))}
          <ProfileBox
            onClick={() => {
              navigate("/add");
            }}
          >
            <ProfileImage src={addImage} alt="add profile" />
            <ProfileName>추가</ProfileName>
          </ProfileBox>
        </GridContainer>
      </SelectContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffcc80;
`;

const TopBar = styled.div`
  width: 100%;
  padding: 20px;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopBarTitle = styled.span`
  font-family: KOTRAHOPE;
  font-size: 32px;
  font-weight: 400;
  line-height: 37.28px;
  text-align: left;
  color: #4f2304;
`;

const TopBarButton = styled.button`
  font-family: KOTRAHOPE;
  font-size: 25px;
  font-weight: 400;
  line-height: 37.28px;
  text-align: left;
  color: #4f2304;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
`;

const Title = styled.span`
  font-family: Karla;
  font-size: 20px;
  font-weight: 800;
  line-height: 23.38px;
  text-align: left;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 300px; /* Adjust based on design */
`;

const ProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 126px;
  height: 126px;
  border-radius: 8px;
  background-color: #f0f0f0;
`;

const ProfileName = styled.span`
  margin-top: 8px;
  font-family: Karla;
  font-size: 20px;
  font-weight: 700;
  line-height: 23.38px;
  text-align: left;
`;

export default SelectChild;
