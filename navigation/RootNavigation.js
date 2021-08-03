import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SignIn from "../screens/SignIn";
import Home from "../screens/Home";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

const RootStack = createStackNavigator();

const Screens = () => {
  const { currentUser } = useAuth();

  return (
    <RootStack.Navigator headerMode="none">
      {currentUser.isSignout ? (
        <RootStack.Screen name="Sign In" component={SignIn} />
      ) : (
        <RootStack.Screen name="Home" component={Home} />
      )}
    </RootStack.Navigator>
  );
};

const RootNavigation = (props) => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Screens />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default RootNavigation;
