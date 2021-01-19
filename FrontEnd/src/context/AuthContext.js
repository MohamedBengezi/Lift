import { AsyncStorage } from "react-native";
import createDataContext from "./createDataContext";
import serverApi from "../api/server";
import { navigate } from "../navigationRef";
import FormData from "form-data";
import Axios from "axios";

import { firebaseApp,functions } from "../../firebase";

const apiLink = serverApi.defaults.baseURL;

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signup":
      return { errorMessage: "", token: action.payload };
    default:
      return state;
  }
};

//calls firebase function to check if the userName requested by the user already exists in the database. 
function goAuthenticate (email,password,dispatch)  {
  firebaseApp
  .auth()
  .createUserWithEmailAndPassword(email, password)
  .then((user) => {
    navigate("Main");
  })
  .catch((error) => {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign up. Reason:" + error.message,
    });
  });
  }


const signup = (dispatch) => {
  return async ({ username, email, password }) => {
    //  const response = await serverApi.post("/signup", { email, password });
    //  await AsyncStorage.setItem("token", response.data.token);
    //  dispatch({ type: "signup", payload: response.data.token });
    console.log(email);
    functions.useEmulator("10.0.2.2",5001);
    var userNameExists = functions.httpsCallable('user-userNameExists');
    userNameExists({username:username})
    .then((result) => {
      var exists = result.data.userNameExists;
      console.log(`userNameExists ${exists}`);
      if(exists){
        //dispatch error to let user know to enter another user name. 
        dispatch({
          type: "add_error",
          payload: "User name already exists. Please enter another one",
        });
      } else{
        goAuthenticate(email,password,dispatch);
      }
    })
    .catch((error) => {
      var code = error.code;
      var message = error.message;
      var details = error.details;
      console.error(`${code} \n ${message} \n ${details}`);
      //dispatch meaningful error to user
      dispatch({
        type: "add_error",
        payload: "Something went wrong. Please try again.",
      });
    });
    console.log("in signup");
  };
};

const signin = (dispatch) => {
  return ({ email, password }) => {
    // Try to signin
    // Handle success by updating state
    // Handle failure by showing error message (somehow)
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        navigate("Main");
      })
      .catch((error) => {
        console.log("ERROR: Failed to log in");
        dispatch({
          type: "add_error",
          payload: "Something went wrong with sign in. Reason:" + error.message,
        });
      });
  };
};

const signout = (dispatch) => {
  return () => {
    // somehow sign out!!!
    firebaseApp.auth().signOut();
  };
};

const upload = (dispatch) => async ({ image, video }) => {
  try {
    const body = new FormData();
    let fileUri;
    if (image != null) {
      fileUri = image.uri;
    } else if (video != null) {
      fileUri = video.uri;
    }
    body.append("myFile", {
      uri: fileUri,
      type: "image/jpeg",
      name: "myFile",
    });

    const response = await sendXmlHttpRequest(body);
    console.log(response);
  } catch (err) {
    console.log(err);
    dispatch({
      type: "add_error",
      payload: "Something went wrong with upload ",
    });
  }
};

function sendXmlHttpRequest(data) {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject("Request Failed");
      }
    };
    xhr.open("POST", `${apiLink}/upload`);
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(data);
  });
}


export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, upload },
  { token: null, errorMessage: "" }
);
