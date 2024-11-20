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

import { decodeData } from "../utils/cryption";
import { child } from "../api/child";

const DashBoard = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [information, setInformation] = useState({
    name: "",
    birthDate: "",
    imgUrl: "",
    parentAddress: "",
  });
  const [vaccinationInformation, setVaccinationInformation] = useState();
  const [medicalHistory, setMedicalHistory] = useState();

  const getChildInfoFromServer = async (childID) => {
    try {
      const response = await child.return(childID);
      if (response.data) {
        setInformation((prev) => ({
          ...prev,
          ...response.data,
        }));
      }
    } catch (error) {
      console.error("서버 데이터 조회 실패", error);
    }
  };

  const getInformation = useCallback(async () => {
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

    // 자녀 정보 가져오기
    const childInformation = await contract.returnChildInformation();
    if (childInformation && childInformation.length > 0) {
      const currentChild = childInformation.find(
        (child) => child.childAddress === params.childAddress
      );

      if (currentChild) {
        setInformation({
          name: currentChild.name,
          birthDate: new Date(
            Number(currentChild.birthDate) * 1000
          ).toLocaleDateString(), // Unix timestamp를 날짜로 변환
          imgUrl: currentChild.imgUrl || "", // imgUrl이 있다면 사용, 없다면 빈 문자열
          parentAddress: signer.address,
        });
      }
    }

    const vaccinationInformation = await contract.returnChildVaccinationStatus(
      params.childAddress
    );
    setVaccinationInformation(vaccinationInformation);

    const medicalHistory = await contract.returnMedicalHistoriesForChild(
      params.childAddress
    );
    setMedicalHistory(medicalHistory);
  }, [params.childAddress]);

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        await getInformation();

        if (params.id) {
          await getChildInfoFromServer(params.id);
        }
      } catch (error) {
        console.error("데이터 조회 실패:", error);
      }
    };

    if (params.childAddress) {
      fetchChildData();
    }
  }, [params.childAddress, params.id, getInformation]); // params.id가 변경될 때만 실행

  const routerItem = [
    {
      name: "예방접종\n확인하기",
      router: `/vaccination/${params.childAddress}`,
      img: Search,
    },
    {
      name: "진료\n기록하기",
      router: "/medicalhistory",
      img: Edit,
    },
    {
      name: "발달검사\n받으러가기",
      router: `/survey/${params.childAddress}`,
      img: Treatment,
    },
    {
      name: "건강 정보\n확인하기",
      router: "",
      img: QuestionMark,
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
    <Layout
      name={decodeData(information.name, information.parentAddress)}
      age={information.age}
      imgUrl={information.imgUrl} // profile -> imgUrl로 수정
      childAddress={params.childAddress}
    >
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
      {vaccinationInformation && (
        <VaccineContainer>
          <VaccineScrollContainer>
            {vaccinationInformation[1].slice(0, 5).map((vaccine, index) => {
              const vaccineStatus = calculateVaccineStatus(
                information.birthDate,
                Number(vaccine[4]),
                Number(vaccine[5])
              );
              return (
                <VaccineCard key={index}>
                  <VaccineDetail>
                    <DateRange>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        {vaccineStatus.minDate}~{vaccineStatus.maxDate}
                        <StatusMessage $status={vaccineStatus.status}>
                          {vaccineStatus.status === "upcoming" &&
                            "아직 멀었어요."}
                          {vaccineStatus.status === "due" && "접종 가능해요."}
                          {vaccineStatus.status === "overdue" &&
                            "접종 늦었어요."}
                        </StatusMessage>
                      </div>
                    </DateRange>
                    <div>
                      ({vaccine[1]}) {vaccine[2]} {Number(vaccine[3])}차
                      예방접종
                    </div>
                  </VaccineDetail>
                </VaccineCard>
              );
            })}
          </VaccineScrollContainer>
        </VaccineContainer>
      )}
      <Title
        style={{
          marginTop: "20px",
        }}
      >
        과거 진료 내역
      </Title>
      <MedicalHistory medicalHistory={medicalHistory} />
    </Layout>
  );
};

// 전체 그리드를 감싸는 컨테이너
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
`;

// 각 메뉴 아이템을 위한 스타일
const MenuItem = styled.div`
  background-color: #dbdee6cc;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

// 아이콘 컨테이너
const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

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
  line-height: 23px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
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
  padding: 25px;
  background: #9f8772e5;
`;

const VaccineScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory; // 스크롤 스냅 추가
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const VaccineCard = styled.div`
  min-width: 100%; // 전체 너비로 설정
  flex: 0 0 100%; // 카드가 늘어나거나 줄어들지 않도록 설정
  scroll-snap-align: start; // 스크롤 시 카드 시작 부분에 맞춤
  box-sizing: border-box; // 패딩이 너비에 포함되도록 설정

  &:first-child {
    margin-left: 16px;
  }

  &:last-child {
    margin-right: 16px;
  }
`;

const VaccineDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: Karla;
  font-size: 24px;
  font-weight: 600;
  line-height: 28.06px;
  letter-spacing: -0.02em;
  text-align: left;

  color: #ffffff;

  gap: 15px;
`;

const DateRange = styled.div`
  font-family: Gmarket Sans TTF;
  font-size: 20px;
  font-weight: 500;
  line-height: 17.25px;
  letter-spacing: -0.02em;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

  color: #ffffff;
`;

const StatusMessage = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ $status }) => {
    switch ($status) {
      case "overdue":
        return "#CC3D3D";
      case "due":
        return "#00FF00";
      default:
        return "#808080";
    }
  }};
`;

export default DashBoard;
