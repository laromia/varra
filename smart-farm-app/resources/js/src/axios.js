import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://your-backend-url/api/',  // Adjust the base URL
});

export default axiosInstance;
