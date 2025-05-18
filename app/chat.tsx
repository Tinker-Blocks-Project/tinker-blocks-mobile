import React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import socket from "../utils/socket";

export default function ChatScreen() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, `Pi: ${event.data}`]);
    };
    return () => {
      socket.onmessage = null;
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.send(input);
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  const handleRun = () => {
    socket.send(JSON.stringify({ command: "run" }));
    setMessages((prev) => [...prev, "You: Sent run command"]);
  };

  const handleStop = () => {
    socket.send(JSON.stringify({ command: "stop" }));
    setMessages((prev) => [...prev, "You: Sent stop command"]);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ScrollView style={{ flex: 1, marginBottom: 10 }}>
        {messages.map((msg, index) => (
          <Text key={index} style={{ marginVertical: 4 }}>
            {msg}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type your message"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <Button title="Send" onPress={sendMessage} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Button title="Run" onPress={handleRun} />
        <Button title="Stop" onPress={handleStop} />
      </View>
    </View>
  );
}
