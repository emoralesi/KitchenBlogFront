export const getStorageUser = () => {

    var data;
    if (localStorage.getItem('UserLogged')) {
        data = JSON.parse(localStorage.getItem('UserLogged'))
    } else {
        data = null
    }

    return data
}