import styled from "styled-components";
import ConnectWallet from "../components/login/ConnectWallet";
import useWallet from "../hooks/login/useWallet";
import { useNavigate } from "react-router-dom";
import { userAuth } from "../api/login";

const Login = () => {
  const { connectWallet, walletAddress } = useWallet();
  const navigate = useNavigate();

  const onClickWallet = async () => {
    const isConnected = await connectWallet();
    if (isConnected) {
      try {
        const response = await userAuth.login({ address: walletAddress });
        if (response.data.isSuccess) {
          const { accessToken, refreshToken } = response.data.result;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          navigate("/selectChild");
        } else {
          console.log("로그인 실패: ", response.data.message);
        }
      } catch (error) {
        console.error("로그인 요청 중 오류 발생: ", error);
      }
    } else {
      alert("메타마스크와 연결이 되지 않습니다.");
    }
  };

  return (
    <Container>
      <Title>LOGIN</Title>
      <ConnectWallet handleFunc={onClickWallet} />
    </Container>
  );
};

const Container = styled.div`
  background-color: #ffcc80;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 50px;
`;

const Title = styled.span`
  font-family: KOTRA HOPE;
  font-size: 64px;
  font-weight: 900;
  line-height: 74.56px;
  text-align: left;
  color: #4f2304;
`;

export default Login;
