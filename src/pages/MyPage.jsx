import { useState, useEffect } from "react";
import Layout from "../components/common/Layout";
import axios from "axios";
import styled from "styled-components";
import Camera from "../assets/icons/Camera.svg";
import { useNavigate, useParams } from "react-router-dom";
import { child } from "../api/child";

const MyPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState(""); // 이미지 URL 상태 분리
  const [information, setInformation] = useState({
    name: "",
    age: "",
    childaddress: "",
  });

  const defaultImg = "https://i.ibb.co/k8N4d6t/6.png";

  useEffect(() => {
    setImgUrl(defaultImg);

    const fetchChildData = async () => {
      try {
        const response = await child.return(params.id);

        if (response.data.isSuccess) {
          // 이미지 URL 따로 설정
          setImgUrl(response.data.result.profile);
          setInformation({
            name: response.data.result.name,
            age: response.data.result.birthDate,
            childaddress: params.id,
          });
        }
      } catch (error) {
        console.error("데이터 조회 실패:", error);
      }
    };

    if (params.id) {
      fetchChildData();
    }
  }, [params.id]);

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
        setImgUrl(response.data.data.url); // imgUrl 상태만 업데이트
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
      try {
        await uploadToImgBB(file);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <Layout
      name={information.name}
      age={information.age}
      imgUrl={imgUrl} // 분리된 imgUrl 사용
      type="mypage"
      childAddress={params.childAddress}
    >
      <Container>
        <div>
          <TitleWrapper>
            <Title>마이페이지</Title>
          </TitleWrapper>
          <ImageWrapper>
            <ProfileImage src={imgUrl} alt="프로필 이미지" />
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
              />
            </UpdateImageWrapper>
          </ImageWrapper>

          <InformationWrapper>
            <InformationTitle>아이 기본정보</InformationTitle>
            <InfoContainer>
              {Object.entries(information).map(([key, value]) => (
                <InfoItem key={key}>
                  <InfoLabel>{key}</InfoLabel>
                  <InfoValue>{value}</InfoValue>
                </InfoItem>
              ))}
            </InfoContainer>
          </InformationWrapper>
        </div>

        <SyncButton
          onClick={() => {
            navigate(`/synchronization/vaccine/${params.childAddress}`);
          }}
        >
          백신 동기화
        </SyncButton>
      </Container>
    </Layout>
  );
};

const SyncButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: #f9d49b;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-family: KOTRAHOPE;
  font-size: 20px;
  font-weight: 400;
  color: #4f2304;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Container = styled.div`
  padding: 20px;
  background-color: #ffeccf;
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;

  justify-content: space-between;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
