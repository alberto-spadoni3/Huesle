import axios from "axios";
const BASE_URL = "http://localhost:8080";

export default axios.create({
    baseURL: BASE_URL,
});

const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

axiosPrivate.defaults.headers.post["Content-Type"] = "application/json";

export {axiosPrivate};