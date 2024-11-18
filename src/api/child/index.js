import { api } from "../instance/userInstance.js";

export const child = {
  create: async (body) => {
    const response = await api.post("/api/children", {
      address: body.address,
      name: body.name,
      birthDate: body.birthDate,
      height: body.height,
      weight: body.weight,
    });
    return response;
  },

  returns: async () => {},

  return: async (childAddress) => {
    const response = await api.get(`/api/children/${childAddress}`);

    return response;
  },

  update: async (body) => {
    const response = await api.put(`/api/children/${body.address}`, {
      name: body.name,
      birthDate: body.birthDate,
      height: body.height,
      weight: body.weight,
      profile: body.profileImageURL,
    });

    return response;
  },

  delete: async (childAddress) => {
    const response = await api.delete(`/api/children/${childAddress}`);

    return response;
  },

  synchronization: async (childAddress) => {
    const response = await api.post(
      `/api/children/${childAddress}`,
      childAddress
    );

    return response;
  },
};
