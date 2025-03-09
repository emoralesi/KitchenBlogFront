export const simulateDelay = (promise) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(promise);
        }, 1500); // Delay of 5 seconds
    });
};