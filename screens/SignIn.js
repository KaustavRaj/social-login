import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SocialIcon } from "react-native-elements";

import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

const SignIn = (props) => {
  const { signIn } = useAuth();

  const Title = () => {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Sign In</Text>
      </View>
    );
  };

  const googleSignIn = () => signIn("google");

  const facebookSignIn = () => signIn("facebook");

  return (
    <Layout>
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
    </Layout>
  );
};

export default SignIn;

const styles = StyleSheet.create({
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
