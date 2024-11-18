import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SynchronizationChild = () => {
  const [childCode, setChildCode] = useState("");
  const navigate = useNavigate();

  // 자녀의 코드를 입력 후 정확한 동기화가 진행되는 로직이 추가되야 함.

  return (
    <Container>
      <Title>동기화</Title>
      <InputContainer>
        <InputText>자녀의 코드를 입력해주세요.</InputText>
        <Input
          onChange={(e) => {
            setChildCode(e.target.value);
          }}
        />
      </InputContainer>
      <InputButton
        onClick={() => {
          if (childCode === "") {
            alert("정확한 값을 입력해주세요.");
          } else {
            // 동기화 로직 추가
            navigate("/selectChild");
          }
        }}
      >
        <ButtonText>확인</ButtonText>
      </InputButton>
    </Container>
  );
};

const Container = styled.div`
  background-color: #ffcc80;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 200px;
`;

const Title = styled.span`
  font-family: KOTRAHOPE;
  font-size: 50px;
  font-weight: 400;
  line-height: 58.25px;
  text-align: left;

  color: #4f2304;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 338px;
  gap: 20px;
`;

const InputText = styled.span`
  font-family: Karla;
  font-size: 16px;
  font-weight: 800;
  line-height: 18.7px;
`;

const Input = styled.input`
  width: 100%;
  height: 32px;
  border-radius: 7px;
  border: none;

  background-color: #ffeccf;
`;

const InputButton = styled.button`
  width: 120px;
  height: 50px;
  border-radius: 8px;
  border: none; /* 보더 컬러가 아닌 보더를 제거 */
  background-color: rgba(255, 247, 228, 0.7); /* 배경만 투명하게 */

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.span`
  font-family: Inter;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;

export default SynchronizationChild;
