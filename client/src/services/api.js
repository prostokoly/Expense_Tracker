import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = "Произошла ошибка";

        if (error.response) {
            errorMessage =
                error.response.data?.message ||
                `Ошибка сервера: ${error.response.status}`;
        } else if (error.request) {
            errorMessage =
                "Не удалось подключиться к серверу. Проверьте подключение.";
        } else {
            errorMessage = error.message;
        }

        console.error("API Error:", errorMessage);
        throw new Error(errorMessage);
    },
);

export const getAllCategories = () => api.get("/categories");
export const createCategory = (category) => api.post("/categories", category);
export const updateCategory = (id, category) =>
    api.put(`/categories/${id}`, category);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getAllTransactions = () => api.get("/transactions");
export const createTransaction = (transaction) =>
    api.post("/transactions", transaction);
export const updateTransaction = (id, transaction) =>
    api.put(`/transactions/${id}`, transaction);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

export const getAllWallets = () => api.get("/wallets");
export const createWallet = (wallet) => api.post("/wallets", wallet);
export const updateWallet = (id, wallet) => api.put(`/wallets/${id}`, wallet);
export const deleteWallet = (id) => api.delete(`/wallets/${id}`);

export default api;
