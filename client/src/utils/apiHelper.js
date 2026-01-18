// src/utils/apiHelper.js
export const safeApiCall = async (apiFunction, defaultData = []) => {
    try {
        const response = await apiFunction();
        console.log("📊 API Response received:", response);

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
                console.log("📊 Found array in key:", arrayKeys[0]);
            }
        }

        if (Array.isArray(data)) {
            console.log("✅ Data is valid array, length:", data.length);
            return { data, error: null };
        } else {
            console.warn("⚠️ Data is not array, returning default:", data);
            return { data: defaultData, error: null };
        }
    } catch (error) {
        if (
            error.message === "Server Error" &&
            error.stack?.includes("reportWebVitals")
        ) {
            console.log("⚠️ Ignoring reportWebVitals error");
            return { data: defaultData, error: null };
        }

        console.error("❌ API Error:", error);
        return {
            data: defaultData,
            error: error instanceof Error ? error : new Error(String(error)),
        };
    }
};
