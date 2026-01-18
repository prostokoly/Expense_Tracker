// src/utils/apiHelper.js
export const safeApiCall = async (apiFunction, defaultData = []) => {
    try {
        const response = await apiFunction();

        let data = response?.data;

        if (data === undefined) {
            data = response;
        }

        if (data && typeof data === "object" && !Array.isArray(data)) {
            const arrayKeys = Object.keys(data).filter((key) =>
                Array.isArray(data[key]),
            );
            if (arrayKeys.length > 0) {
                data = data[arrayKeys[0]];
            }
        }

        if (Array.isArray(data)) {
            return { data, error: null };
        } else {
            return { data: defaultData, error: null };
        }
    } catch (error) {
        if (
            error.message === "Server Error" &&
            error.stack?.includes("reportWebVitals")
        ) {
            return { data: defaultData, error: null };
        }

        return {
            data: defaultData,
            error: error instanceof Error ? error : new Error(String(error)),
        };
    }
};
