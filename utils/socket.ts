export default function createSocket(): WebSocket {
  return new WebSocket("ws://192.168.1.18:8765");
}
