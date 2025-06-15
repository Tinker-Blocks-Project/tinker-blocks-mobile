import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import Markdown from "react-native-markdown-display"; // ← Add this import
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import createSocket from "../utils/socket"; // This should be a function that returns a new WebSocket

export default function ChatScreen() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket>(createSocket());
    const scrollViewRef = useRef<ScrollView>(null);
    const connectionPulse = useRef(new Animated.Value(1)).current;
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const pulse = () => {
            Animated.sequence([
                Animated.timing(connectionPulse, {
                    toValue: 0.7,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(connectionPulse, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start(() => pulse());
        };
        pulse();
    }, []);

    const setupSocket = (ws: WebSocket) => {
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            setMessages((prev) => [...prev, `Pi: ${data.message}`]);
        };

        ws.onopen = () => {
            console.log("🔌 WebSocket connected");
            setIsConnected(true);
        };

        ws.onclose = () => {
            console.log("❌ WebSocket closed");
            setIsConnected(false);
        };

        ws.onerror = (err) => {
            console.error("⚠️ WebSocket error", err);
            setIsConnected(false);
        };
    };

    useEffect(() => {
        setupSocket(socketRef.current);

        // Check initial connection state
        if (socketRef.current.readyState === WebSocket.OPEN) {
            setIsConnected(true);
        } else if (socketRef.current.readyState === WebSocket.CONNECTING) {
            setIsConnected(false);
        }

        // Periodically check connection status
        const connectionChecker = setInterval(() => {
            const currentState = socketRef.current.readyState;
            const shouldBeConnected = currentState === WebSocket.OPEN;
            setIsConnected(shouldBeConnected);
        }, 1000);

        return () => {
            socketRef.current?.close();
            clearInterval(connectionChecker);
        };
    }, []);

    const ensureSocketOpen = async (): Promise<WebSocket> => {
        const ws = socketRef.current;

        if (ws.readyState === WebSocket.OPEN) {
            setIsConnected(true);
            return ws;
        }

        setIsConnected(false);
        return new Promise((resolve) => {
            const newSocket = createSocket();
            socketRef.current = newSocket;
            setupSocket(newSocket);

            newSocket.onopen = () => {
                console.log("🔁 Reconnected WebSocket");
                setIsConnected(true);
                resolve(newSocket);
            };

            newSocket.onerror = () => {
                setIsConnected(false);
            };
        });
    };

    const sendCommand = async (command: string, message: string) => {
        const ws = await ensureSocketOpen();
        if(command === "run"){
            ws.send(JSON.stringify({"command": "run", "params": {"workflow": "full", "use_hardware": true}}));
        }
        else if(command === "stop"){
            ws.send(JSON.stringify({"command": "stop"}));
        }
        
        setMessages((prev) => [...prev, `You: ${message}`]);
    };

    const sendMessage = async () => {
        if (input.trim()) {
            const ws = await ensureSocketOpen();
            ws.send(JSON.stringify({"command": "run", "params": {"workflow": "assistant", "message": input}}));
            setMessages((prev) => [...prev, `You: ${input}`]);
            setInput("");

            // Auto-scroll to bottom
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const handleRun = () => sendCommand("run", "Sent run command");
    const handleStop = () => sendCommand("stop", "Sent stop command");

    const renderMessage = (msg: string, index: number) => {
        const isUser = msg.startsWith('You:');
        const isSystem = msg.startsWith('Pi:');
        const cleanMessage = isUser ? msg.substring(4) : (isSystem ? msg.substring(3) : msg);
        console.log(cleanMessage);
        return (
            <View key={index} style={[
                styles.messageContainer,
                isUser ? styles.userMessageContainer : styles.aiMessageContainer
            ]}>
                <View style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.aiBubble
                ]}>
                    <Markdown style={markdownStyles}>
                        {cleanMessage}
                    </Markdown>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Tinker Chat</Text>
                    <View style={styles.connectionStatus}>
                        <Animated.View
                            style={[
                                styles.connectionDot,
                                {
                                    backgroundColor: isConnected ? '#4ade80' : '#ef4444',
                                    transform: [{ scale: connectionPulse }]
                                }
                            ]}
                        />
                        <Text style={styles.connectionText}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>💬</Text>
                        <Text style={styles.emptyStateText}>Start a conversation!</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Type a message below or use the action buttons
                        </Text>
                    </View>
                ) : (
                    messages.map(renderMessage)
                )}
            </ScrollView>

            {/* Input Area */}
            <View style={[styles.inputArea, { paddingBottom: Math.max(insets.bottom, 12) }]}>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder="Type your message..."
                        placeholderTextColor="#94a3b8"
                        style={styles.textInput}
                        multiline
                        maxLength={500}
                    />
                    <Pressable
                        onPress={sendMessage}
                        style={({ pressed }) => [
                            styles.sendButton,
                            { opacity: pressed ? 0.7 : 1 }
                        ]}
                        disabled={!input.trim()}
                    >
                        <Text style={[
                            styles.sendButtonText,
                            { color: input.trim() ? "#667eea" : "#cbd5e1" }
                        ]}>
                            ➤
                        </Text>
                    </Pressable>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.actionButton,
                            styles.runButton,
                            { opacity: pressed ? 0.8 : 1 }
                        ]}
                        onPress={handleRun}
                    >
                        <Text style={styles.actionButtonIcon}>▶️</Text>
                        <Text style={styles.actionButtonText}>Run</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.actionButton,
                            styles.stopButton,
                            { opacity: pressed ? 0.8 : 1 }
                        ]}
                        onPress={handleStop}
                    >
                        <Text style={styles.actionButtonIcon}>⏹️</Text>
                        <Text style={styles.actionButtonText}>Stop</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#667eea', // Solid color instead of gradient
        paddingBottom: 15,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    connectionStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    connectionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    connectionText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
    },
    messageContainer: {
        marginVertical: 4,
    },
    userMessageContainer: {
        alignItems: 'flex-end',
    },
    aiMessageContainer: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    userBubble: {
        backgroundColor: '#667eea',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    inputArea: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#f1f5f9',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
        maxHeight: 100,
        paddingVertical: 8,
    },
    sendButton: {
        marginLeft: 8,
        padding: 8,
    },
    sendButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        minWidth: 80,
        justifyContent: 'center',
    },
    runButton: {
        backgroundColor: '#10b981',
    },
    stopButton: {
        backgroundColor: '#ef4444',
    },
    actionButtonIcon: {
        fontSize: 16,
        marginRight: 4,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

const markdownStyles = {
    body: {
        fontSize: 15,
        lineHeight: 22,
        color: '#1e293b',
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 8,
    },
    strong: {
        fontWeight: 'bold',
    },
    em: {
        fontStyle: 'italic',
    },
    code_inline: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 14,
        fontFamily: 'monospace',
    },
    fence: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#667eea',
        marginVertical: 8,
    },
};