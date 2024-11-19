import React, { useEffect, useState } from "react";
import styled from "styled-components";
import defaultImage from "../assets/image/defaultImage.svg";
import addImage from "../assets/image/addImage.svg";
import { useNavigate } from "react-router-dom";
import ParentChildRelationshipABI from "../abi/ParentChildRelationshipWithMeta.json";
import { ethers } from "ethers";
import { decodeData } from "../utils/cryption";

const SelectChild = () => {
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();

  const getChildInformation = async () => {
    if (!window.ethereum) {
      throw new Error("METAMask not install");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    // MetaMask 계정 연결 요청
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      process.env.REACT_APP_PARENT_CHILD_RELATIONSHIP_ADDRESS,
      ParentChildRelationshipABI.abi,
      signer
    );

    const children = await contract.returnChildInformation();

    const decryptedChildren = children.map((child) => {
      try {
        // child 객체의 구조를 유지하면서 암호화된 name 필드만 복호화
        return {
          ...child,
          name: decodeData(child.name, signer.address), // 메타마스크 주소로 복호화
        };
      } catch (error) {
        console.error("Failed to decrypt child name:", error);
        return child; // 복호화 실패 시 원본 데이터 반환
      }
    });

    return decryptedChildren;
  };

  useEffect(() => {
    const fetchChildrenData = async () => {
      try {
        const childData = await getChildInformation();
        setChildren(Array.isArray(childData) ? childData : []);
      } catch (error) {
        console.error("Failed to fetch children data:", error);
      }
    };

    fetchChildrenData();
  }, []);

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
          {children.map((child, index) => (
            <ProfileBox
              key={index}
              onClick={() => {
                // 여기서 백엔드에서 데이터를 조회 하였을 떄 자녀가 있으면 자녀에 대한 정보를 먼저 추가하고 난 이후에 개발을 진행하는 것으로 함
                navigate(`/dashboard/${children[index]["0"]}`);
              }}
            >
              <ProfileImage src={child.imgUrl || defaultImage} alt="profile" />
              <ProfileName>{child.name || "Unknown"}</ProfileName>
            </ProfileBox>
          ))}
          <ProfileBox
            onClick={() => {
              navigate("/addChild");
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
