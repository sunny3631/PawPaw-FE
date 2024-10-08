import useWallet from "../../hooks/login/useWallet";
import ConnectWallet from "../login/ConnectWallet";

const Layout = ({ children }) => {
  const { walletAddress, isWalletConnected, connectWallet, disconnectWallet } =
    useWallet();

  console.log(walletAddress, isWalletConnected);

  return (
    <div>
      <ConnectWallet
        walletAddress={walletAddress}
        handleFunc={isWalletConnected ? disconnectWallet : connectWallet}
        children={children}
      />
    </div>
  );
};

export default Layout;
