import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/common/Layout";
import MedicalHistory from "../components/medicalHistory/MedicalHistroy";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import ParentChildRelationshipABI from "../abi/ParentChildRelationshipWithMeta.json";

import Search from "../assets/icons/Search.svg";
import Edit from "../assets/icons/Edit.svg";
import Treatment from "../assets/icons/Treatment.svg";
import QuestionMark from "../assets/icons/Question Mark.svg";

import styled from "styled-components";

const DashBoard = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [parentAddress, setParentAddress] = useState();
  const [childInformation, setChildInformation] = useState();
  const [vaccinationInformation, setVaccinationInformation] = useState();
  const [medicalHistory, setMedicalHistory] = useState();

  const [isLoading, setIsLoading] = useState({
    child: false,
    vaccination: false,
    medical: false,
  });

  const getInformation = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error("METAMask not install");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    // MetaMask 계정 연결 요청
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    setParentAddress(signer.address);

    const contract = new ethers.Contract(
      process.env.REACT_APP_PARENT_CHILD_RELATIONSHIP_ADDRESS,
      ParentChildRelationshipABI.abi,
      signer
    );

    const [childInfo, vaccineInfo, medicalInfo] = await Promise.all([
      contract.returnChildInformation(),
      contract.returnChildVaccinationStatus(params.childAddress),
      contract.returnMedicalHistoriesForChild(params.childAddress),
    ]);

    if (childInfo && childInfo.length > 0) {
      const currentChild = childInfo.find(
        (child) => child.childAddress === params.childAddress
      );

      if (currentChild) {
        setChildInformation({
          birthDate: new Date(
            Number(currentChild.birthDate) * 1000
          ).toLocaleDateString(),
        });
      }
    }

    setVaccinationInformation(vaccineInfo);
    setMedicalHistory(medicalInfo);

    // 마지막에 한 번만 로딩 상태 업데이트
    setIsLoading({
      child: true,
      vaccination: true,
      medical: true,
    });
  }, [params.childAddress]);

  useEffect(() => {
    const fetchChildData = async () => {
      setIsLoading({
        // 데이터 로딩 시작 시 상태 업데이트
        child: false,
        vaccination: false,
        medical: false,
      });

      try {
        await getInformation();
      } catch (error) {
        console.error("데이터 조회 실패:", error);
        setIsLoading({
          // 에러 발생 시 로딩 완료 처리
          child: true,
          vaccination: true,
          medical: true,
        });
      }
    };

    if (params.childAddress) {
      fetchChildData();
    }
  }, [params.childAddress, params.id, getInformation]); // params.id가 변경될 때만 실행

  const routerItem = [
    {
      name: "예방접종\n확인하기",
      router: `/vaccination/${params.childAddress}/${params.id}`,
      img: Search,
    },
    {
      name: "진료\n기록하기",
      router: `/medicalhistory/${params.childAddress}/${params.id}`,
      img: Edit,
    },
    {
      name: "발달검사\n받으러가기",
      router: `/survey/${params.childAddress}/${params.id}`,
      img: Treatment,
    },
  ];

  const calculateVaccineStatus = (birthDate, minDay, maxDay) => {
    const birthDateTime = new Date(birthDate).getTime();
    const today = new Date().getTime();
    const daysSinceBirth = Math.floor(
      (today - birthDateTime) / (1000 * 60 * 60 * 24)
    );

    // 접종 가능 시작일과 종료일 계산
    const minDate = new Date(birthDateTime + minDay * 24 * 60 * 60 * 1000);
    const maxDate = new Date(birthDateTime + maxDay * 24 * 60 * 60 * 1000);

    return {
      minDate: minDate.toLocaleDateString(),
      maxDate: maxDate.toLocaleDateString(),
      status:
        daysSinceBirth < minDay
          ? "upcoming" // 아직 접종 시기가 되지 않음
          : daysSinceBirth > maxDay
          ? "overdue" // 접종 시기를 놓침
          : "due", // 현재 접종 가능 시기
    };
  };

  return (
    <Layout childID={params.id} childAddress={params.childAddress}>
      <GridContainer>
        {routerItem.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              navigate(`${item.router}`);
            }}
          >
            <MenuText>{item.name}</MenuText>
            <IconContainer>
              <img src={item.img} alt={item.name} />
            </IconContainer>
          </MenuItem>
        ))}
      </GridContainer>
      <Title>예방 접종 예정일</Title>
      {!isLoading.vaccination ? (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>예방접종 정보를 불러오는 중...</LoadingText>
        </LoadingContainer>
      ) : vaccinationInformation ? (
        <VaccineContainer>
          <VaccineScrollContainer>
            {vaccinationInformation[1].slice(0, 5).map((vaccine, index) => {
              const vaccineStatus = calculateVaccineStatus(
                childInformation?.birthDate,
                Number(vaccine[4]),
                Number(vaccine[5])
              );
              return (
                <VaccineCard key={index}>
                  <VaccineDetail>
                    <DateRange>
                      <div>
                        {vaccineStatus.minDate} ~ {vaccineStatus.maxDate}
                        <StatusMessage $status={vaccineStatus.status}>
                          {vaccineStatus.status === "upcoming" &&
                            "아직 멀었어요"}
                          {vaccineStatus.status === "due" && "접종 가능해요"}
                          {vaccineStatus.status === "overdue" &&
                            "접종 늦었어요"}
                        </StatusMessage>
                      </div>
                    </DateRange>
                    <VaccineInfo>
                      ({vaccine[1]}) {vaccine[2]} {Number(vaccine[3])}차
                      예방접종
                    </VaccineInfo>
                  </VaccineDetail>
                </VaccineCard>
              );
            })}
          </VaccineScrollContainer>
        </VaccineContainer>
      ) : (
        <NoDataContainer>예방접종 정보가 없습니다.</NoDataContainer>
      )}

      <Title>과거 진료 내역</Title>
      {!isLoading.medical ? (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>진료 기록을 불러오는 중...</LoadingText>
        </LoadingContainer>
      ) : (
        <MedicalHistory
          medicalHistory={medicalHistory}
          address={parentAddress}
        />
      )}
    </Layout>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  margin: 20px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #9f8772;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-family: "Gmarket Sans TTF";
  font-size: 16px;
  color: #666;
`;

const NoDataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f5f5f5;
  border-radius: 12px;
  margin: 20px;
  font-family: "Gmarket Sans TTF";
  font-size: 16px;
  color: #666;
`;

// 전체 그리드를 감싸는 컨테이너
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 10px;

  /* 세 번째 아이템을 위한 스타일 */
  & > div:nth-child(3) {
    grid-column: 1 / span 2; // 두 열을 모두 차지
    width: 100%; // 너비를 50%로
    margin: 0 auto; // 중앙 정렬
    justify-self: center; // 그리드 셀 내에서 중앙 정렬
  }
`;

// 각 메뉴 아이템을 위한 스타일
const MenuItem = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(210, 165, 125, 0.25);
    background: linear-gradient(135deg, #ffe7cc 0%, #ffd8a9 100%);
  }

  &:active {
    transform: scale(0.98);
  }
`;

// 아이콘 컨테이너
const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

// 텍스트 스타일
const MenuText = styled.span`
  font-weight: 500;
  font-size: 20x;
  white-space: pre-line;
  line-height: 1.4;
  color: #6a5555;
  font-family: Gmarket Sans TTF;
`;

const Title = styled.div`
  font-family: Karla;
  font-size: 20px;
  font-weight: 700;
  line-height: 15.2px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

  padding: 25px;
`;

const VaccineContainer = styled.div`
  width: 100%;
  background: transparent;
`;

const VaccineScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 0px 5px;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &::after,
  &::before {
    content: "";
    min-width: 10px;
  }
`;

const VaccineCard = styled.div`
  min-width: calc(100% - 40px);
  scroll-snap-align: center;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(159, 135, 114, 0.15);
  padding: 20px;
  transform-origin: center center;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid rgba(159, 135, 114, 0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(159, 135, 114, 0.2);
  }

  &:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const VaccineDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
`;

const DateRange = styled.div`
  font-family: "Gmarket Sans TTF";
  font-size: 16px;
  font-weight: 500;
  color: #4f2304;
  background: rgba(255, 255, 255, 0.7);
  padding: 12px 15px;
  border-radius: 12px;

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }
`;

const VaccineInfo = styled.div`
  font-family: Karla;
  font-size: 18px;
  font-weight: 600;
  color: #4f2304;
  padding: 10px 0;
  border-top: 1px solid rgba(79, 35, 4, 0.1);
`;

const StatusMessage = styled.div`
  font-size: 14px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  display: inline-block;
  background: ${({ $status }) => {
    switch ($status) {
      case "overdue":
        return "rgba(204, 61, 61, 0.1)";
      case "due":
        return "rgba(79, 35, 4, 0.1)";
      default:
        return "rgba(128, 128, 128, 0.1)";
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "overdue":
        return "#CC3D3D";
      case "due":
        return "#4F2304";
      default:
        return "#666666";
    }
  }};
  border: 1px solid
    ${({ $status }) => {
      switch ($status) {
        case "overdue":
          return "rgba(204, 61, 61, 0.2)";
        case "due":
          return "rgba(79, 35, 4, 0.2)";
        default:
          return "rgba(128, 128, 128, 0.2)";
      }
    }};
`;

export default DashBoard;
