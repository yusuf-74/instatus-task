import instance from "./config";

const AUTH_APIS = {
    login: async (data) =>  await instance.post("auth/login/", data),
    register: async (data) =>  await instance.post("auth/register/", data),
    listUsers: async () =>  await instance.get("auth/users/"),
};

export { AUTH_APIS };