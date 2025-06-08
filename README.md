# 🧩 Tinker Blocks

A modern React Native Expo application that enables seamless communication with AI through WebSocket connections. Built with beautiful UI design and smooth animations using only built-in React Native components.

## ✨ Features

- **🎨 Modern UI Design**: Beautiful solid color backgrounds, smooth animations, and intuitive interface
- **💬 Real-time Chat**: WebSocket-powered communication with AI
- **🔄 Connection Status**: Live connection monitoring with visual indicators
- **📱 Responsive Design**: Optimized for both iOS and Android devices
- **🎯 Command Controls**: Dedicated Run/Stop action buttons
- **📝 Markdown Support**: Rich text rendering for AI responses
- **⚡ Smooth Animations**: Engaging transitions and micro-interactions
- **🚀 Zero Extra Dependencies**: Uses only built-in React Native components

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tinker-blocks
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure WebSocket Connection**

   Update the WebSocket URL in `utils/socket.ts`:
   ```typescript
   export default function createSocket(): WebSocket {
     return new WebSocket("ws://YOUR_SERVER_IP:PORT");
   }
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device**
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or press 'i' for iOS simulator, 'a' for Android emulator

## 📱 Screenshots

### Welcome Screen
- Animated logo with smooth transitions
- Modern solid color background with decorative elements
- Professional call-to-action button

### Chat Interface
- Real-time connection status indicator with pulsing animation
- Message bubbles with emoji avatars
- Action buttons for Run/Stop commands
- Markdown rendering for rich content
- Auto-scroll to latest messages

## 🏗️ Project Structure

```
tinker-blocks/
├── app/
│   ├── index.tsx          # Welcome screen
│   ├── chat.tsx           # Main chat interface
│   └── _layout.tsx        # App navigation layout
├── components/
│   └── ChatBubble.tsx     # Enhanced message bubble component
├── screens/
│   ├── WelcomeScreen.tsx  # Legacy welcome screen
│   └── ChatScreen.tsx     # Legacy chat screen
├── utils/
│   └── socket.ts          # WebSocket connection utility
├── App.tsx                # Root app component
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: `#667eea`
- **Success**: `#10b981` (Run button)
- **Danger**: `#ef4444` (Stop button)
- **Background**: `#f8fafc`
- **Text Primary**: `#1e293b`
- **Text Secondary**: `#64748b`

### Typography
- **Headers**: Bold, 20-32px
- **Body**: Regular, 15-16px
- **Captions**: 11-12px

### Animations
- **Fade-in**: 300-1000ms duration
- **Scale**: Spring animation with tension: 50, friction: 7
- **Slide**: Smooth translateX animations
- **Pulse**: Connection status indicator

## 🔧 Configuration

### WebSocket Setup

The app connects to a WebSocket server for real-time communication. Configure your server endpoint in `utils/socket.ts`:

```typescript
export default function createSocket(): WebSocket {
  return new WebSocket("ws://192.168.1.18:8765");
}
```

### Message Protocol

The app expects JSON messages in the following format:

**Outgoing Messages:**
```json
{
  "command": "run|stop"
}
```
or plain text for chat messages.

**Incoming Messages:**
```json
{
  "message": "AI response text here"
}
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start

# Start with specific platform
npm run ios
npm run android
npm run web

# Build for production
npm run build
```

### Code Style

- Use TypeScript for type safety
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Use only built-in React Native components

## 📦 Core Dependencies

- **expo**: ~50.0.0 - Expo SDK
- **react**: 18.2.0 - React library
- **react-native**: 0.73.0 - React Native framework
- **expo-router**: ~3.4.0 - File-based routing
- **react-native-markdown-display**: ^7.0.2 - Markdown rendering
- **react-native-safe-area-context**: 4.8.2 - Safe area handling

## 🚨 Troubleshooting

### Common Issues

**WebSocket Connection Failed**
- Verify the server IP and port in `utils/socket.ts`
- Ensure your device and server are on the same network
- Check if the WebSocket server is running

**Build Errors**
- Clear cache: `npx expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo CLI: `npm install -g @expo/cli@latest`

**Animation Performance**
- All animations use `useNativeDriver: true` for optimal performance
- Test on physical devices for accurate performance metrics

## 🎯 Key Features

### No External UI Dependencies
This project is designed to work with minimal dependencies, using only:
- Built-in React Native components
- Emoji icons instead of icon libraries
- Solid colors instead of gradient libraries
- Native animations using Animated API

### Performance Optimized
- All animations use native driver
- Efficient re-rendering with proper state management
- Minimal bundle size
- Fast startup time

### Cross-Platform Compatibility
- Works on both iOS and Android
- Responsive design for different screen sizes
- Platform-specific optimizations where needed

## 🤝 Contributing

1. **Fork the repository**