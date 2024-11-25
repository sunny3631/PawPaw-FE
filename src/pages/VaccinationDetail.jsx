import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import Check from "../assets/check.svg";
import LoadingSpinner from "../components/LoadingSpinner";

import AddModal from "../components/AddModal";
import { ethers } from "ethers";

import abi from "../abi/ParentChildRelationshipWithMeta.json";
import { metaTxAPI } from "../api/instance/metaTransactionInstance";

const VaccinationDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const vaccine = location.state?.vaccineInfo;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vaccineDate, setVaccineDate] = useState("");
  const [vaccinationData, setVaccinationData] = useState({
    parent: "", // 메타마스크 연결된 지갑 주소
    childAddress: params.childAddress,
    vaccineName: "",
    vaccineChapter: 0,
    administeredDate: 0,
  });

  const handleDateChange = (e) => {
    const date = e.target.value;
    setVaccineDate(date);

    const timestamp = Math.floor(new Date(date).getTime() / 1000);

    setVaccinationData((prev) => ({
      ...prev,
      vaccineName: vaccine.type,
      vaccineChapter: Number(vaccine.doses.replace(/[^0-9]/g, "")),
      administeredDate: timestamp,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateVaccine();
      setIsModalOpen(false);
    } catch (error) {
      console.error("TX faild : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVaccine = async () => {
    try {
      if (!window.ethereum) {
        throw Error("MetaMask not install");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const updatedVaccinationData = {
        ...vaccinationData,
        parent: signer.address,
      };

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
        UpdateVaccination: [
          { name: "parent", type: "address" },
          { name: "childAddress", type: "address" },
          { name: "vaccineName", type: "string" },
          { name: "vaccineChapter", type: "uint8" },
          { name: "administeredDate", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      };

      const message = {
        parent: updatedVaccinationData.parent,
        childAddress: updatedVaccinationData.childAddress,
        vaccineName: updatedVaccinationData.vaccineName,
        vaccineChapter: updatedVaccinationData.vaccineChapter,
        administeredDate: updatedVaccinationData.administeredDate,
        nonce,
      };

      const signature = await signer.signTypedData(domain, types, message);

      await metaTxAPI.post("/contract/vaccination/update", {
        parent: updatedVaccinationData.parent,
        childAddress: updatedVaccinationData.childAddress,
        vaccineName: updatedVaccinationData.vaccineName,
        vaccineChapter: updatedVaccinationData.vaccineChapter,
        administeredDate: updatedVaccinationData.administeredDate,
        signature,
      });
    } catch (error) {
      throw error;
    }
  };

  if (!vaccine) {
    return (
      <Layout childAddress={params.childAddress} childID={params.childID}>
        <DetailContainer>
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p>백신 정보를 찾을 수 없습니다.</p>
          </div>
        </DetailContainer>
      </Layout>
    );
  }

  return (
    <Layout childAddress={params.childAddress} childID={params.childID}>
      <DetailContainer>
        <Header>
          <HeaderContent>
            <BackButton onClick={() => navigate(-1)} />
            <TitleSection>
              <Title>{vaccine.name}</Title>
              <StatusDot
                $isCompleted={vaccine.status === "접종"}
                title={vaccine.status}
              />
            </TitleSection>
            <ActionSection>
              <UpdateButton onClick={() => setIsModalOpen(true)}>
                수정하기
              </UpdateButton>
            </ActionSection>
          </HeaderContent>
        </Header>

        <InfoGrid>
          <DetailItem>
            <div className="info">
              <div className="check">
                <img src={Check} alt="check" />
              </div>
              <div className="name">현재 백신 차수</div>
            </div>
            <div className="value">{vaccine.doses}</div>
          </DetailItem>

          <DetailItem>
            <div className="info">
              <div className="check">
                <img src={Check} alt="check" />
              </div>
              <div className="name">백신 종류</div>
            </div>
            <div className="value">{vaccine.type}</div>
          </DetailItem>

          <DetailItem>
            <div className="info">
              <div className="check">
                <img src={Check} alt="check" />
              </div>
              <div className="name">
                {vaccine.status === "접종" ? "접종 날짜" : "접종 기간"}
              </div>
            </div>
            <div className="value">
              {vaccine.status === "접종"
                ? vaccine.date === null
                  ? "정보가 없어요"
                  : vaccine.date
                : vaccine.next}
            </div>
          </DetailItem>
        </InfoGrid>

        <AddModal
          isOpen={isModalOpen}
          onClose={() => !isLoading && setIsModalOpen(false)}
        >
          <ModalForm onSubmit={handleSubmit}>
            <div>
              <ModalTitle>접종 정보 업데이트</ModalTitle>
              <ModalSubtitle>
                아래 정보를 확인하고 접종 날짜를 입력해주세요
              </ModalSubtitle>
            </div>

            <VaccineInfoSection>
              <VaccineInfoItem>
                <span className="label">백신 이름</span>
                <span className="value">{vaccine.type}</span>
              </VaccineInfoItem>
              <VaccineInfoItem>
                <span className="label">질병</span>
                <span className="value">{vaccine.name.split(" ")[0]}</span>
              </VaccineInfoItem>
              <VaccineInfoItem>
                <span className="label">차수</span>
                <span className="value">{vaccine.doses}</span>
              </VaccineInfoItem>
              <VaccineInfoItem>
                <span className="label">권장 접종 기간</span>
                <span className="value">{vaccine.next}</span>
              </VaccineInfoItem>
            </VaccineInfoSection>

            <FormGroup>
              <Label htmlFor="vaccineDate">접종 날짜</Label>
              <Input
                id="vaccineDate"
                type="date"
                value={vaccineDate}
                onChange={handleDateChange}
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <ButtonContent>
                  <LoadingSpinner size={16} />
                  <span>처리중...</span>
                </ButtonContent>
              ) : (
                "수정 완료하기"
              )}
            </SubmitButton>
          </ModalForm>
        </AddModal>
      </DetailContainer>
    </Layout>
  );
};

const DetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  color: #4a4343;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => (props.$isCompleted ? "#0080FF" : "#FF6B6B")};
  box-shadow: 0 0 0 2px
    ${(props) =>
      props.$isCompleted
        ? "rgba(0, 128, 255, 0.2)"
        : "rgba(255, 107, 107, 0.2)"};
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 8px 16px;
  margin: -8px -16px; // negative margin to align with container
  color: #4a4343;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &::before {
    content: "";
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: ${`url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 12H5M5 12L12 19M5 12L12 5' stroke='%234A4343' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`};
    background-repeat: no-repeat;
    background-position: center;
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #000;
    &::before {
      transform: translateX(-4px);
    }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 24px;
  background: #fffcf5;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .info {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 16px;
  }

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

  .name {
    font-size: 16px;
    font-weight: 600;
    color: #4a4343;
  }

  .value {
    padding: 8px 16px;
    background: rgba(255, 252, 245, 0.75);
    border-radius: 8px;
    border: 1px solid rgba(182, 182, 182, 0.3);
    color: #4a4343;
    font-size: 14px;
    font-weight: 500;
    min-width: 120px;
    text-align: center;
  }
`;

const UpdateButton = styled.button`
  background: #ffcc80;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: #4a4343;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;

  &:hover {
    background: #ffb74d;
    transform: translateY(-2px);
  }
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ModalTitle = styled.h3`
  color: #4a4343;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
`;

const ModalSubtitle = styled.div`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
`;

const VaccineInfoSection = styled.div`
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
`;

const VaccineInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(74, 67, 67, 0.1);

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: #666;
    font-size: 14px;
  }

  .value {
    color: #4a4343;
    font-weight: 600;
    font-size: 14px;
  }
`;

const FormGroup = styled.div`
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
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #ffcc80;
    box-shadow: 0 0 0 2px rgba(255, 204, 128, 0.2);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const SubmitButton = styled.button`
  background: #ffcc80;
  border: none;
  border-radius: 6px;
  padding: 14px;
  color: #4a4343;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #ffb74d;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    margin-right: 8px;
  }
`;

export default VaccinationDetail;
