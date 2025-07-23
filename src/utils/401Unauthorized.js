
export const Unauthorized = (status) => {
    if (status == 401) {
        localStorage.removeItem("UserLogged");
        window.location.href = '/login';
    }
}