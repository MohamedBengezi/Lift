import { AsyncStorage } from "react-native";
import createDataContext from "./createDataContext";
import serverApi from "../api/server";
import { navigate } from "../navigationRef";
import FormData from "form-data";
import Axios from "axios";

import firebaseApp from "../../firebase";

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

const signup = (dispatch) => {
  return async ({ email, password }) => {
    //  const response = await serverApi.post("/signup", { email, password });
    //  await AsyncStorage.setItem("token", response.data.token);
    //  dispatch({ type: "signup", payload: response.data.token });
    console.log(email);
    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        navigate("Main");
      })
      .catch((error) => {
        dispatch({
          type: "add_error",
          payload: "Something went wrong with sign up. Reason:" + error.message,
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
