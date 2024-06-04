
export const Unauthorized = (status) => {
    if (status == 401) {
        console.log("Limpiamos localStorage");
        localStorage.clear();
        window.location.href = '/login';
    }
}