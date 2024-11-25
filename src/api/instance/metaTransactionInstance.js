import axios from "axios";

export const metaTxAPI = axios.create({
  baseURL: "http://3.107.188.94",
  headers: {
    "Content-Type": "application/json",
  },
});
