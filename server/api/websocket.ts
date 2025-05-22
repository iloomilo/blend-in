const room = 'ROOM'
export default defineWebSocketHandler({
    open(peer) {
        console.log("WebSocket connection opened", peer);
        peer.subscribe(room);
        peer.publish(room, 'Another user joined the chat')
    },
    close(peer, event) {
        console.log("WebSocket connection closed", peer);
    },
    error(peer, error) {
        console.log("WebSocket connection error", peer, error);
    },
    message(peer, message) {
        console.log("WebSocket message received", peer, message);
        peer.publish('ROOM', message.text());
    }
})