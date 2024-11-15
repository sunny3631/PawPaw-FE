import { ethers } from "ethers";
import ParentChildRelationshipABI from "../abi/ParentChildRelationshipWithMeta.json";

export const setupContract = async () => {
  if (!window.ethereum) {
    throw new Error("METAMask not install");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    process.env.REACT_APP_PARENT_CHILD_RELATIONSHIP_ADDRESS,
    ParentChildRelationshipABI.abi,
    provider
  );

  return { provider, contract };
};
