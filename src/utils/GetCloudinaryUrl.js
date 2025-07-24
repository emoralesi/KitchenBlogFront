export const getCloudinaryUrl = (publicId, options = {}) => {
  const {
    width = 500,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options;

  let base = `https://res.cloudinary.com/dzvlhgbvq/image/upload`;
  let transform = `w_${width},q_${quality},f_${format},c_${crop}`;

  if (height) transform += `,h_${height}`;  

  return `${base}/${transform}/${publicId}.webp`;
};
