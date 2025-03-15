import React, { useState } from 'react';
import { IonPage, IonContent, IonItem, IonInput, IonButton, IonImg, IonText, IonRouterLink } from '@ionic/react';
import { signInWithEmailAndPassword } from "firebase/auth";  // Firebase auth
import { auth } from "../firebaseConfig" // Firebase config
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password!");
      return;
    }

    try {
      // Sign in user with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect user to the home/dashboard page after successful login
      history.push("/home"); // Adjust this path based on your app's routing

      // Clear the input fields (optional)
      setEmail("");
      setPassword("");

    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content" scrollY={false}>
        <div className="login-wrapper">
          <IonImg src="/assets/imgs/logo.png" alt="App Logo" className="app-logoLogin" />

          <IonItem className="input-field">
            <IonInput 
              placeholder="Email"
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value ?? "")}
            />
          </IonItem>

          <IonItem className="input-field">
            <IonInput 
              placeholder="Password"
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value ?? "")}
            />
          </IonItem>

          {error && <IonText color="danger">{error}</IonText>}

          <IonButton expand="full" shape="round" size="large" className="login-button" onClick={handleLogin}>
            Login
          </IonButton>

          <IonText className="signup-text">
            Dont have an account?{' '}
            <IonRouterLink className="signup-link" routerLink="/signup">
              Sign up now.
            </IonRouterLink>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
