import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonImg, IonBackButton } from '@ionic/react';
import { arrowBackOutline, cameraOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import QRCode from 'qrcode'; // Import qrcode library
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth
import 'animate.css'; // Import animate.css
import './Profile.css'; // Update the CSS file path
import { Swiper, SwiperSlide } from 'swiper/react';
import {getUserProfilePicture, captureAndUploadImage} from '../actions/profile';

const Profile: React.FC = () => {
  const history = useHistory();
  const qrCodeRef = useRef<HTMLCanvasElement | null>(null); // Create a reference to the canvas element
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserId(userData.id);
          setUserName(userData.name);
        } else {
          console.error('No such document!');
        }
      } else {
        console.error('No user is logged in');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (qrCodeRef.current && userId) {
      QRCode.toCanvas(qrCodeRef.current, userId, { width: 200 }, (error) => {
        if (error) {
          console.error('Error generating QR code:', error);
        }
      });
    }
  }, [userId]); // Regenerate the QR code when userId changes

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setProfilePic(currentUser.photoURL || "/assets/imgs/profile.png");
      } else {
        history.push('/login');
      }
    });

    return () => unsubscribe();
  }, [history]);

  const uploadToImgBB = async (imageBase64: string) => {
    try {
        const formData = new FormData();
        formData.append("image", imageBase64); // Ensure this matches ImgBB's API format

        const response = await fetch(`https://api.imgbb.com/1/upload?key=ddad287f1a164ed290b5fca1e2cc8269`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || "Upload failed");
        }

        return result.data?.url; // This is the direct image URL
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
};

  useEffect(() => {
    const fetchPicture = async () => {
        const pictureUrl = await getUserProfilePicture();
        setProfilePic(pictureUrl);
    };
    fetchPicture();
}, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="#"></IonBackButton>
            {/* click() => history.push('/home')} */}
          </IonButtons>
          <IonTitle className='profile-head'>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

    <IonContent scrollY={false}>
      <Swiper>
        <SwiperSlide>
          <div className="slide-container1">
            <img src="/assets/imgs/gradBG.jpg" alt="Welcome" className="slide-img1" />

            <div className="top-container">
              <div className="profile-pic-container">
                <IonImg src={profilePic || "https://ionicframework.com/docs/img/demos/avatar.svg"} alt="Profile" className='profile-pic'/>
              </div>
              <h1>{userName ? userName : 'User'}</h1>
            </div>

            <div className="qr-container">
              <canvas ref={qrCodeRef} className="qr-code-canvas" />
            </div>
            <div className="bottom-contain">  
              <IonButton slot="end" shape="round" size="default">
              <IonButton onClick={() => captureAndUploadImage(uploadToImgBB)}>
                <IonIcon icon={cameraOutline} />
                  Upload Profile Picture
                </IonButton>
              </IonButton>
              <IonButton shape="round" size="default" onClick={() => {
                const auth = getAuth();
                auth.signOut().then(() => {
                  history.push('/welcome'); // Redirect to login page after logout
                }).catch((error) => {
                  console.error('Error signing out:', error);
                });
                }} className="logout-button">
                Logout
              </IonButton>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      
    </IonContent>
    </IonPage>
  );
};

export default Profile;
