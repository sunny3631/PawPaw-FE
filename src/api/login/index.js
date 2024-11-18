import { api } from "../instance";

export const userAuth = {
  login: async (address) => {
    const response = await api.post("/api/auth/login", address);
    return response;
  },

  refresh: async (refreshToken) => {
    const response = await api.post("/api/auth/refresh", refreshToken);
    return response;
  },
};
