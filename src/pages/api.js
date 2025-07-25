import axios from "axios";

// Change this if your backend is running on another port
const API = axios.create({
  baseURL: "http://localhost:5000/",
});

export default API;
