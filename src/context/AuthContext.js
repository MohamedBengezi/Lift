import { AsyncStorage } from "react-native";
import createDataContext from "./createDataContext";
import serverApi from "../api/server";
import { navigate } from "../navigationRef";

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

const signup = (dispatch) => async ({ video }) => {
  try {
    //  const response = await serverApi.post("/signup", { email, password });
    //  await AsyncStorage.setItem("token", response.data.token);
    //  dispatch({ type: "signup", payload: response.data.token });
    console.log("in signup");
    navigate("Main");
  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign up",
    });
  }
};

const signin = (dispatch) => {
  return ({ email, password }) => {
    // Try to signin
    // Handle success by updating state
    // Handle failure by showing error message (somehow)
  };
};

const signout = (dispatch) => {
  return () => {
    // somehow sign out!!!
  };
};

const upload = (dispatch) => async ({ video }) => {
  try {
    console.log("In upload");
    const fileUri = video.uri;
    const response = await serverApi.post("/upload", { myFile: fileUri });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signup", payload: response.data.token });
  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with upload",
    });
  }
};
export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, upload },
  { token: null, errorMessage: "" }
);
