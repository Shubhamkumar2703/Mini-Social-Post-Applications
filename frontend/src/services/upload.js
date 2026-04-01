import axios from "axios";

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

  
    formData.append("upload_preset", "images");

    const res = await axios.post(
     
      "https://api.cloudinary.com/v1_1/dtlajgfck/image/upload",
      formData
    );

    return res.data.secure_url;

  } catch (err) {
    console.log(err.response?.data); // debug
    throw err;
  }
};