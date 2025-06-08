import { router } from "expo-router";
import { Button, Text, View, StyleSheet, Animated, Pressable, Alert } from "react-native";
import { useEffect, useRef } from "react";

export default function WelcomeScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleGetStarted = () => {
        try {
            console.log("Get Started button pressed!");
            Alert.alert("Navigation", "Navigating to chat screen...");
            router.push("/chat");
        } catch (error) {
            console.error("Navigation error:", error);
            Alert.alert("Error", "Failed to navigate. Error: " + error);
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <View style={styles.logoContainer}>
                    <View style={styles.logo}>
                        <Text style={styles.logoText}>TB</Text>
                    </View>
                </View>

                <Text style={styles.title}>Tinker Blocks</Text>
                <Text style={styles.subtitle}>
                    Build, Create, and Innovate with AI
                </Text>

                {/* Debug: Try both Pressable and Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.startButton,
                        { opacity: pressed ? 0.8 : 1 }
                    ]}
                    onPress={handleGetStarted}
                >
                    <Text style={styles.startButtonText}>Get Started (Pressable)</Text>
                </Pressable>

                <View style={styles.buttonSpacing} />

                <Button
                    title="Get Started (Button)"
                    onPress={handleGetStarted}
                    color="#667eea"
                />

                <View style={styles.decorativeElements}>
                    <View style={[styles.circle, styles.circle1]} />
                    <View style={[styles.circle, styles.circle2]} />
                    <View style={[styles.circle, styles.circle3]} />
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#667eea',
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    logoContainer: {
        marginBottom: 30,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 50,
        lineHeight: 24,
    },
    startButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    startButtonText: {
        color: '#667eea',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonSpacing: {
        height: 20,
    },
    decorativeElements: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    circle: {
        position: 'absolute',
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    circle1: {
        width: 120,
        height: 120,
        top: 100,
        right: -20,
    },
    circle2: {
        width: 80,
        height: 80,
        bottom: 150,
        left: -10,
    },
    circle3: {
        width: 60,
        height: 60,
        top: 200,
        left: 50,
    },
});