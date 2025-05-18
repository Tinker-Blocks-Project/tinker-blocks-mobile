import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  text: string;
  sender: "user" | "ai";
}

export default function ChatBubble({ text, sender }: Props) {
  const isUser = sender === "user";

  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "80%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userBubble: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#EAEAEA",
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 16,
  },
});
