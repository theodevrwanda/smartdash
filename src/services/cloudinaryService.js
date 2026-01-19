
export async function uploadToCloudinary(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dhjdtt7rj"; // Fallback to provided name if env not set
    const uploadPreset = "smartstock";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "smartstock/users");

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Cloudinary Error Response:", data);
            throw new Error(data.error?.message || "Upload failed");
        }

        return data.secure_url;
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }
}
