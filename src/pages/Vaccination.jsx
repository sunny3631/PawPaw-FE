import React from "react";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import { useState, useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { ethers } from "ethers";
import ParentChildRelationshipABI from "../abi/ParentChildRelationshipWithMeta.json";

const Vaccination = () => {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("completed");
  const [completed, setCompleted] = useState([]);
  const [pending, setPending] = useState([]);

  const formatAgeDisplay = (months) => {
    if (months < 24) {
      return `${months}개월`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;

      if (remainingMonths === 0) {
        return `만 ${years}세`;
      } else {
        return `만 ${years}세 ${remainingMonths}개월`;
      }
    }
  };

  const groupVaccinationsByMonth = useCallback((vaccinations) => {
    const grouped = {};

    vaccinations.forEach((vaccination) => {
      const targetDay = Number(vaccination[4]);
      let category;

      if (targetDay === 0) {
        category = "출생 ~ 1개월 이내";
      } else {
        const monthNum = Math.floor(targetDay / 30);
        category = formatAgeDisplay(monthNum);
      }

      if (!grouped[category]) {
        grouped[category] = [];
      }

      // 접종 기간 계산
      const startDay = Number(vaccination[4]); // targetDay
      const endDay = Number(vaccination[5]); // recommendedDay
      let vaccinationPeriod = "";

      if (startDay === 0 && endDay === 0) {
        vaccinationPeriod = "출생 직후";
      } else if (endDay === 0) {
        vaccinationPeriod = `출생 후 ${startDay}일`;
      } else {
        vaccinationPeriod = `출생 후 ${startDay}일 ~ ${endDay}일`;
      }

      const formatFunc = (date) => {
        return date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };

      const timestamp = Number(vaccination[7]); // timestamp를 숫자로 변환

      grouped[category].push({
        id: vaccination[0],
        vaccineName: vaccination[1],
        diseaseName: vaccination[2],
        sequence: vaccination[3],
        targetDay: vaccination[4],
        recommendedDay: vaccination[5],
        vaccinationDate:
          timestamp === 0 ? null : formatFunc(new Date(timestamp * 1000)),
        vaccinationPeriod: vaccinationPeriod,
      });
    });

    // ... 나머지 정렬 로직 ...
    return Object.entries(grouped)
      .sort((a, b) => {
        // 기존 정렬 로직 유지
        if (a[0] === "출생 ~ 1개월 이내") return -1;
        if (b[0] === "출생 ~ 1개월 이내") return 1;

        const getMonths = (str) => {
          if (str.includes("세")) {
            const years = parseInt(str.match(/(\d+)세/)[1]);
            const monthsMatch = str.match(/(\d+)개월/);
            const months = monthsMatch ? parseInt(monthsMatch[1]) : 0;
            return years * 12 + months;
          }
          return parseInt(str);
        };

        const monthsA = getMonths(a[0]);
        const monthsB = getMonths(b[0]);
        return monthsA - monthsB;
      })
      .map(([category, items]) => ({
        category,
        items: items.map((item) => ({
          id: item.id,
          vaccineName: item.vaccineName,
          name: `${item.diseaseName} ${item.sequence}차`,
          targetDay: item.targetDay,
          recommendedDay: item.recommendedDay,
          vaccinationPeriod: item.vaccinationPeriod,
          vaccinationDate: item.vaccinationDate,
        })),
      }));
  }, []);

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

    const vaccinationInformation = await contract.returnChildVaccinationStatus(
      params.childAddress
    );

    const completedVaccinations = groupVaccinationsByMonth(
      vaccinationInformation[0]
    );
    setCompleted(completedVaccinations);

    const pendingVaccinations = groupVaccinationsByMonth(
      vaccinationInformation[1]
    );
    setPending(pendingVaccinations);
  }, [params.childAddress, groupVaccinationsByMonth]);

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        await getInformation();
      } catch (error) {
        console.error("데이터 조회 실패:", error);
      }
    };

    if (params.childAddress) {
      fetchChildData();
    }
  }, [params.childAddress, getInformation]); // params.id가 변경될 때만 실행

  const dataToRender = activeTab === "completed" ? completed : pending;

  return (
    <Layout childAddress={params.childAddress} childID={params.id}>
      <TabContainer>
        <ActiveTabSlider $activeTab={activeTab} />
        <TabButton
          $active={activeTab === "completed"}
          onClick={() => setActiveTab("completed")}
        >
          접종 완료
        </TabButton>
        <TabButton
          $active={activeTab === "pending"}
          onClick={() => setActiveTab("pending")}
        >
          접종 예정
        </TabButton>
      </TabContainer>

      <Container>
        <Grid>
          {dataToRender.map((group) => (
            <CategoryCard key={group.category}>
              <CategoryHeader>
                <h3>{group.category}</h3>
                <VaccineCount>
                  {group.items.length}개의{" "}
                  {activeTab === "completed" ? "완료된" : "예정된"} 접종
                </VaccineCount>
              </CategoryHeader>
              <VaccineList>
                {group.items.map((item) => (
                  <VaccineItem
                    key={item.id}
                    $isCompleted={activeTab === "completed"}
                  >
                    <Link
                      to={`/vaccination/detail/${params.childAddress}/${params.id}/${item.id}`}
                      state={{
                        vaccineInfo: {
                          name: item.name,
                          status: activeTab === "completed" ? "접종" : "미접종",
                          doses: item.name.split(" ")[1],
                          type: item.vaccineName,
                          date: item.vaccinationDate,
                          next: item.vaccinationPeriod, // 수정된 부분
                          childAddress: params.childAddress,
                        },
                      }}
                    >
                      <VaccineName>{item.name}</VaccineName>
                    </Link>
                  </VaccineItem>
                ))}
              </VaccineList>
            </CategoryCard>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

const TabContainer = styled.div`
  display: flex;
  position: relative;
  border-radius: 41px;
  width: 90%;
  max-width: 600px;
  height: 46px;
  margin: 30px auto 0;
  padding: 4px;
  background: #f5f5f5;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden; // 슬라이더가 컨테이너를 벗어나지 않도록
`;

const ActiveTabSlider = styled.div`
  position: absolute;
  left: 4px; // padding과 동일
  top: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: #ffcc80;
  border-radius: 37px;
  transition: transform 0.3s ease-in-out;
  transform: translateX(
    ${(props) => (props.$activeTab === "completed" ? "0" : "100%")}
  );
  pointer-events: none; // 클릭이 탭 버튼에 전달되도록
`;

const TabButton = styled.button`
  flex: 1;
  border: none;
  outline: none;
  cursor: pointer;
  color: ${(props) => (props.$active ? "#4A4343" : "#8A8A8A")};
  font-family: Karla;
  font-size: 16px;
  font-weight: 700;
  background: transparent;
  transition: color 0.3s ease-in-out;
  position: relative;
  z-index: 1;

  &:hover {
    color: #4a4343;
  }
`;

const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 30px auto;
  overflow: hidden;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 16px;
`;

const CategoryCard = styled.div`
  background: #fffcf5;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 204, 128, 0.3);
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ffe4bd;

  h3 {
    color: #4a4343;
    font-family: Karla;
    font-size: 20px;
    font-weight: 700;
    margin: 0;
  }
`;

const VaccineCount = styled.span`
  background: #ffe4bd;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #4a4343;
  font-weight: 500;
`;

const VaccineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VaccineItem = styled.div`
  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    padding: 16px;
    background: white;
    border-radius: 12px;
    border: 1px solid rgba(74, 67, 67, 0.1);
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border-color: #ffcc80;
    }
  }
`;

const VaccineName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #4a4343;
`;

export default Vaccination;
