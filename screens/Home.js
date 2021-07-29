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

const data = {
  token: "1afdfc1725299989f888b89a33c6bd2d3fa9728c-2782029430",
  name: "Kaustav Bhattacharjee",
  email: "kaustav.bhattacharjee2000@gmail.com",
};

const Home = (props) => {
  const { signOut } = useAuth();

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
        <InfoRow title="Email" value={data.email} />
        <InfoRow title="Name" value={data.name} />
        <InfoRow title="Token" value={data.token} />
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
