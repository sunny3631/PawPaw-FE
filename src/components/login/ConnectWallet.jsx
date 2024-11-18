import styled from "styled-components";
import metamaskLogo from "../../assets/icons/Metamask.svg";

const ConnectWallet = ({ handleFunc }) => {
  return (
    <Container onClick={handleFunc}>
      <MetaMaskImg src={metamaskLogo} alt="메타마스크" />
      <Title>METAMASK</Title>
    </Container>
  );
};

const Container = styled.button`
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  width: 241px;
  height: 52px;
  border-radius: 7px;
  border: 1.5px solid #ffeccf;
  background-color: rgba(255, 255, 255, 0.1); /* 배경만 투명도 적용 */
`;

const MetaMaskImg = styled.img`
  width: 24px;
  height: 24px;
`;

const Title = styled.span`
  font-family: Inter;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;
`;

export default ConnectWallet;
