import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Adjust path if needed
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

const getUserProfilePicture = async (): Promise<string | null> => {
    try {
        const user = auth.currentUser;
        if (!user) return null; // No user logged in

        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
            return userSnap.data().picture || "https://ionicframework.com/docs/img/demos/avatar.svg";
        } else {
            console.error("User document not found");
            return null;
        }
    } catch (error) {
        console.error("Error fetching profile picture:", error);
        return null;
    }
};

const captureAndUploadImage = async (uploadToImgBB: (base64: string) => Promise<string | null>) => {
    try {
        // Prompt user for camera or gallery
        const image = await Camera.getPhoto({
            quality: 90,
            resultType: CameraResultType.Base64,
            source: CameraSource.Prompt, // User chooses camera or gallery
        });

        if (!image.base64String) return null;

        // Upload image to ImgBB
        const uploadedImageUrl = await uploadToImgBB(image.base64String);
        if (!uploadedImageUrl) return null;

        // Save the uploaded image URL to the user's document in Firestore
        const user = auth.currentUser;
        if (!user) return null;

        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { picture: uploadedImageUrl });

        return uploadedImageUrl; // Return the uploaded image URL
    } catch (error) {
        console.error("Error capturing or uploading image:", error);
        return null;
    }
};

export { captureAndUploadImage, getUserProfilePicture };
