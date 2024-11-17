import { useState } from "react";
import Layout from "../components/common/Layout";
import axios from "axios";
import styled from "styled-components";
import Camera from "../assets/icon/Camera.svg";

const MyPage = ({ name, age, imgUrl }) => {
  // 접속할 때 자녀의 주소를 통해서 들어와야 함.
  const [profileImg, setProfileImg] = useState(imgUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo] = useState({
    이름: name,
    생년월일: "생년월일",
    "개월 수": age,
    "연동 코드": "연동 코드",
  });

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setProfileImg(response.data.data.url);
        return response.data.data.url;
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  };

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("파일 크기는 2MB 이하여야 합니다.");
        return;
      }

      setIsLoading(true);
      try {
        await uploadToImgBB(file);
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout name={name} age={age} imgUrl={imgUrl} type="mypage">
      <Container>
        <TitleWrapper>
          <Title>마이페이지</Title>
        </TitleWrapper>

        <ImageWrapper>
          <ProfileImage
            src={isLoading ? imgUrl : profileImg}
            alt="프로필 이미지"
          />
          <UpdateImageWrapper>
            <label htmlFor="profile-upload">
              <UpdateImage src={Camera} alt="카메라" />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: "none" }}
              disabled={isLoading}
            />
          </UpdateImageWrapper>
        </ImageWrapper>

        <InformationWrapper>
          <InformationTitle>아이 기본정보</InformationTitle>
          <InfoContainer>
            {Object.entries(userInfo).map(([key, value]) => (
              <InfoItem key={key}>
                <InfoLabel>{key}</InfoLabel>
                <InfoValue>{value}</InfoValue>
              </InfoItem>
            ))}
          </InfoContainer>
        </InformationWrapper>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  padding: 20px;
  background-color: #ffeccf;
  min-height: 100vh;
`;

const TitleWrapper = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.span`
  font-family: KOTRAHOPE;
  font-size: 32px;
  font-weight: 400;
  line-height: 37.28px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 171px;
  height: 171px;
  margin: 0 auto 40px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #fffdde;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
`;

const UpdateImageWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 54px;
  height: 54px;
  background: #e5ebf0;
  border-radius: 50%;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  label {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const UpdateImage = styled.img`
  width: 40px;
  height: 40px;
`;

const InformationWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
`;

const InformationTitle = styled.span`
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoItem = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  display: flex; // 가로 정렬을 위해 추가
  align-items: center; // 세로 중앙 정렬
  justify-content: space-between; // Label과 Value를 양끝으로 정렬

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: #333;
`;

export default MyPage;
