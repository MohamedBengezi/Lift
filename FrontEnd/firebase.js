import firebase from "firebase/app";
import "firebase/auth";
import { proc } from "react-native-reanimated";

const firebaseConfig = {
  apiKey: "AIzaSyAxt8pC5E6NeUaqLxi2Lpudf32dJu4IqdU",
  authDomain: "uplift-e96ab.firebaseapp.com",
  databaseURL: "https://uplift-e96ab.firebaseio.com",
  projectId: "uplift-e96ab",
  storageBucket: "uplift-e96ab.appspot.com",
  messagingSenderId: "814435036323",
  appId: "1:814435036323:web:398dad86cb4081a1152316",
  measurementId: "G-7RM09F25F7",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp;
