import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

const useWallet = () => {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const web3Instance = new Web3(window.ethereum);
    setWeb3Provider(web3Instance);

    const walletDisconnected = localStorage.getItem("isWalletDisconnected");
    if (walletDisconnected === "true") return; // 지갑 연결을 하지 않음

    if (window.ethereum) {
      // 이미 연결된 계정이 있는지 확인
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
        }
      });

      // 계정 변경 처리
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
        } else {
          setWalletAddress("");
          setIsWalletConnected(false);
        }
      });

      // 네트워크 변경 시 페이지 새로고침
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } else {
      console.log("MetaMask is not installed");
    }
  }, []);

  // 지갑을 연결하는 함수
  const connectWallet = async () => {
    localStorage.removeItem("isWalletDisconnected");

    if (web3Provider) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setWalletAddress(address);
        setIsWalletConnected(true);
        return {
          success: true,
          address,
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          address: null,
        };
      }
    } else {
      console.log("Web3 is not initalized");
      return {
        success: false,
        address: null,
      };
    }
  };

  const disconnectWallet = () => {
    navigate("/"); // 홈으로 이동
    setWalletAddress(""); // 상태 초기화
    setIsWalletConnected(false);

    localStorage.setItem("isWalletDisconnected", "true");
  };

  return { walletAddress, isWalletConnected, connectWallet, disconnectWallet };
};

export default useWallet;
