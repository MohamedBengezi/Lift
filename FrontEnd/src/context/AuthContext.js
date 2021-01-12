import createDataContext from "./createDataContext";
import serverApi from "../api/server";
import { navigate } from "../navigationRef";
import FormData from "form-data";
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebaseApp from "../../firebase";

const apiLink = serverApi.defaults.baseURL;

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "signOut":
      return { errorMessage: "", token: null };
    case "clear_err_msg":
      return {...state, errorMessage:""};
    default:
      return state;
  }
};

const tryLocalSignin = dispatch => async() => {
  const token = await AsyncStorage.getItem('lift-token');
  if (token){
    dispatch({type:'signin', payload:token});
    navigate("Main");
  }else{
    navigate('loginFlow');
  }
}

const clearErrorMessage = dispatch =>() => {
  dispatch({type:'clear_err_msg'});
}

const signup = (dispatch) => {
  return async ({ email, password }) => {
    //  const response = await serverApi.post("/signup", { email, password });
    //  await AsyncStorage.setItem("token", response.data.token);
    //  dispatch({ type: "signup", payload: response.data.token });
    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        let token = response.user.toJSON().stsTokenManager.accessToken;
        let refreshToken = response.user.toJSON().stsTokenManager.refreshToken;
        console.log(token);
        AsyncStorage.setItem("lift-token", token);
        AsyncStorage.setItem("lift-refreshToken",refreshToken);
        dispatch({ type: "signup", payload: token});
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
  return async ({ email, password }) => {
    // Try to signin
    // Handle success by updating state
    // Handle failure by showing error message (somehow)
    console.log("in sigin");
    console.log(email);
    console.log(password);
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        navigate("Main");
      })
      .catch((error) => {
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
    AsyncStorage.removeItem('lift-token');
    AsyncStorage.removeItem('lift-refreshToken');
    dispatch({type:'signOut'});
    firebaseApp.auth().signOut();
    navigate('loginFlow');
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
  { signin, signout, signup, upload, clearErrorMessage,tryLocalSignin},
  { token: null, errorMessage: "" }
);
