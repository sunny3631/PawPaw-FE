import axios from "axios";

export const metaTxAPI = axios.create({
  baseURL: "https://tx.yujamint.site",
  headers: {
    "Content-Type": "application/json",
  },
});
