import React, {
  createContext,
  useMemo,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [linkingURL, setLinkingURL] = useState(null);

  const initialState = {
    isLoading: true,
    isSignout: true,
    accessToken: null,
    tokenExpiryOn: null,
    signInProvider: null,
    email: null,
    name: null,
  };

  const reducer = (prevState, action) => {
    switch (action.type) {
      case "SIGN_IN":
        return {
          ...prevState,
          isLoading: false,
          isSignout: false,
          accessToken: action.accessToken,
          signInProvider: action.signInProvider,
          email: action.email,
          name: action.name,
          tokenExpiryOn: action.tokenExpiryOn,
        };
      case "SIGN_OUT":
        return {
          ...prevState,
          isLoading: false,
          isSignout: true,
          accessToken: null,
          signInProvider: null,
          email: null,
          name: null,
          tokenExpiryOn: null,
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    createLinkingUrl();
    fetchSecureStoreData();
  }, []);

  const getBackendUrl = () => {
    if (__DEV__) {
      return process.env.DEV_BACKEND_URL;
    } else {
      return process.env.PROD_BACKEND_URL;
    }
  };

  const createLinkingUrl = () => {
    let linkingURL = Linking.makeUrl();
    console.log("linkingURL : ", linkingURL);

    setLinkingURL(linkingURL);
  };

  const fetchSecureStoreData = async () => {
    let fetchKeys = [
      "accessToken",
      "signInProvider",
      "email",
      "name",
      "tokenExpiryOn",
    ];
    let storedUserObject = {};

    console.log("fetching...");

    await Promise.all(
      fetchKeys.map((eachKey) =>
        SecureStore.getItemAsync(eachKey).then((value) => {
          storedUserObject[eachKey] = value;
        })
      )
    );

    console.log("fetched stored : ", storedUserObject);

    let expiryOn = storedUserObject.tokenExpiryOn
      ? parseInt(storedUserObject.tokenExpiryOn)
      : 0;

    if (expiryOn > Math.floor(Date.now() / 1000)) {
      dispatch({
        type: "SIGN_IN",
        ...storedUserObject,
      });
    } else {
      dispatch({ type: "SIGN_OUT" });
    }
  };

  const saveToSecureStore = async (userObject) =>
    Promise.all(
      Object.keys(userObject).map((key) =>
        SecureStore.setItemAsync(key, JSON.stringify(userObject[key]))
      )
    );

  const invalidateSecureStore = async () => {
    await SecureStore.setItemAsync("tokenExpiryOn", String(0));
  };

  const addLinkingListener = () => {
    Linking.addEventListener("url", handleRedirectToApp);
  };

  const removeLinkingListener = () => {
    Linking.removeEventListener("url", handleRedirectToApp);
  };

  const handleRedirectToApp = async (event) => {
    if (Constants.platform.ios) {
      WebBrowser.dismissBrowser();
    } else {
      removeLinkingListener();
    }

    let queryParams = Linking.parse(event.url).queryParams;

    let tokenExpiryOn =
      parseInt(queryParams.auth_time) + parseInt(queryParams.expires);

    let userObject = {
      accessToken: queryParams.access_token,
      signInProvider: queryParams.provider,
      email: queryParams.email,
      name: queryParams.name,
      tokenExpiryOn,
    };

    console.log("redirect userObject : ", userObject);

    await saveToSecureStore(userObject);

    dispatch({
      type: "SIGN_IN",
      ...userObject,
    });
  };

  const signIn = async (signInProvider) => {
    let signInURL = `${getBackendUrl()}/login/${signInProvider}`;

    console.log("signInUrl : ", signInURL);

    try {
      addLinkingListener();

      await WebBrowser.openAuthSessionAsync(signInURL);

      if (Constants.platform.ios) {
        removeLinkingListener();
      }
    } catch (error) {
      console.log("Error at signIn() : ", error);
    }
  };

  const signOut = async () => {
    let signOutURL = `${getBackendUrl()}/logout`;

    try {
      const { data } = await axios.get(signOutURL);

      if (!data.success) {
        throw new Error("Failed to signOut from Backend");
      }
    } catch (error) {
      console.log("caught an error at signOut() : ", error);
    } finally {
      await invalidateSecureStore();
      dispatch({ type: "SIGN_OUT" });
    }
  };

  const memoisedValue = useMemo(
    () => ({
      currentUser: state,
      signIn,
      signOut,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={memoisedValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (props) => {
  return useContext(AuthContext);
};
