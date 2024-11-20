import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styled from "styled-components";

import FaPaw from "../assets/icons/foot.svg";
import Left from "../assets/image/leftBackground.svg";
import Right from "../assets/image/rightBackground.svg";
import { ethers } from "ethers";
import abi from "../abi/ParentChildRelationshipWithMeta.json";
import axios from "axios";

const RoundedBox = ({ onClick, label, vaccineInfo }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedData, setSelectedData] = useState("");
  const [selectedDose, setSelectedDose] = useState("1");

  const handleClick = () => {
    if (isExpanded) {
      // 이미 확장된 상태에서 클릭하면 닫히고 데이터 초기화
      setSelectedData("");
      setSelectedDose("1");
      onClick?.(vaccineInfo.vaccine, null); // 데이터 삭제
    }

    setIsExpanded(!isExpanded);
  };

  const handleDateChange = (e) => {
    setSelectedData(e.target.value);
    updateVaccinationData(selectedDose, e.target.value);
  };

  const handleDoseChange = (e) => {
    setSelectedDose(e.target.value);
    updateVaccinationData(e.target.value, selectedData);
  };

  const updateVaccinationData = (dose, date) => {
    if (date && dose) {
      onClick?.(vaccineInfo.vaccine, {
        vaccineName: vaccineInfo.vaccine,
        vaccineChapter: parseInt(dose),
        administerDate: Math.floor(new Date(date).getTime() / 1000),
      });
    }
  };

  const doseOptions = useMemo(() => {
    return Array.from({ length: vaccineInfo.maxChapter }, (_, i) => i + 1);
  }, [vaccineInfo.maxChapter]);

  return (
    <VaccineContainer>
      <StyledRoundedBox $isOpen={isExpanded} onClick={handleClick}>
        <IconContainer>
          {!isExpanded ? (
            ""
          ) : (
            <img src={FaPaw} alt="" color="#4f2304" size={24} />
          )}
        </IconContainer>
        <Label>{label}</Label>
      </StyledRoundedBox>
      <ExpandablePanel $isOpen={isExpanded}>
        <PanelContent $isOpen={isExpanded}>
          <div style={{ padding: "20px" }}>
            <InfoRow>
              <InfoLabel>예방접종 이름:</InfoLabel>
              <InfoValue>{label}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>백신 종류:</InfoLabel>
              <InfoValue>{vaccineInfo.vaccine}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>날짜:</InfoLabel>
              <DateInput
                type="date"
                value={selectedData}
                onChange={handleDateChange}
                min="2000-01-01"
                max="2024-12-31"
              />
            </InfoRow>
            <InfoRow>
              <InfoLabel>차수:</InfoLabel>
              <DoseSelect value={selectedDose} onChange={handleDoseChange}>
                {doseOptions.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    {chapter}차수
                  </option>
                ))}
              </DoseSelect>
            </InfoRow>
          </div>
        </PanelContent>
      </ExpandablePanel>
    </VaccineContainer>
  );
};

// 스타일 컴포넌트 수정
const StyledRoundedBox = styled.div`
  display: flex;
  align-items: center;
  width: 275px;
  height: 60px;
  background-color: #fff7e4;
  border-radius: ${(props) => (props.$isOpen ? "30px 30px 0 0" : "30px")};
  border: 1px solid #f4c784;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
`;

const ExpandablePanel = styled.div`
  width: 275px;
  background-color: #fff7e4;
  margin-top: 2px;
  border-radius: 0 0 15px 15px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: ${(props) => (props.$isOpen ? "200px" : "0")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
`;

const PanelContent = styled.div`
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(${(props) => (props.$isOpen ? "0" : "-20px")});
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
`;

// 새로운 스타일 컴포넌트들
const VaccineContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DateInput = styled.input`
  padding: 4px 8px;
  border: 1px solid #f4c784;
  border-radius: 4px;
  background-color: white;
  color: #4f2304;
  font-family: inherit;
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #fff;
  margin-right: 10px;
`;

const Label = styled.label`
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #4f2304;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const InfoLabel = styled.span`
  width: 100px;
  color: #4f2304;
  font-size: 14px;
`;

const InfoValue = styled.span`
  color: #4f2304;
  font-size: 14px;
`;

const DoseSelect = styled.select`
  padding: 4px 8px;
  border: 1px solid #f4c784;
  border-radius: 4px;
  background-color: white;
  color: #4f2304;
`;

const SynchronizationVaccination = () => {
  // 자녀 주소 가져오기
  const params = useParams();
  const navigate = useNavigate();

  // 백신 정보 업데이트 진행
  const [vaccinations, setVaccinations] = useState([]);

  const childAddress = params.childAddress;

  const cleanVaccineName = (name) => {
    return name.replace(/\s*-\s*\([12]\)$/, "");
  };

  const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 이거 이렇게 하는게 아니라 맞지 않은 백신에 대한 정보를 가져와야 합니다.
  const vaccineList = [
    { disName: "결핵", vaccine: "BCG", maxChapter: 1 },
    { disName: "B형간염", vaccine: "HepB", maxChapter: 3 },
    { disName: "디프테리아", vaccine: "DTap", maxChapter: 5 },
    { disName: "파상풍", vaccine: "DTap", maxChapter: 5 },
    { disName: "백일해", vaccine: "DTap", maxChapter: 5 },
    { disName: "폴리오", vaccine: "IPV", maxChapter: 4 },
    { disName: "B형헤모필루스인플루엔자", vaccine: "Hib", maxChapter: 4 },
    { disName: "폐렴구균", vaccine: "PCV", maxChapter: 4 },
    { disName: "로타바이러스 감염증-(1)", vaccine: "RV1", maxChapter: 2 },
    { disName: "로타바이러스 감염증-(2)", vaccine: "RV5", maxChapter: 3 },
    { disName: "홍역", vaccine: "MMR", maxChapter: 2 },
    { disName: "유행성이하선염", vaccine: "MMR", maxChapter: 2 },
    { disName: "풍진", vaccine: "MMR", maxChapter: 2 },
    { disName: "수두", vaccine: "VAR", maxChapter: 1 },
    { disName: "A형간염", vaccine: "HepA", maxChapter: 2 },
    { disName: "일본뇌염-(1)", vaccine: "IJEV", maxChapter: 5 },
    { disName: "일본뇌염-(2)", vaccine: "LJEV", maxChapter: 2 },
    { disName: "사람유두종바이러스", vaccine: "HPV", maxChapter: 2 },
  ];

  const handleVaccineChange = (vaccineName, vaccinationData) => {
    setVaccinations((prev) => {
      const cleanedVaccineName = cleanVaccineName(vaccineName);
      const filtered = prev.filter(
        (v) => cleanVaccineName(v.vaccineName) !== cleanedVaccineName
      );
      return vaccinationData ? [...filtered, vaccinationData] : filtered;
    });
  };

  const synchronizationVaccinations = async () => {
    try {
      if (!window.ethereum) {
        throw Error("Metamask not install");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        process.env.REACT_APP_PARENT_CHILD_RELATIONSHIP_ADDRESS,
        abi.abi,
        provider
      );

      const domain = {
        name: "ParentChildRelationshipWithMeta",
        version: "1",
        chainId: await signer.provider
          .getNetwork()
          .then((network) => network.chainId),
        verifyingContract: contract.target,
      };
      const nonce = await contract.getNonce(signer.address);

      const types = {
        UpdateMultipleVaccination: [
          { name: "parent", type: "address" },
          { name: "childAddress", type: "address" },
          { name: "vaccinations", type: "VaccinationInput[]" },
          { name: "nonce", type: "uint256" },
        ],
        VaccinationInput: [
          { name: "vaccineName", type: "string" },
          { name: "vaccineChapter", type: "uint8" },
          { name: "administerDate", type: "uint256" },
        ],
      };

      const messages = {
        parent: signer.address,
        childAddress: childAddress,
        vaccinations: vaccinations,
        nonce,
      };

      const signature = await signer.signTypedData(domain, types, messages);

      const response = await api.post("/contract//vaccination/updateMulti", {
        parent: signer.address,
        childAddress: childAddress,
        vaccinations: vaccinations,
        signature,
      });

      if (response.data.success) {
        console.log("tx hash: ", response.data.data.transactionHash);
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <Container>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute", // absolute -> relative로 수정
          top: 0,
          height: "100px", // 원하는 높이 설정
        }}
      >
        <img
          style={{
            height: "100%", // 높이를 div의 높이에 맞춤
            objectFit: "cover", // 이미지가 부모 요소에 맞게 잘림 없이 맞춰짐
          }}
          src={Left}
          alt=""
        />
        <img
          style={{
            height: "100%", // 높이를 div의 높이에 맞춤
            objectFit: "cover",
          }}
          src={Right}
          alt=""
        />
      </div>
      <FormTitle>백신 동기화</FormTitle>{" "}
      <VaccineList>
        {vaccineList.map((value) => (
          <RoundedBox
            key={value.disName}
            onClick={handleVaccineChange}
            label={value.disName}
            vaccineInfo={value}
          />
        ))}
      </VaccineList>
      <NextButton
        onClick={async () => {
          await synchronizationVaccinations();
          navigate(`/dashboard/${params.childAddress}`);
        }}
      >
        해당사항 체크완료
      </NextButton>
    </Container>
  );
};

const Container = styled.div`
  background-color: #f9d49b;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  justify-content: center;
  align-items: center;
`;

const FormTitle = styled.h2`
  font-family: KOTRAHOPE;
  font-size: 36px;
  font-weight: 400;
  line-height: 41.94px;
  text-align: left;
`;

const VaccineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

  &::before {
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    border-top: 2px dashed #ffffff; /* 점선 스타일 */
  }

  /* 아래쪽 점선 */
  &::after {
    content: "";
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    border-top: 2px dashed #ffffff; /* 점선 스타일 */
  }
`;

const NextButton = styled.button`
  width: 275px;
  height: 60px;
  border-radius: 30px;
  background-color: #fff7e4;
  border: none;
  color: #4f2304;
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
`;

export default SynchronizationVaccination;
