import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { child } from "../../api/child";

const Header = ({ childID }) => {
  const [information, setInformation] = useState({
    profile: null,
    name: "",
    birthDate: "",
  });
  const defaultImg = "https://i.ibb.co/k8N4d6t/6.png";

  const getInformation = useCallback(async () => {
    const response = await child.return(childID);

    setInformation(response.data.result);
  }, [childID]);

  useEffect(() => {
    getInformation();
  }, [getInformation]);

  const calculateMonths = (birthDate) => {
    if (!birthDate) return "나이 정보 없음";

    const today = new Date();
    const birth = new Date(birthDate);

    // 년도 차이를 개월로 변환하고 월 차이를 더함
    const months =
      (today.getFullYear() - birth.getFullYear()) * 12 +
      (today.getMonth() - birth.getMonth());

    // 일자까지 고려하여 계산
    if (today.getDate() < birth.getDate()) {
      return months - 1;
    }

    return months;
  };

  return (
    <HeaderContainer>
      <Title>PAWPAW</Title>
      <ProfileContainer>
        <RepresentImageWrapper>
          <RepresentImage
            src={
              information.profile === null ? defaultImg : information.profile
            }
            alt=""
          />
        </RepresentImageWrapper>
        <InformationContainer>
          <Name>{information.name}</Name>
          <Age>{calculateMonths(information.birthDate)} 개월</Age>
        </InformationContainer>
      </ProfileContainer>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 160px;
  background-color: #f9d49b;
  justify-content: space-between;
  padding: 20px; /* 패딩으로 내부 여백 설정 */
  gap: 10px;
  position: relative;

  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 15px rgba(79, 35, 4, 0.1);

  // 선택사항: 배경에 미묘한 그라데이션 효과를 주어 더 입체감 있게 표현
  background: linear-gradient(
    to bottom,
    #f9d49b 0%,
    #f9d49b 85%,
    rgba(249, 212, 155, 0.95) 100%
  );

  // 선택사항: 내부 상단에 미묘한 하이라이트 효과
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
  }
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
  gap: 15px;
`;

const RepresentImageWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%; /* 원형으로 만들기 */
  overflow: hidden; /* 이미지가 원형을 벗어나지 않게 자르기 */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const RepresentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지가 잘 맞도록 설정 */
`;

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  font-size: 20px;
  font-weight: 700;
  line-height: 18.7px;
  text-align: left;
  color: #ffffff;
`;

export default Header;
