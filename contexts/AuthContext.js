import React, {
  createContext,
  useMemo,
  useReducer,
  useContext,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";
import * as AuthSession from "expo-auth-session";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    signInProvider: null,
    user: null,
  };

  const reducer = (prevState, action) => {
    switch (action.type) {
      case "RESTORE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          signInProvider: action.signInProvider,
          user: action.user,
        };
      case "SIGN_IN":
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
          signInProvider: action.signInProvider,
          user: action.user,
        };
      case "SIGN_OUT":
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
          signInProvider: null,
          user: null,
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // useEffect(() => {
  //   const fetchLocalToken = async () => {
  //     let storedUserToken = null;
  //     let signInProvider = null;

  //     try {
  //       storedUserToken = await SecureStore.getItemAsync("userToken");
  //       signInProvider = await SecureStore.getItemAsync("signInProvider");
  //       // validate token here
  //     } catch (error) {
  //       // nothing to do here
  //     }

  //     dispatch({
  //       type: "RESTORE_TOKEN",
  //       token: storedUserToken,
  //       signInProvider,
  //     });
  //   };

  //   fetchLocalToken();
  // }, []);

  const signIn = async (signInProvider) => {
    const token = "1afdfc1725299989f888b89a33c6bd2d3fa9728c-2782029430";
    const user = {
      name: "Kaustav Bhattacharjee",
      email: "kaustav.bhattacharjee2000@gmail.com",
    };

    dispatch({ type: "SIGN_IN", token, signInProvider, user });
  };

  const signOut = async () => dispatch({ type: "SIGN_OUT" });

  const memoisedValue = useMemo(
    () => ({
      auth: state,
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
