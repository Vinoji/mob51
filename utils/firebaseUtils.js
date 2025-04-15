import { storage } from "../config/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const uploadImage = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageName = `mobile-${Date.now()}.jpg`;
    const imageRef = ref(storage, `products/${imageName}`);

    const uploadTask = uploadBytesResumable(imageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("Uploading: ", snapshot.bytesTransferred);
        },
        (error) => {
          console.error("Upload error: ", error);
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL:", downloadUrl);
          resolve(downloadUrl);
        }
      );
    });
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
