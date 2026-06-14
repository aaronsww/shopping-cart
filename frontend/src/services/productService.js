import axios from "axios";

const API_BASE = "http://localhost:8080/api/products";

export const fetchProducts = () => axios.get(API_BASE);
