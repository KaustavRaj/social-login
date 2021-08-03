import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, ListItem } from "react-native-elements";

import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

const InfoRow = ({ title, value }) => {
  return (
    <ListItem>
      <ListItem.Content>
        <View style={styles.infoRow}>
          <Text style={styles.infoRowTitle}>{title}</Text>
          <Text>{value}</Text>
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

const Home = (props) => {
  const { signOut, currentUser } = useAuth();

  const Title = () => {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Home</Text>
      </View>
    );
  };

  return (
    <Layout>
      <Title />

      <View style={styles.infoContainer}>
        <InfoRow title="Email" value={currentUser.email} />
        <InfoRow title="Name" value={currentUser.name} />
        <InfoRow title="Token" value={currentUser.accessToken} />
      </View>

      <Button title="Sign Out" type="solid" onPress={signOut} />
    </Layout>
  );
};

export default Home;

const styles = StyleSheet.create({
  infoContainer: {
    width: "100%",
    padding: 4,
    marginBottom: 10,
    backgroundColor: "white",
  },
  infoRow: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoRowTitle: {
    fontWeight: "bold",
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
});
