import { useState } from "react";
import styled from "styled-components";
import FaPaw from "../assets/icons/foot.svg";
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

  const vaccineNames = [
    "디프테리아",
    "폴리오",
    "백일해",
    "홍역",
    "파상풍",
    "결핵",
    "B형간염",
    "유행성이하선염",
    "풍진",
    "수두",
    "일본뇌염",
    "B형헤모필루스인플루엔자",
    "폐렴구균",
    "인플루엔자",
    "A형간염",
    "사람유두종바이러스",
    "장티푸스",
    "신증후군출혈열",
    "그룹 A형 로타바이러스 감염증",
  ];

  const [selectedVaccines, setSelectedVaccines] = useState(
    vaccineNames.reduce((acc, vaccine) => ({ ...acc, [vaccine]: false }), {})
  );

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

  const handleVaccineChange = (vaccine) => {
    setSelectedVaccines((prev) => ({
      ...prev,
      [vaccine]: !prev[vaccine],
    }));
  };

  return (
    <Container step={step}>
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
      <FormTitle>{step === 1 ? "아이 기본 정보" : "예방접종 이력"}</FormTitle>

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
        <>
          {" "}
          <VaccineList>
            {vaccineNames.map((vaccine) => (
              <RoundedBox
                key={vaccine}
                hasIcon={selectedVaccines[vaccine]}
                onClick={() => handleVaccineChange(vaccine)}
                label={vaccine}
              />
            ))}
          </VaccineList>
          <NextButton
            step={step}
            onClick={() => {
              navigate("/select");
            }}
          >
            해당사항 체크완료
          </NextButton>
        </>
      )}
    </Container>
  );
};

// RoundedBox Component
const RoundedBox = ({ hasIcon, onClick, label }) => {
  return (
    <RoundedBoxContainer onClick={onClick}>
      <IconContainer>
        {!hasIcon ? "" : <img src={FaPaw} alt="" color="#4f2304" size={24} />}
      </IconContainer>
      <Label>{label}</Label>
    </RoundedBoxContainer>
  );
};

const Container = styled.div`
  background-color: #f9d49b;
  width: 100%;
  height: ${({ step }) => (step === 1 ? "100vh" : "100%")};
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

const RoundedBoxContainer = styled.div`
  display: flex;
  align-items: center;
  width: 275px;
  height: 60px;
  background-color: #fff7e4;
  border-radius: 30px;
  border: 1px solid #f4c784;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
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
