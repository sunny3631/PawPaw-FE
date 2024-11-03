import { api } from "../instance";

export const userAuth = {
  login: async (address) => {
    const response = await api.post("/api/user/login", address);
    return response;
  },

  refresh: async (refreshToken) => {
    const response = await api.post("/api/user/refresh", refreshToken);
    return response;
  },
};
