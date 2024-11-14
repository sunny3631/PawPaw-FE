import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import FaPaw from "../assets/icons/foot.svg";
import Left from "../assets/image/leftBackground.svg";
import Right from "../assets/image/rightBackground.svg";

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

const SynchronizationVaccination = () => {
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

  const navigate = useNavigate();

  const handleVaccineChange = (vaccine) => {
    setSelectedVaccines((prev) => ({
      ...prev,
      [vaccine]: !prev[vaccine],
    }));
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
        onClick={() => {
          // 백신동기화하는 서명 생성하여야 합니다.
          navigate("/");
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
