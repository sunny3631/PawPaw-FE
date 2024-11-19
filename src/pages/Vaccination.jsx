import React from "react";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import { useState, useCallback, useEffect } from "react";
import Check from "../assets/check.svg";
import Complete from "../assets/completebutton.svg";
import Uncomplete from "../assets/uncomplete.svg";
import { Link, useParams } from "react-router-dom";

import { ethers } from "ethers";
import ParentChildRelationshipABI from "../abi/ParentChildRelationshipWithMeta.json";

const Vaccination = ({ name, age, imgUrl }) => {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("completed");
  const [completed, setCompleted] = useState([]);
  const [pending, setPending] = useState([]);

  const groupVaccinationsByMonth = (vaccinations) => {
    const grouped = {};

    vaccinations.forEach((vaccination) => {
      const targetDay = Number(vaccination[4]);
      let category;

      if (targetDay === 0) {
        category = "출생 ~ 1개월 이내";
      } else {
        const monthNum = Math.floor(targetDay / 30);
        category = `${monthNum}개월`;
      }

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push({
        id: vaccination[0],
        vaccineName: vaccination[1],
        diseaseName: vaccination[2],
        sequence: vaccination[3],
        targetDay: vaccination[4],
        recommendedDay: vaccination[5],
      });
    });

    return Object.entries(grouped).map(([category, items]) => ({
      category,
      items: items.map((item) => ({
        id: item.id,
        vaccineName: item.vaccineName,
        name: `${item.diseaseName} ${item.sequence}차`,
        targetDay: item.targetDay,
        recommendedDay: item.recommendedDay,
      })),
    }));
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
  }, [params.childAddress]);

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
    <Layout
      name={name}
      age={age}
      imgUrl={imgUrl}
      childAddress={params.childAddress}
    >
      {/* 탭 버튼 */}
      <TabContainer>
        <TabButton
          active={activeTab === "completed"}
          onClick={() => setActiveTab("completed")}
        >
          접종 완료
        </TabButton>
        <TabButton
          active={activeTab === "pending"}
          onClick={() => setActiveTab("pending")}
        >
          접종 예정
        </TabButton>
      </TabContainer>

      {/* 리스트 렌더링 */}
      <Container>
        {dataToRender.map((group) => (
          <Category key={group.category}>
            <h3>{group.category}</h3>
            {group.items.map((item) => (
              <VaccineItem key={item.id}>
                <Link
                  to={`/vaccination/detail/${item.id}`}
                  state={{
                    vaccineInfo: {
                      name: item.name,
                      status: activeTab === "completed" ? "접종" : "미접종",
                      doses: item.name.split(" ")[1], // groupVaccinationsByMonth에서 추가 필요
                      type: item.vaccineName, // 백신 종류 (예: B형 간염, BCG 등)
                      date:
                        activeTab === "completed" ? item.vaccinationDate : null, // 접종 날짜 추가 필요
                      next: item.recommendedDay
                        ? `${Math.floor(Number(item.recommendedDay) / 30)}개월`
                        : "없음",
                      childAddress: params.childAddress,
                    },
                  }}
                >
                  <div className="info">
                    <div className="check">
                      <img src={Check} alt="checked" />
                    </div>
                    <div className="name">{item.name}</div>
                  </div>
                  <CompleteButton activeTab={activeTab}>
                    {activeTab === "completed" ? (
                      <img src={Complete} alt="complete" />
                    ) : (
                      <img src={Uncomplete} alt="uncomplete" />
                    )}
                  </CompleteButton>
                </Link>
              </VaccineItem>
            ))}
          </Category>
        ))}
      </Container>
    </Layout>
  );
};

const TabContainer = styled.div`
  display: flex;
  border-radius: 41px;
  width: 90%;
  height: 37px;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
  //overflow: hidden;
  // max-width: 600px; /* 버튼 그룹의 최대 너비 */
  margin: 30px auto 0; /* 부모 안에서 가로 중앙 정렬 */
`;

const TabButton = styled.button`
  //height : 100%;
  /* /width : 90%; */
  flex: 1;
  padding: 10px;
  border: 0.5px solid #4a4343;
  outline: none;
  cursor: pointer;
  color: #4a4343;
  font-family: Karla;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  background-color: ${(props) => (props.active ? "#FFCC80" : "white")};

  //transition: background-color 0.3s ease;

  &:first-child {
    border-top-left-radius: 41px;
    border-bottom-left-radius: 41px;
  }

  &:last-child {
    border-top-right-radius: 41px;
    border-bottom-right-radius: 41px;
  }
`;
const Container = styled.div`
  //background-color: #fde4c6; /* 배경색 */
  //padding: 20px;
  width: 90%;
  //max-width: 500px;
  margin: 30px auto; /* 중앙 정렬 */
`;

const Category = styled.div`
  margin-bottom: 20px;

  & > h3 {
    color: #4a4343;
    font-family: Karla;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    //margin-bottom: 30px;
    border-bottom: 1px solid #4a4343;
    display: inline-block;
    //padding-left: 10px;
  }
`;

const VaccineItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #adadad;
  color: #4a4343;
  font-family: Karla;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  position: relative;
  margin-left: 10px;

  /* &:last-child {
    border-bottom: none;
  } */

  .info {
    display: flex;
    align-items: center;
    position: relative;
  }

  .check img {
    margin-right: 10px;
    color: #4a4343;
    font-size: 16px;
    width: 21px;
    height: 21px;
  }

  .name {
    font-size: 16px;
    font-weight: bold;
    color: #4a4343;
  }
  a {
    display: flex;
    justify-content: space-between;
    text-decoration: none;
    align-items: center;
    width: 100%;
    //color: inherit;
  }
`;

const CompleteButton = styled.div`
  width: 66px;
  height: 32px;
  flex-shrink: 0;
`;
export default Vaccination;
