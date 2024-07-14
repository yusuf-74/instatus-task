import instance from "./config";

const AUTH_APIS = {
    login: async (data) =>  await instance.post("auth/login/", data),
    register: async (data) =>  await instance.post("auth/register/", data),
    listUsers: async () =>  await instance.get("auth/users/"),
};

const EVENTS_APIS = {
    listEvents: async (pagination, filters) => {
        return await instance.get("events/", {
            params: {
                page: pagination.page,
                limit: pagination.limit,
                ...filters
            }
        });
    },
    createEvent: async (data) => {
        return await instance.post("events/", data);
    },
    resetEventsData: async () => {
        return await instance.delete("events/reset/");
    },
    generateEvents: async () => {
        return await instance.post("events/generate/");
    },
};

const ACTIONS_APIS = {
    listActions: async () => {
        return await instance.get("actions/");
    },
}

export { AUTH_APIS, EVENTS_APIS, ACTIONS_APIS };