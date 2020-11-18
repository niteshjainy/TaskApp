import React, { Component } from "react";
import "./App.css";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import VideoRecordingPage from "./components/VideoRecordingPage";
import Button from "react-bootstrap/Button";

firebase.initializeApp({
  apiKey: "AIzaSyABOQlTUk2U8DCkOreG5Cs3BweSnjnWVjo",
  authDomain: "taskapp-5dfc1.firebaseapp.com",
});
class App extends Component {
  state = {
    isSignedIn: false,
    user: null,
  };
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",

    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      console.log("logged in");
      this.setState({ isSignedIn: !!user, user: user });
    });
  };
  render() {
    return (
      <div className="App">
        {this.state.isSignedIn ? (
          <div>
            <p>
              {" "}
              welcome {this.state.user.displayName}
              <button
                className="Logout"
                onClick={() => {
                  firebase.auth().signOut();
                  this.setState({ isSignedIn: false, user: null });
                }}
              >
                Logout
              </button>
            </p>
            <VideoRecordingPage />
          </div>
        ) : (
          <div className="App-container">
            <StyledFirebaseAuth
              uiConfig={this.uiConfig}
              firebaseAuth={firebase.auth()}
            />
            <Button
              className="MyButton"
              onClick={() => this.setState({ isSignedIn: true, user: "" })}
            >
              By Pass Login Screen
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
