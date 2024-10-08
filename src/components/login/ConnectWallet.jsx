const ConnectWallet = ({ walletAddress, handleFunc }) => {
  return (
    <div>
      <button onClick={handleFunc}>
        {walletAddress ? "지갑 연결 됨" : "지갑 연결 해야됨"}
      </button>
    </div>
  );
};

export default ConnectWallet;
