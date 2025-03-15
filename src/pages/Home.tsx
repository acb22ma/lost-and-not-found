import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonButtons, IonButton, IonIcon, IonImg, IonAlert, IonFooter, IonModal } from '@ionic/react';
import { add, heartDislike, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { doc, getDoc } from 'firebase/firestore';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { auth, db } from '../firebaseConfig'; // Import Firebase config
import { addFriend, removeFriend } from '../actions/friends';
import { loadLottieAnimation } from '../actions/animations';
import {startUWBScanning} from '../actions/bluetooth';  // Import the scan function
import 'animate.css'; //for entrance animations
import './Home.css';
import { AnimationItem } from 'lottie-web';

const Home: React.FC = () => {
    const history = useHistory();
    const [friends, setFriends] = useState<{ id: string; name: string; picture: string; since: string }[]>([]);
    const [scannedFriend, setScannedFriend] = useState<{ id: string; name: string; picture: string } | null>(null);
    const modal = useRef<HTMLIonModalElement>(null);

    const startScan = async () => {
        try {
            const result = await CapacitorBarcodeScanner.scanBarcode({
                hint: 0,
                cameraDirection: 1
            });

            console.log("Scanned Result:", result.ScanResult);
            const friendDocRef = doc(db, "users", result.ScanResult);
            const friendSnap = await getDoc(friendDocRef);

            if (friendSnap.exists()) {
                setScannedFriend({
                    id: friendSnap.id,
                    name: friendSnap.data().name,
                    picture: friendSnap.data().picture || "https://ionicframework.com/docs/img/demos/card-media.png"
                });
                modal.current?.present(); // Open modal after scanning
            } else {
                console.error("Friend not found");
            }
        } catch (error) {
            console.error("Scanning error:", error);
        }
    };

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const userDocRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userDocRef);

                if (userSnap.exists()) {
                    const { friends: friendsArray } = userSnap.data();
                    const friendsData = await Promise.all(
                        friendsArray.map(async (friendId: string) => {
                            const friendDocRef = doc(db, "users", friendId);
                            const friendSnap = await getDoc(friendDocRef);
                            return friendSnap.exists()
                                ? {
                                    id: friendSnap.id,
                                    name: friendSnap.data().name,
                                    picture: friendSnap.data().picture || "https://ionicframework.com/docs/img/demos/card-media.png",
                                    since: friendSnap.data().since || "Unknown"
                                }
                                : null;
                        })
                    );

                    setFriends(friendsData.filter(Boolean));
                }
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        fetchFriends();
    }, []);

    useEffect(() => {
        let animationInstance: AnimationItem | undefined; // Store the animation instance
        console.log("Mounting animation..."); // Debugging
        const loadAnimation = async () => {
            if (!document.getElementById("lottie-container")?.childNodes.length) {
              animationInstance = await loadLottieAnimation("lottie-container", "../assets/animations/phoneFind.json");
            }
          };
    
        loadAnimation();// Call the function
        if (animationInstance) {
            animationInstance.destroy();
          } 
        
        return () => {
            console.log("Destroying animation..."); // Debugging
          if (animationInstance) {
            animationInstance.destroy(); // Destroy animation on unmount
          }

        };
      }, []); // Run only once

      useEffect(() => {
        const button = document.getElementById('searchForFriendsBtn');
        if (button) {
          button.addEventListener('click', startUWBScanning);
        }
        
        return () => {
          if (button) {
            button.removeEventListener('click', startUWBScanning);  // Cleanup
          }
        };
      }, []);
      
      

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="header-toolbar">
                    <IonImg src="/assets/imgs/logo.png" alt="App Logo" className="app-logoHome" />
                    <IonButtons slot="end">
                        <IonButton onClick={() => history.push('/profile')}>
                            <IonIcon icon={personCircleOutline} className='icon-large' />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" scrollY={false}>
                <h1>Friends</h1>
                <Swiper spaceBetween={5} slidesPerView={1.5}>
                    {friends.length > 0 ? (
                        friends.map((friend) => (
                            <SwiperSlide key={friend.id}>
                                <div className='friend-card'>
                                    <IonImg src={friend.picture} alt={friend.name} className="friend-img" />
                                    <h3>{friend.name}</h3>
                                    <IonButton id={`remove-alert-${friend.id}`} size="small" shape='round'>
                                      <IonIcon slot="start" icon={heartDislike}></IonIcon>
                                      Remove Friend
                                    </IonButton>
                                    <IonAlert
                                      cssClass='custom-alert'
                                      header="Are you sure you want to remove friend?"
                                      trigger={`remove-alert-${friend.id}`}
                                      buttons={[
                                        {
                                          text: 'No',
                                          role: 'cancel',
                                          handler: () => {
                                            console.log('Alert canceled');
                                          },
                                        },
                                        {
                                          text: 'Yes',
                                          role: 'confirm',
                                          handler: () => removeFriend(friend.id, setFriends),
                                        },
                                      ]}
                                      onDidDismiss={({ detail }) => console.log(`Dismissed with role: ${detail.role}`)}
                                    ></IonAlert>
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        <p>No friends found</p>
                    )}
                </Swiper>

                <IonButton onClick={startScan} expand="block" shape='round'>
                    Add Friends
                </IonButton>
                <IonModal 
                    ref={modal} 
                    initialBreakpoint={1} 
                    breakpoints={[0, 1]}
                >
                    <div className="qr-scanner-container">
                        {scannedFriend ? (
                            <>
                                <div className="pic-container">
                                    <IonImg src={scannedFriend.picture} alt={scannedFriend.name} className='friend-profPic'/>
                                </div>
                                <h3>{scannedFriend.name}</h3>
                                <IonButton onClick={() => {
                                    addFriend(scannedFriend.id, setFriends);
                                    modal.current?.dismiss();
                                }}>Add Friend</IonButton>
                            </>
                        ) : (
                            <p>Scanning...</p>
                        )}
                    </div>
                </IonModal>
            </IonContent>
            <IonFooter class='search-footer'>
                <div id="lottie-container" className="lottie-container"></div>
                <IonButton expand="block" shape='round' className='search' id='searchForFriendsBtn'>Search For Friends</IonButton>
            </IonFooter>
        </IonPage>
    );
};

export default Home;
