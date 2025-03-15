import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Adjust path if needed

export const removeFriend = async (friendId: string, setFriends: (callback: (prev: any) => any) => void) => {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const friendRef = doc(db, "users", friendId);

        // Get user and friend data
        const [userSnap, friendSnap] = await Promise.all([getDoc(userRef), getDoc(friendRef)]);

        if (!userSnap.exists() || !friendSnap.exists()) {
            console.error("User or friend document does not exist");
            return;
        }

        // Remove friend from both users' friends list
        await Promise.all([
            updateDoc(userRef, { friends: userSnap.data().friends.filter((id: string) => id !== friendId) }),
            updateDoc(friendRef, { friends: friendSnap.data().friends.filter((id: string) => id !== user.uid) })
        ]);

        // Update local state
        setFriends((prevFriends) => prevFriends.filter((friend: { id: string }) => friend.id !== friendId));

        console.log("Friend removed successfully");
    } catch (error) {
        console.error("Error removing friend:", error);
    }
};

export const addFriend = async (friendId: string, setFriends: (callback: (prev: any) => any) => void) => {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const friendRef = doc(db, "users", friendId);

        // Get user and friend data
        const [userSnap, friendSnap] = await Promise.all([getDoc(userRef), getDoc(friendRef)]);

        if (!userSnap.exists() || !friendSnap.exists()) {
            console.error("User or friend document does not exist");
            return;
        }

        // Add friend to both users' friends list
        await Promise.all([
            updateDoc(userRef, { friends: arrayUnion(friendId) }),
            updateDoc(friendRef, { friends: arrayUnion(user.uid) })
        ]);

        // Update local state
        setFriends((prevFriends) => [...prevFriends, { id: friendId, name: friendSnap.data().name, picture: friendSnap.data().picture || "https://ionicframework.com/docs/img/demos/card-media.png", since: friendSnap.data().since || "Unknown" }]);

        console.log("Friend added successfully");
    } catch (error) {
        console.error("Error adding friend:", error);
    }
};
