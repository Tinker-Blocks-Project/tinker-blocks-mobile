import { router } from "expo-router";
import { Button, Text, View } from "react-native";
export default function WelcomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Welcome to the Tinker Blocks
      </Text>
      <Button title="Start" onPress={() => router.push("/chat")} />
    </View>
  );
}
