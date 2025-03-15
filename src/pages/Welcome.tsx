import React from 'react';
import { IonContent, IonButton, IonPage, IonText, IonImg, IonIcon } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { arrowForwardOutline } from 'ionicons/icons';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './Welcome.css'; // Import your custom CSS file
import { useHistory } from 'react-router-dom';

const Welcome: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonContent fullscreen={true} className="welcome-content" scrollY={false}>
        <Swiper>
          <SwiperSlide>
            <div className="slide-container">
              <img src="/assets/imgs/welcomeScreen.png" alt="Welcome" className="slide-img" />
              <div className="logo-container">
                <IonImg src="/assets/imgs/logo.png" alt="App Logo" className="app-logo" />
              </div>

              {/* Bottom Section */}
              <div className="bottom-section">
                <IonText className="slide-text">
                  <h1>A Smarter Way To Find Your Friends</h1>
                </IonText>
                <IonButton expand="full" className="get-started-button" shape="round" size="large" onClick={() => history.push('/login')}>
                  Get Started
                  <IonIcon slot="end" icon={arrowForwardOutline}></IonIcon>
                </IonButton>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;


