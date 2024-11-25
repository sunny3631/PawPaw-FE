import { useState, useEffect, useCallback } from "react";
import Layout from "../components/common/Layout";
import axios from "axios";
import styled from "styled-components";
import Camera from "../assets/icons/Camera.svg";
import { useNavigate, useParams } from "react-router-dom";
import { child } from "../api/child";

const MyPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(null); // 이미지 URL 상태 분리
  const [displayInformation, setDisplayInformation] = useState({
    name: "",
    age: "",
    heigth: "",
    weight: "",
    childaddress: "",
  });

  // 서버 통신용 원본 데이터
  const [originalData, setOriginalData] = useState({
    name: "",
    height: 0,
    weight: 0,
    address: "",
    birthDate: "",
  });

  const [isAddressExpanded, setIsAddressExpanded] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const defaultImg = "https://i.ibb.co/k8N4d6t/6.png";

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // 생일이 아직 지나지 않은 경우 1을 빼줍니다
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    // 1세 미만인 경우 개월 수로 표시
    if (age === 0) {
      let months = today.getMonth() - birth.getMonth();
      if (today.getDate() < birth.getDate()) {
        months--;
      }
      if (months < 0) {
        months += 12;
      }
      return `${months}개월`;
    }

    return `${age}세`;
  };

  const fetchChildData = useCallback(async () => {
    if (!params.id) return;

    try {
      const response = await child.return(params.id);

      if (response.data.isSuccess) {
        const result = response.data.result;

        setOriginalData({
          name: result.name,
          height: result.height,
          weight: result.weight,
          address: result.address,
          birthDate: result.birthDate,
          // 기타 필요한 원본 데이터
        });

        // 이미지 URL 따로 설정
        if (result.profile !== null) {
          setImgUrl(result.profile);
        }

        setDisplayInformation({
          name: result.name,
          age: calculateAge(result.birthDate),
          heigth: `${result.height / 10} cm`,
          weight: `${result.weight / 10} kg`,
          childaddress: result.address,
        });
      }
    } catch (error) {
      console.error("데이터 조회 실패:", error);
      alert("데이터를 불러오는데 실패했습니다.");
    }
  }, [params.id]);

  useEffect(() => {
    fetchChildData();
  }, [fetchChildData, params.id]);

  const formatAddress = (address) => {
    if (!address) return "";
    if (address.length <= 20 || isAddressExpanded) return address;
    return address.slice(0, 20) + "...";
  };

  const copyAddressToClip = async (address) => {
    try {
      await navigator.clipboard.writeText(address);
      setShowCopyNotification((prev) => !prev);

      setTimeout(() => {
        setShowCopyNotification((prev) => !prev);
      }, 3000);
    } catch (error) {
      console.error("주소 복사 실패 : ", error);
      alert("주소 복사에 실패하였습니다.");
    }
  };

  const toggleAddress = (e) => {
    e.stopPropagation();
    setIsAddressExpanded(!isAddressExpanded);
  };

  const uploadToImgBB = async (file) => {
    if (!file || !(file instanceof File)) {
      throw new Error("올바른 파일이 아닙니다.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data.success) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }

    return response.data.data.url;
  };

  const updateChildInformation = async (imageURL) => {
    const requestBody = {
      ...originalData,
      profile: imageURL,
    };

    const response = await child.update(params.id, requestBody);

    if (!response.data.isSuccess) {
      throw new Error("프로필 업데이트에 실패했습니다.");
    }

    return response;
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
        const imageURL = await uploadToImgBB(file);
        await updateChildInformation(imageURL);

        setImgUrl(imageURL);
        alert("프로필이 업데이트되었습니다.");
      } catch (error) {
        console.error("프로필 업데이트 실패 : ", error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout
      type="mypage"
      childID={params.id}
      childAddress={params.childAddress}
    >
      <Container>
        <div>
          <TitleWrapper>
            <Title>마이페이지</Title>
          </TitleWrapper>
          <ImageWrapper>
            <ProfileImage
              src={imgUrl === null ? defaultImg : imgUrl}
              alt="프로필 이미지"
            />
            <UpdateImageWrapper>
              <label htmlFor="profile-upload">
                <UpdateImage
                  src={Camera}
                  alt="카메라"
                  style={{
                    opacity: isLoading ? 0.5 : 1,
                  }}
                />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                style={{ display: "none" }}
              />
            </UpdateImageWrapper>
            {isLoading && <LoadingOverlay>업로드 중...</LoadingOverlay>}
          </ImageWrapper>

          <InformationWrapper>
            <InformationTitle>아이 기본정보</InformationTitle>
            <InfoContainer>
              {Object.entries(displayInformation).map(([key, value]) => {
                const getKoreanLabel = (key) => {
                  const labelMap = {
                    name: "이름",
                    age: "나이",
                    heigth: "키",
                    weight: "몸무게",
                    childaddress: "주소",
                  };
                  return labelMap[key] || key;
                };

                return (
                  <InfoItem key={key}>
                    <InfoLabel>{getKoreanLabel(key)}</InfoLabel>
                    {key === "childaddress" ? (
                      <AddressContainer>
                        <AddressText
                          onClick={() => {
                            copyAddressToClip(value);
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {formatAddress(value)}
                        </AddressText>
                        {value && value.length > 20 && (
                          <ExpandButton onClick={toggleAddress}>
                            {isAddressExpanded ? "접기" : "더보기"}
                          </ExpandButton>
                        )}
                      </AddressContainer>
                    ) : (
                      <InfoValue>{value}</InfoValue>
                    )}
                  </InfoItem>
                );
              })}
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

        {showCopyNotification && (
          <CopyNotification>주소가 복사되었습니다!</CopyNotification>
        )}
      </Container>
    </Layout>
  );
};
const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  color: #666;
`;

const CopyNotification = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  animation: fadeInOut 3s forwards;
  z-index: 1000;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    15% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    85% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
  }
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 70%;
`;

const AddressText = styled.div`
  font-size: 16px;
  color: #333;
  word-break: break-all;
  flex: 1;
`;

const ExpandButton = styled.button`
  color: #666;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: #f5f5f5;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background-color: #e5e5e5;
  }
`;

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
  width: 100%;
  height: 100%;
  border-radius: 50%;
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
