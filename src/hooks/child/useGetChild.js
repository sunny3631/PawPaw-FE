import { useEffect, useState, useCallback } from "react";
import { setupContract } from "../../utils/ethereum";

export const useGetChild = () => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      try {
        const { provider, contract } = await setupContract();
        setProvider(provider);
        setContract(contract);
      } catch (error) {
        console.error("Contract initialization error:", error);
      }
    };

    initContract();
  }, []);

  const getChildInformation = useCallback(async () => {
    if (!contract) return null;

    try {
      const data = await contract.returnChildInformation();
      return data;
    } catch (error) {
      console.error("Failed to fetch child information:", error);
      return null;
    }
  }, [contract]);

  return {
    getChildInformation,
    contract,
    provider,
  };
};
