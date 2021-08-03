import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { SocialIcon } from "react-native-elements";

import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

const SignIn = (props) => {
  const { signIn, currentUser } = useAuth();

  const googleSignIn = () => signIn("google-oauth2");

  const facebookSignIn = () => signIn("facebook");

  const Title = () => {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Sign In</Text>
      </View>
    );
  };

  const LoadingScreen = () => (
    <View style={styles.fullscreen}>
      <ActivityIndicator size="large" color="#999999" />
    </View>
  );

  const SignInScreen = () => (
    <View style={styles.main}>
      <Title />
      <SocialIcon
        button
        title="Sign In With Google"
        type="google"
        style={styles.googleSignIn}
        onPress={googleSignIn}
      />
      <SocialIcon
        button
        title="Sign In With Facebook"
        type="facebook"
        style={styles.facebookSignIn}
        onPress={facebookSignIn}
      />
    </View>
  );

  return (
    <Layout>
      {currentUser.isLoading ? <LoadingScreen /> : <SignInScreen />}
    </Layout>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  titleContainer: {
    width: "100%",
    padding: 4,
    marginBottom: 30,
  },
  titleText: {
    color: "hsl(110, 0%, 39%)",
    fontSize: 24,
    textAlign: "center",
  },
  googleSignIn: { width: "100%", marginBottom: 10 },
  facebookSignIn: { width: "100%" },
});
