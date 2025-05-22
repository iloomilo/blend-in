import type { WebSocketMessage } from "~/types/WebsocketMessage";

export function getMessage(message: WebSocketMessage): string {
  return JSON.stringify(message);
}
