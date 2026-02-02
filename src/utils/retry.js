const RETRYABLE_CODES = [
    "AI_INVALID_JSON",
    "INVALID_RECIPE",
    "INTERNAL_ERROR",
];

export const retry = async (fn, retries = 5, delay = 700) => {
    try {
        return await fn();
    } catch (error) {
        if (
            retries <= 1 ||
            !RETRYABLE_CODES.includes(error.code)
        ) {
            throw error;
        }

        await new Promise(res => setTimeout(res, delay));
        return retry(fn, retries - 1, delay * 1.3);
    }
};
