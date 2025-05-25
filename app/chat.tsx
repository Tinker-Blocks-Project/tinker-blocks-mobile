import React, {useEffect, useRef, useState} from "react";
import {Button, ScrollView, Text, TextInput, View} from "react-native";
import createSocket from "../utils/socket"; // This should be a function that returns a new WebSocket
import Markdown from "react-native-markdown-display"; // ← Add this import

export default function ChatScreen() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const socketRef = useRef<WebSocket>(createSocket());

    const setupSocket = (ws: WebSocket) => {
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, `Pi: ${data.message}`]);
        };

        ws.onopen = () => {
            console.log("🔌 WebSocket connected");
        };

        ws.onclose = () => {
            console.log("❌ WebSocket closed");
        };

        ws.onerror = (err) => {
            console.error("⚠️ WebSocket error", err);
        };
    };

    useEffect(() => {
        setupSocket(socketRef.current);

        return () => {
            socketRef.current?.close();
        };
    }, []);

    const ensureSocketOpen = async (): Promise<WebSocket> => {
        const ws = socketRef.current;

        if (ws.readyState === WebSocket.OPEN) return ws;

        return new Promise((resolve) => {
            const newSocket = createSocket();
            socketRef.current = newSocket;
            setupSocket(newSocket);

            newSocket.onopen = () => {
                console.log("🔁 Reconnected WebSocket");
                resolve(newSocket);
            };
        });
    };

    const sendCommand = async (command: string, message: string) => {
        const ws = await ensureSocketOpen();
        ws.send(JSON.stringify({command}));
        setMessages((prev) => [...prev, `You: ${message}`]);
    };

    const sendMessage = async () => {
        if (input.trim()) {
            const ws = await ensureSocketOpen();
            ws.send(input);
            setMessages((prev) => [...prev, `You: ${input}`]);
            setInput("");
        }
    };

    const handleRun = () => sendCommand("run", "Sent run command");
    const handleStop = () => sendCommand("stop", "Sent stop command");

    return (
        <View style={{flex: 1, padding: 16}}>
            <ScrollView style={{flex: 1, marginBottom: 10}}>
                {messages.map((msg, index) => (
                    <Markdown key={index} style={{body: {marginVertical: 4, fontSize: 16}}}>
                        {msg}
                    </Markdown>
                ))}
            </ScrollView>
            <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type your message"
                style={{borderWidth: 1, padding: 8, marginBottom: 10}}
            />
            <Button title="Send" onPress={sendMessage}/>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                }}
            >
                <Button title="Run" onPress={handleRun}/>
                <Button title="Stop" onPress={handleStop}/>
            </View>
        </View>
    );
}
