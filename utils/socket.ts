export default function createSocket(): WebSocket {
  return new WebSocket("ws://localhost:8765");
}
