export const dateConvert = (date) => {
    const dateObject = new Date(date);

    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = dateObject.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate
}