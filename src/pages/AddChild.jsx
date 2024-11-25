import { useState } from "react";
import styled, { keyframes } from "styled-components";
import Left from "../assets/image/leftBackground.svg";
import Right from "../assets/image/rightBackground.svg";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import abi from "../abi/ParentChildRelationshipWithMeta.json";
import toUnixTimestamp from "../utils/toUnixtimestamp.js";
import { metaTxAPI } from "../api/instance/metaTransactionInstance.js";
import { formatInformation } from "../utils/formatInformation.js";

import { encodeData } from "../utils/cryption.js";
import { child } from "../api/child/index.js";

const AddChild = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");
  const [information, setInformation] = useState({
    name: "",
    birthDate: "",
    height: "",
    weight: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      field: "name",
      title: "아이의 이름을 알려주세요",
      placeholder: "이름을 입력하세요",
      validation: (value) => (!value ? "이름은 필수 입력 항목입니다." : null),
    },
    {
      field: "birthDate",
      title: "아이의 생년월일을 알려주세요",
      placeholder: "생년월일 8자를 입력하세요. ex.20240101",
      validation: (value) =>
        !/^\d{8}$/.test(value) ? "생년월일은 8자리로 입력하세요." : null,
      format: (value) => {
        if (value.length === 8) {
          return `${value.slice(0, 4)}년 ${value.slice(4, 6)}월 ${value.slice(
            6,
            8
          )}일`;
        }
        return value;
      },
    },
    {
      field: "height",
      title: "아이의 키를 알려주세요",
      placeholder: "소수점 첫 번째 자리만 입력하세요. ex. 90.1",
      validation: (value) =>
        value && !/^\d{1,3}(\.\d)?$/.test(value)
          ? "신장은 소수점 첫 번째 자리까지 입력하세요."
          : null,
      unit: "cm",
    },
    {
      field: "weight",
      title: "아이의 몸무게를 알려주세요",
      placeholder: "소수점 첫 번째 자리만 입력하세요. ex. 10.5",
      validation: (value) =>
        value && !/^\d{1,2}(\.\d)?$/.test(value)
          ? "체중은 소수점 첫 번째 자리까지 입력하세요."
          : null,
      unit: "kg",
    },
    {
      field: "confirmation",
      title: "입력하신 정보를 확인해주세요",
      isConfirmation: true,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInformation((prev) => ({ ...prev, [name]: value }));
    const currentStepData = steps[currentStep];
    const error = currentStepData.validation?.(value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleNext = () => {
    const currentStepData = steps[currentStep];
    if (currentStepData.isConfirmation) {
      setSlideDirection("next");
      setCurrentStep(currentStep + 1);
      return;
    }

    const error = currentStepData.validation?.(
      information[currentStepData.field]
    );
    if (error) {
      setErrors((prev) => ({ ...prev, [currentStepData.field]: error }));
      return;
    }

    setSlideDirection("next");
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setSlideDirection("prev");
    setCurrentStep((prev) => prev - 1);
  };

  const createChild = async () => {
    setIsLoading(true);
    try {
      if (!window.ethereum) {
        throw Error("MetaMask not install");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const encrpytedName = encodeData(information.name, signer.address);

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
        CreateChild: [
          { name: "parent", type: "address" },
          { name: "name", type: "string" },
          { name: "birthDate", type: "uint256" },
          { name: "height", type: "uint16" },
          { name: "weight", type: "uint16" },
          { name: "nonce", type: "uint256" },
        ],
      };

      const message = {
        parent: signer.address,
        name: encrpytedName,
        birthDate: toUnixTimestamp(information.birthDate),
        height: formatInformation(information.height),
        weight: formatInformation(information.weight),
        nonce,
      };

      const signature = await signer.signTypedData(domain, types, message);

      const response = await metaTxAPI.post("/contract/create", {
        parent: signer.address,
        childName: encrpytedName,
        birthDate: toUnixTimestamp(information.birthDate),
        height: formatInformation(information.height),
        weight: formatInformation(information.weight),
        signature,
      });

      if (response.data.success) {
        // 이벤트에서 자녀 주소 추출
        const createChildEvent = response.data.data.events.find(
          (event) => event.name === "CreateChild"
        );
        const childAddress = createChildEvent.args[1]; // CreateChild 이벤트의 두 번째 인자가 childAddress

        console.log(childAddress);

        // 여기서 백엔드 연결하는 코드 작성
        try {
          const formatDateString = (dateStr) => {
            const year = dateStr.substring(0, 4);
            const month = dateStr.substring(4, 6);
            const day = dateStr.substring(6, 8);
            return `${year}-${month}-${day}`;
          };

          const backendData = {
            address: childAddress,
            name: encrpytedName, // 이미 암호화된 이름 사용
            birthDate: formatDateString(information.birthDate),
            height: parseFloat(information.height),
            weight: parseFloat(information.weight),
          };

          const backendResponse = await child.create(backendData);

          if (backendResponse.data.isSuccess) {
            setIsLoading(false);
            return { success: true, childAddress };
          } else {
            throw new Error("백엔드 API 호출 에러");
          }
        } catch (error) {
          setIsLoading(false);
          console.error(error);
          return {
            success: false,
          };
        }
      }

      setIsLoading(false);
      return {
        success: false,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
      };
    }
  };

  return (
    <Container>
      <BackgroundWrapper>
        <img src={Left} alt="" />
        <img src={Right} alt="" />
      </BackgroundWrapper>

      <FormWrapper>
        {currentStep < steps.length - 1 ? (
          <FormSection key={currentStep} slideDirection={slideDirection}>
            <StepIndicator>
              {steps.slice(0, -1).map((_, index) => (
                <StepDot key={index} active={index === currentStep} />
              ))}
            </StepIndicator>

            <FormTitle>{steps[currentStep].title}</FormTitle>

            {!steps[currentStep].isConfirmation ? (
              <InputWrapper>
                <StyledInput
                  name={steps[currentStep].field}
                  value={information[steps[currentStep].field]}
                  onChange={handleChange}
                  placeholder={steps[currentStep].placeholder}
                  autoFocus
                />
                {steps[currentStep].unit && (
                  <Unit>{steps[currentStep].unit}</Unit>
                )}
              </InputWrapper>
            ) : (
              <ConfirmationList>
                {Object.entries(information).map(([key, value]) => (
                  <ConfirmationItem key={key}>
                    <ConfirmationLabel>
                      {steps.find((s) => s.field === key)?.title}
                    </ConfirmationLabel>
                    <ConfirmationValue>
                      {steps.find((s) => s.field === key)?.format?.(value) ||
                        value}
                      {steps.find((s) => s.field === key)?.unit}
                    </ConfirmationValue>
                  </ConfirmationItem>
                ))}
              </ConfirmationList>
            )}

            {errors[steps[currentStep].field] && (
              <ErrorMessage>{errors[steps[currentStep].field]}</ErrorMessage>
            )}

            <ButtonGroup>
              {currentStep > 0 && (
                <BackButton onClick={handleBack}>이전</BackButton>
              )}
              <NextButton onClick={handleNext}>
                {currentStep === steps.length - 2 ? "확인" : "다음"}
              </NextButton>
            </ButtonGroup>
          </FormSection>
        ) : (
          <SyncSection slideDirection={slideDirection}>
            <FormTitle>백신 정보를 동기화할까요?</FormTitle>
            <SyncButtonGroup>
              <SyncButton
                onClick={async () => {
                  const result = await createChild();
                  if (result.success) {
                    navigate("/synchronizationVaccination", {
                      state: { childAddress: result.childAddress },
                    });
                  } else {
                    alert("아이 등록에 실패하였습니다.");
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? "처리중..." : "동기화 할래요"}
              </SyncButton>
              <SyncButton
                onClick={async () => {
                  const result = await createChild();
                  if (result.success) {
                    navigate("/selectChild");
                  } else {
                    alert("아이 등록에 실패하였습니다.");
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? "처리중..." : "동기화 안할래요"}
              </SyncButton>
            </SyncButtonGroup>
          </SyncSection>
        )}
      </FormWrapper>
    </Container>
  );
};

const slideInNext = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInPrev = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Styled Components
const Container = styled.div`
  background-color: #f9d49b;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 30px;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;

  img {
    height: 100px;
    object-fit: cover;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  position: relative;
`;

const FormSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  animation: ${({ slideDirection }) =>
      slideDirection === "next" ? slideInNext : slideInPrev}
    0.3s ease-out;
`;

const SyncSection = styled(FormSection)``;

const StepIndicator = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const StepDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ active }) => (active ? "#4F2304" : "#FFE4B5")};
  transition: background-color 0.3s ease;
`;

const FormTitle = styled.h2`
  font-family: KOTRAHOPE;
  font-size: 28px;
  color: #4f2304;
  text-align: center;
  margin: 0 0 24px;
`;

const InputWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  background-color: #ffeccf;
  font-size: 16px;
  color: #4f2304;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #4f2304;
  }

  &::placeholder {
    color: #bfa78a;
  }
`;

const Unit = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #4f2304;
`;

const ErrorMessage = styled.p`
  color: #ff4b4b;
  font-size: 14px;
  margin: 8px 0 0;
  text-align: left;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const BaseButton = styled.button`
  height: 48px;
  padding: 0 24px;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NextButton = styled(BaseButton)`
  background-color: #fff7e4;
  color: #4f2304;

  &:hover:not(:disabled) {
    background-color: #ffe4b5;
  }
`;

const BackButton = styled(BaseButton)`
  background-color: transparent;
  color: #4f2304;

  &:hover:not(:disabled) {
    background-color: rgba(79, 35, 4, 0.1);
  }
`;

const SyncButtonGroup = styled(ButtonGroup)`
  flex-direction: column;
  width: 100%;
`;

const SyncButton = styled(BaseButton)`
  width: 100%;
  background-color: #fff7e4;
  color: #4f2304;

  &:hover:not(:disabled) {
    background-color: #ffe4b5;
  }
`;

const ConfirmationList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ConfirmationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffeccf;
  border-radius: 12px;
`;

const ConfirmationLabel = styled.span`
  color: #4f2304;
  font-size: 14px;
`;

const ConfirmationValue = styled.span`
  color: #4f2304;
  font-weight: 600;
`;

export default AddChild;
