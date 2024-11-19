import { useState, useEffect } from "react";
import styled from "styled-components";

const Header = ({ name, age, imgUrl }) => {
  const [imageURL, setimageURL] = useState("");
  const defaultImg = "https://i.ibb.co/k8N4d6t/6.png";

  useEffect(() => {
    // props로 받은 imgUrl이 변경될 때마다 확인
    if (imgUrl === "") {
      setimageURL(defaultImg);
    } else {
      setimageURL(imgUrl);
    }
  }, [imgUrl]);

  return (
    <HeaderContainer>
      <Title>PAWPAW</Title>
      <ProfileContainer>
        <RepresentImageWrapper>
          <RepresentImage src={imageURL} alt="" />
        </RepresentImageWrapper>
        <InformationContainer>
          <Name>{name}</Name>
          <Age>{age}</Age>
        </InformationContainer>
      </ProfileContainer>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 170px;
  background-color: #f9d49b;
  justify-content: start;
  padding: 20px; /* 패딩으로 내부 여백 설정 */
  gap: 10px;
  position: relative;
`;

const Title = styled.span`
  font-family: "KOTRAHOPE", sans-serif;
  font-size: 32px;
  font-weight: 400;
  line-height: 37.28px;
  text-align: left;
  color: #4f2304;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RepresentImageWrapper = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%; /* 원형으로 만들기 */
  overflow: hidden; /* 이미지가 원형을 벗어나지 않게 자르기 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RepresentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지가 잘 맞도록 설정 */
`;

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const Name = styled.span`
  font-family: Karla;
  font-size: 25px;
  font-weight: 700;
  line-height: 29.23px;
  letter-spacing: 0.08em;
  text-align: left;
  color: #6a5555;
`;

const Age = styled.span`
  font-family: Karla;
  font-size: 16px;
  font-weight: 700;
  line-height: 18.7px;
  text-align: left;
  color: #fffdde;
`;

export default Header;
