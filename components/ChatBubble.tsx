import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface Props {
  text: string;
  sender: "user" | "ai";
  timestamp?: string;
}

export default function ChatBubble({ text, sender, timestamp }: Props) {
  const isUser = sender === "user";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 50 : -50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
      <Animated.View
          style={[
            styles.messageContainer,
            isUser ? styles.userMessageContainer : styles.aiMessageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
      >
        {!isUser && (
            <View style={styles.avatarContainer}>
              <View style={styles.aiAvatar}>
                <Ionicons name="hardware-chip-outline" size={16} color="#667eea" />
              </View>
            </View>
        )}

        <View style={styles.bubbleContainer}>
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
              {text}
            </Text>
          </View>

          {timestamp && (
              <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
                {timestamp}
              </Text>
          )}
        </View>

        {isUser && (
            <View style={styles.avatarContainer}>
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={16} color="#fff" />
              </View>
            </View>
        )}
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  aiMessageContainer: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginHorizontal: 8,
    justifyContent: "flex-end",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleContainer: {
    maxWidth: "75%",
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#667eea",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: "#1e293b",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 4,
  },
  userTimestamp: {
    color: "#94a3b8",
    textAlign: "right",
  },
  aiTimestamp: {
    color: "#94a3b8",
    textAlign: "left",
  },
});