import cloudinary from "../cloudinary";

export const uploadImageByUrl = async (imageUrl: string, folder = "rhinoplasty/ai-results") => {
  try {
    const res = await cloudinary.uploader.upload(imageUrl, {
      folder,
    });

    return res.secure_url; // Cloudinary-hosted URL
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw err;
  }
};