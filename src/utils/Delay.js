export const simulateDelay = async (promise) => {
  const result = await promise;
  await new Promise((res) => setTimeout(res, 3000));
  return result;
};
