import { useState } from "react";
import styled from "styled-components";
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

  const [step, setStep] = useState(1);
  const [information, setInformation] = useState({
    name: "",
    birthDate: "",
    height: "",
    weight: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInformation((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!information.name) newErrors.name = "이름은 필수 입력 항목입니다.";
    if (!/^\d{8}$/.test(information.birthDate))
      newErrors.birthDate = "생년월일은 8자리로 입력하세요.";
    if (!/^\d{1,3}(\.\d)?$/.test(information.height))
      newErrors.height = "신장은 소수점 첫 번째 자리까지 입력하세요.";
    if (!/^\d{1,2}(\.\d)?$/.test(information.weight))
      newErrors.weight = "체중은 소수점 첫 번째 자리까지 입력하세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setStep(2);
    }
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
      <FormTitle>{step === 1 ? "아이 기본 정보" : "백신 동기화"}</FormTitle>

      {step === 1 ? (
        <>
          <FormContainer>
            <Label>*이름</Label>
            <Input
              name="name"
              value={information.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormContainer>

          <FormContainer>
            <Label>*생년월일</Label>
            <Input
              name="birthDate"
              value={information.birthDate}
              onChange={handleChange}
              placeholder="생년월일 8자를 입력하세요. ex.20240101"
            />
            {errors.birthDate && (
              <ErrorMessage>{errors.birthDate}</ErrorMessage>
            )}
          </FormContainer>

          <FormContainer>
            <Label>신장</Label>
            <Input
              name="height"
              value={information.height}
              onChange={handleChange}
              placeholder="소수점 첫 번째 자리만 입력하세요. ex. 90.1"
            />
            {errors.height && <ErrorMessage>{errors.height}</ErrorMessage>}
          </FormContainer>

          <FormContainer>
            <Label>체중</Label>
            <Input
              name="weight"
              value={information.weight}
              onChange={handleChange}
              placeholder="소수점 첫 번째 자리만 입력하세요. ex. 10.5"
            />
            {errors.weight && <ErrorMessage>{errors.weight}</ErrorMessage>}
          </FormContainer>

          <NextButton step={step} onClick={handleNext}>
            다음
          </NextButton>
        </>
      ) : (
        <div>
          <NextButton
            onClick={async () => {
              const isok = await createChild();
              if (isok.success) {
                navigate("/synchronizationVaccination", {
                  state: {
                    childAddress: isok.childAddress,
                  },
                });
              } else {
                alert("아이 등록에 실패하였습니다.");
              }
            }}
          >
            {isLoading ? "처리중..." : "동기화 할래요."}
          </NextButton>
          <NextButton
            onClick={async () => {
              const isok = await createChild();
              if (isok.success) {
                navigate("/selectChild");
              } else {
                alert("아이 등록에 실패하였습니다.");
              }
            }}
          >
            {isLoading ? "처리중..." : "동기화 안할래요."}
          </NextButton>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  background-color: #f9d49b;
  width: 100%;
  height: 100vh;
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

const FormContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 10px;
`;

const Label = styled.label`
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #4f2304;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: none;
  padding: 0 10px;
  background-color: #ffeccf;
  font-size: 16px;
  font-family: Arial, sans-serif;
`;

const NextButton = styled.button`
  width: ${({ step }) => (step === 1 ? "108px" : "275px")};
  height: ${({ step }) => (step === 1 ? "48px" : "60px")};
  border-radius: ${({ step }) => (step === 1 ? "8px" : "30px")};
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

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

export default AddChild;
