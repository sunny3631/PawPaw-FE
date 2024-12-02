import React, { useCallback, useState, useMemo, useEffect } from "react";
import Layout from "../components/common/Layout";
import styled from "styled-components";
import Check from "../assets/check.svg";
import { Link, useParams } from "react-router-dom";
import AddModal from "../components/AddModal";
import Arrow from "../assets/icons/Arrow.svg";
import { ethers } from "ethers";

import abi from "../abi/ParentChildRelationshipWithMeta.json";
import { encodeData, decodeData } from "../utils/cryption.js";
import { metaTxAPI } from "../api/instance/metaTransactionInstance.js";

// 스타일 컴포넌트
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    color: #4a4343;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
  }
`;

const ContentSection = styled.div`
  background: #fffcf5;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: #fffcf5;
  border-radius: 16px;
  color: #4a4343;
  font-size: 16px;
  font-weight: 500;
`;

const EmptyContainer = styled(LoadingContainer)`
  flex-direction: column;
  gap: 16px;
`;

const Record = styled.div`
  margin-bottom: 24px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const Date = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #4a4343;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #ffcc80;
  display: inline-block;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(74, 67, 67, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #ffcc80;
  }

  .symptoms {
    display: flex;
    align-items: center;
    gap: 12px;

    .check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: rgba(255, 204, 128, 0.2);
      border-radius: 50%;

      img {
        width: 16px;
        height: 16px;
      }
    }

    .content {
      font-size: 16px;
      font-weight: 600;
      color: #4a4343;
    }
  }
`;

const Treatment = styled.div`
  border-radius: 24px;
  background: #ffcc80;
  padding: 8px 16px;
  color: #4a4343;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
`;

const AddButton = styled.div`
  position: fixed;
  bottom: 80px; // 하단 네비게이션바 위에 위치하도록 조정
  left: 50%; // 중앙 정렬을 위한 설정
  transform: translateX(-50%); // 정확한 중앙 정렬
  z-index: 100;

  button {
    width: 56px;
    height: 56px;
    background: #ffcc80;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &::before,
    &::after {
      content: "";
      position: absolute;
      background: #4a4343;
      border-radius: 2px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &::before {
      width: 20px;
      height: 3px;
    }

    &::after {
      width: 3px;
      height: 20px;
    }

    &:hover {
      transform: translateY(-4px) rotate(90deg);
      background: #ffb74d;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(-2px) rotate(90deg);
    }
  }
`;

const ModalHeader = styled.h2`
  color: #4a4343;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 24px 0;
`;

const TabContainer = styled.div`
  display: flex;
  border-radius: 41px;
  margin: 0 auto;
  width: 90%;
  height: 46px;
  background: #f5f5f5;
  padding: 4px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const TabButton = styled.button`
  flex: 1;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.$active ? "#4A4343" : "#8A8A8A")};
  background-color: ${(props) => (props.$active ? "#FFCC80" : "transparent")};
  border-radius: 41px;
  transition: all 0.3s ease;

  &:hover {
    color: #4a4343;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #4a4343;
  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(74, 67, 67, 0.2);
  background: white;
  font-size: 14px;
  color: #4a4343;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ffcc80;
    box-shadow: 0 0 0 2px rgba(255, 204, 128, 0.2);
  }

  &::placeholder {
    color: #999;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(74, 67, 67, 0.2);
  background: white;
  font-size: 14px;
  color: #4a4343;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ffcc80;
    box-shadow: 0 0 0 2px rgba(255, 204, 128, 0.2);
  }

  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button`
  background: #ffcc80;
  border: none;
  border-radius: 8px;
  padding: 14px;
  color: #4a4343;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    background: #ffb74d;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid rgba(74, 67, 67, 0.2);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #4a4343;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ffcc80;
    background: #fffcf5;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 120px;
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #4a4343;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #fffcf5;
  }
`;

const SortDropdown = styled.div`
  position: relative;
`;

const ArrowIcon = styled.img`
  margin-left: 5px;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.3s ease;
`;

const MedicalHistory = () => {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("hospital"); // 현재 선택된 탭 상태
  const [sortOrder, setSortOrder] = useState("최신순");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // const [formData, setFormData] = useState({
  //   hospitalName: "",
  //   date: "",
  //   doctor: "",
  //   symptoms: "",
  //   diagnosis: "",
  //   prescription: "",
  //   feedback: "",
  //   pharmacyName: "",
  //   prescriptionDate: "",
  //   dosage: "",
  // });

  const initialFormData = useMemo(
    () => ({
      hospitalName: "", // 병원명/약국명
      date: "", // 진료일자/처방일자
      doctor: "", // 의사명/약사명
      symptoms: "", // 증상
      diagnosis: "", // 진단내용/처방내용
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormData);
  const [historyData, setHistoryData] = useState([]);

  const getInformation = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error("METAMask not install");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      // MetaMask 계정 연결 요청
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        process.env.REACT_APP_PARENT_CHILD_RELATIONSHIP_ADDRESS,
        abi.abi,
        signer
      );

      const medicalHistory = await contract.returnMedicalHistoriesForChild(
        params.childAddress
      );

      const decodedHistory = medicalHistory.map((record, index) => {
        const decodedData = {
          id: index,
          visitedName: decodeData(record.visitedName, signer.address),
          date: record.timestamp,
          doctorName: decodeData(record.doctorName, signer.address),
          symptoms: decodeData(record.symptoms, signer.address),
          diagnosis: decodeData(record.diagnosisDetails, signer.address),
          medicalType: Number(record.medicaltype),
        };

        return decodedData;
      });

      setHistoryData(decodedHistory || []);
    } catch (error) {
      console.error(error);
      setHistoryData([]);
    }
  }, [params.childAddress]);

  useEffect(() => {
    const fetchChildMedicalData = async () => {
      setIsLoading(true);
      try {
        await getInformation();
      } catch (error) {
        console.error("데이터 조회 실패 :", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.childAddress) {
      fetchChildMedicalData();
    }
  }, [params.childAddress, getInformation]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  // 정렬 기준 변경
  const handleSortChange = (order) => {
    setSortOrder(order);
    setIsDropdownOpen(false);
  };

  // Helper: 날짜 문자열을 ISO 8601 형식으로 변환
  const parseDate = useCallback((dateString) => {
    const [year, month, day] = dateString
      .replace(/년|월|일/g, "") // "년", "월", "일" 제거
      .split(" ")
      .map((item) => parseInt(item.trim(), 10)); // 숫자로 변환 후 공백 제거
    return new window.Date(year, month - 1, day); // Date 객체 생성
  }, []);

  const sortedData = React.useMemo(() => {
    if (!historyData || historyData.length === 0) return [];

    return [...historyData].sort((a, b) =>
      sortOrder === "최신순"
        ? parseDate(b.date) - parseDate(a.date)
        : parseDate(a.date) - parseDate(b.date)
    );
  }, [historyData, sortOrder, parseDate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = useCallback((data, type) => {
    const requiredFields =
      type === "hospital"
        ? ["hospitalName", "date", "doctor", "symptoms", "diagnosis"]
        : [
            "pharmacyName",
            "prescriptionDate",
            "dosage",
            "symptoms",
            "diagnosis",
          ];

    return requiredFields.every((field) => data[field]?.trim());
  }, []);

  const handleSave = useCallback(async () => {
    console.log("Form Data:", formData); // formData 출력
    try {
      if (!validateForm(formData, activeTab)) {
        alert("모든 항목을 입력해야 합니다.");
        return;
      }

      if (!window.ethereum) {
        throw Error("MetaMask not install");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      // 데이터 암호화
      const encrpytedName = encodeData(
        activeTab === "hospital"
          ? formData.hospitalName
          : formData.pharmacyName,
        signer.address
      );
      const encrpytedDoctorName = encodeData(formData.doctor, signer.address);
      const encrpytedSymptoms = encodeData(formData.symptoms, signer.address);
      const encrpytedDiagnosis = encodeData(formData.diagnosis, signer.address);

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
        AddMedicalHistory: [
          { name: "parent", type: "address" },
          { name: "childAddress", type: "address" },
          { name: "medicalType", type: "uint8" },
          { name: "visitedName", type: "string" },
          { name: "timestamp", type: "string" },
          { name: "doctorName", type: "string" },
          { name: "symptoms", type: "string" },
          { name: "diagnosisDetails", type: "string" },
          { name: "nonce", type: "uint256" },
        ],
      };

      const message = {
        parent: signer.address,
        childAddress: params.childAddress,
        medicalType: activeTab === "hospital" ? 0 : 1,
        visitedName: encrpytedName,
        timestamp:
          activeTab === "hospital" ? formData.date : formData.prescriptionDate,
        doctorName: encrpytedDoctorName,
        symptoms: encrpytedSymptoms,
        diagnosisDetails: encrpytedDiagnosis,
        nonce: nonce,
      };
      console.log("message :", message);

      const signature = await signer.signTypedData(domain, types, message);

      setIsSaveLoading(true);
      await metaTxAPI.post("/contract/medical/add", {
        parent: signer.address,
        childAddress: params.childAddress,
        medicalType: activeTab === "hospital" ? 0 : 1,
        visitedName: encrpytedName,
        timestamp:
          activeTab === "hospital" ? formData.date : formData.prescriptionDate,
        doctorName: encrpytedDoctorName,
        symptoms: encrpytedSymptoms,
        diagnosisDetails: encrpytedDiagnosis,
        signature,
      });

      setFormData(initialFormData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving medical history:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaveLoading(false);
    }
  }, [formData, activeTab, validateForm, initialFormData, params.childAddress]);

  return (
    <Layout childAddress={params.childAddress} childID={params.id}>
      <Container>
        <Header>
          <h1>진료내역</h1>
          <SortDropdown>
            <SortButton onClick={toggleDropdown}>
              {sortOrder}
              <ArrowIcon src={Arrow} alt="arrow" $isOpen={isDropdownOpen} />
            </SortButton>
            {isDropdownOpen && (
              <DropdownMenu>
                <DropdownItem onClick={() => handleSortChange("최신순")}>
                  최신순
                </DropdownItem>
                <DropdownItem onClick={() => handleSortChange("오래된순")}>
                  오래된순
                </DropdownItem>
              </DropdownMenu>
            )}
          </SortDropdown>
        </Header>

        {isLoading ? (
          <LoadingContainer>
            <div>데이터를 불러오고 있어요!</div>
          </LoadingContainer>
        ) : sortedData.length === 0 ? (
          <EmptyContainer>
            <div>아직 진료 내역이 없어요</div>
            <Treatment as="button" onClick={openModal}>
              진료 내역 추가하기
            </Treatment>
          </EmptyContainer>
        ) : (
          <ContentSection>
            {sortedData.map((item) => (
              <Record key={item.id}>
                <Link
                  to={`/medicalHistory/details/${params.childAddress}/${params.id}/${item.id}`}
                  state={{ medicalDetail: item }}
                  style={{ textDecoration: "none" }}
                >
                  <Date>{item.date}</Date>
                  <Info>
                    <div className="symptoms">
                      <div className="check">
                        <img src={Check} alt="checked" />
                      </div>
                      <div className="content">{item.symptoms}</div>
                    </div>
                    <Treatment>{item.visitedName}</Treatment>
                  </Info>
                </Link>
              </Record>
            ))}
          </ContentSection>
        )}
        <AddButton>
          <button onClick={openModal} aria-label="진료 내역 추가" />
        </AddButton>
      </Container>

      <AddModal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>진료내역 추가</ModalHeader>
        <TabContainer>
          <TabButton
            $active={activeTab === "hospital"}
            onClick={() => setActiveTab("hospital")}
          >
            병원
          </TabButton>
          <TabButton
            $active={activeTab === "pharmacy"}
            onClick={() => setActiveTab("pharmacy")}
          >
            약국
          </TabButton>
        </TabContainer>
        <Form>
          <FormLayout>
            <Label>{activeTab === "hospital" ? "병원명" : "약국명"}</Label>
            <Input
              type="text"
              placeholder={`방문하신 ${
                activeTab === "hospital" ? "병원" : "약국"
              } 이름을 알려주세요`}
              value={formData.hospitalName}
              onChange={(e) =>
                handleInputChange("hospitalName", e.target.value)
              }
            />
          </FormLayout>

          <FormLayout>
            <Label>{activeTab === "hospital" ? "진료일자" : "처방일자"}</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
          </FormLayout>

          <FormLayout>
            <Label>
              {activeTab === "hospital" ? "의사 이름" : "약사 이름"}
            </Label>
            <Input
              type="text"
              placeholder={`${
                activeTab === "hospital" ? "진료" : "처방"
              }해주신 선생님 성함을 알려주세요`}
              value={formData.doctor}
              onChange={(e) => handleInputChange("doctor", e.target.value)}
            />
          </FormLayout>

          <FormLayout>
            <Label>증상</Label>
            <Textarea
              placeholder="어떤 증상이 있으셨나요?"
              value={formData.symptoms}
              onChange={(e) => handleInputChange("symptoms", e.target.value)}
            />
          </FormLayout>

          <FormLayout>
            <Label>
              {activeTab === "hospital" ? "진단 내용" : "처방 내용"}
            </Label>
            <Textarea
              placeholder={`${
                activeTab === "hospital" ? "어떤 진단을" : "어떤 처방을"
              } 받으셨나요?`}
              value={formData.diagnosis}
              onChange={(e) => handleInputChange("diagnosis", e.target.value)}
            />
          </FormLayout>

          <SubmitButton
            onClick={async (e) => {
              e.preventDefault();
              await handleSave();
            }}
          >
            {isSaveLoading ? "처리 중입니다." : "저장하기"}
          </SubmitButton>
        </Form>
      </AddModal>
    </Layout>
  );
};

export default MedicalHistory;
