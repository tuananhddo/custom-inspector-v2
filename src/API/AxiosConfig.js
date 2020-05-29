import axios from "axios";

const instance = () => {
  const axiosInstance = axios.create();
  return axiosInstance;
};
export default instance;


