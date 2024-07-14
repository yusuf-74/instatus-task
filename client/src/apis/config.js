import axios from "axios";

export const baseURL = process.env.REACT_APP_API_BASE_URL;

const instance = axios.create({
    baseURL,
    headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("access_token")
            ? "Bearer " + localStorage.getItem("access_token")
            : null,
    },
});

instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("access_token")
        ? "Bearer " + localStorage.getItem("access_token")
        : null;
        config.headers["Authorization"] = accessToken;
    return config;
});

instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        //Bearer token logic
        const originalRequest = error.config;

        if (
            error.response.status === 401 &&
            originalRequest.url === "auth/refresh/"
        ) {
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(error);
        }
        if (
            error.response.status === 401
        ) {
            const refreshToken = localStorage.getItem("refresh_token");

            if (refreshToken) {
                return instance
                    .post("/auth/refresh/", { refreshToken: refreshToken })
                    .then((response) => {
                        localStorage.setItem("access_token", response.accessToken);
                        instance.defaults.headers["Authorization"] =
                            "Bearer " + response.accessToken;
                        originalRequest.headers["Authorization"] =
                            "Bearer " + response.accessToken;
                        return instance(originalRequest);
                    })
                    .catch((err) => { 
                        console.log(err)
                    });
            }
            else {
                window.location.href = "/login";
            }
        }
        else if (error.response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(error);
        }
        if (error.response.status === 400) {
            let error_data = []
            if (typeof error.response.data === 'string') {
                return Promise.reject(error.response.data);
            }
            Object.entries(error.response.data).map(([key, value]) => {
                error_data.push(`${key}: ${typeof value === 'string' ? value : value.join(', ')}`)
            })
            return Promise.reject(error_data.join('\n'));
        }
        if (error.response.status === 403) {
            return Promise.reject(`You don't have permission to access this resource`);
        }

        if (error.response.status === 404) {
            return Promise.reject(`The resource you are trying to access does not exist`);
        }

        if (error.response.status >= 500) {
            return Promise.reject(`Internal server error`);
        }

        return Promise.reject("Something went wrong. Please try again later.");
    }
);

export default instance;