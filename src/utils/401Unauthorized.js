
export const Unauthorized = (status) => {
    if (status == 401) {
        localStorage.clear();
        window.location.href = '/login';
    }
}