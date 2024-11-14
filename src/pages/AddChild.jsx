import { useState } from "react";
import styled from "styled-components";
import Left from "../assets/image/leftBackground.svg";
import Right from "../assets/image/rightBackground.svg";
import { useNavigate } from "react-router-dom";

const AddChild = () => {
  const [step, setStep] = useState(1);
  const [information, setInformation] = useState({
    name: "",
    birthDate: "",
    height: "",
    weight: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

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
          <NextButton onClick={() => navigate("/synchronizationVaccination")}>
            동기화 할래요.
          </NextButton>
          <NextButton onClick={() => navigate("/dashboard")}>
            동기화 안할래요.
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
