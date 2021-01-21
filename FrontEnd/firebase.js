import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/app";
import firebaseFunctions from "firebase/functions";
import "firebase/auth";
import "firebase/storage";
const property = require("./src/property.json");

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

export const firebaseApp = firebase.initializeApp(firebaseConfig);
let f1 = firebase.functions(firebaseApp);
if(property.useEmulator){
  f1.useEmulator("10.0.2.2", 5001);
}
export const functions = f1;
/**
 * Uploads media content the Firebase Cloud storage
 *
 * @param {string} mediaURI The URI of the file to upload
 * @param {string} uid The firebase unique id from the authentication service
 * @return {Promise<string>} The full path of the uploaded content on cloud storage. The path can be used to fetch the
 * resource again.
 */
export const uploadMedia = async (mediaURI, uid) => {
  // Fetch blob representation of media from URI
  const media = await fetch(mediaURI);
  const blob = await media.blob();

  //Create firebase reference
  let ref = firebaseApp.storage().ref();
  let path = `public/feedback_posts/${uid}/${uuidv4()}`;

  ref = ref.child(path);
  await ref.put(blob);

  return path;
};

/**
 * Downloads a media file from Firebase cloud storage
 *
 * @param {string} path The URI of the file to upload
 * @return {string} The URL to the resource. This URL can be used as the source for a <image> or <video>
 * component.
 */
export const downloadMedia = async (path) => {
  // Create firebase reference
  const ref = firebaseApp.storage().ref(path);
  const downloadUrl = await ref.getDownloadURL();

  return downloadUrl;
};

/**
 * Upload the profile picture to the Firebase Cloud
 * @param {*} mediaURI 
 * @param {*} uid 
 */
export const uploadProfilePict = async(mediaURI, uid) => {
  const media = await fetch(mediaURI);
  const blob = await media.blob();

  //Create firebase reference
  let ref = firebaseApp.storage().ref();
  let path = `public/profile/${uid}/${uuidv4()}`;

  ref = ref.child(path);
  await ref.put(blob);

  return path;
}

