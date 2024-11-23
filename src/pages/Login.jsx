import styled from "styled-components";
import ConnectWallet from "../components/login/ConnectWallet";
import useWallet from "../hooks/login/useWallet";
import { useNavigate } from "react-router-dom";
import { userAuth } from "../api/login";

const Login = () => {
  const { connectWallet } = useWallet();
  const navigate = useNavigate();

  const onClickWallet = async () => {
    try {
      const { success, address } = await connectWallet();

      if (!success) {
        alert("메타마스크와 연결이 되지 않습니다.");
        return;
      }

      if (!address) {
        alert("지갑 주소를 가져올 수 없습니다.");
        return;
      }

      // 기존 토큰 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      const response = await userAuth.login({ address: address });

      if (!response?.data?.isSuccess) {
        throw new Error(response?.data?.message || "로그인에 실패했습니다.");
      }

      const { accessToken, refreshToken } = response.data.result;

      if (!accessToken || !refreshToken) {
        throw new Error("유효하지 않은 토큰입니다.");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/selectChild");
    } catch (error) {
      console.error("로그인 처리 중 오류가 발생했습니다:", error);
      alert(error.message || "로그인 처리 중 오류가 발생했습니다.");

      // 에러 발생 시 토큰 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
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
