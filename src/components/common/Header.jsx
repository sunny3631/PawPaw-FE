import styled from "styled-components";

const Header = ({ name, imgUrl }) => {
  return (
    <HeaderContainer>
      <Title>PAWPAW</Title>
      <ProfileContainer>
        <RepresentImageWrapper>
          <RepresentImage src={imgUrl} alt="" />
        </RepresentImageWrapper>
        <Name>{name}</Name>
      </ProfileContainer>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 111px;
  background-color: #7fabd4;
  position: relative;
  padding: 20px; /* 패딩으로 내부 여백 설정 */
`;

const Title = styled.span`
  margin-top: 25px;
  font-size: 24px;
  font-weight: bold;
  color: black;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: -50px; /* 이미지가 컨테이너 아래쪽에 걸치게 설정 */
`;

const RepresentImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%; /* 원형으로 만들기 */
  border: 8px solid #89abda; /* 컨테이너와 동일한 색상의 테두리 */
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

const Name = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-left: 10px; /* 이름과 이미지 간의 간격 조정 */
  margin-bottom: 20px;
`;

export default Header;
