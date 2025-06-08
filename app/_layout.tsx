import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#f8fafc' },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="chat" />
            </Stack>
        </View>
    );
}