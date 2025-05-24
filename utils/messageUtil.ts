import type { WebSocketMessage } from "~/types/WebSocketMessage";

export function getMessage(message: WebSocketMessage): string {
  return JSON.stringify(message);
}
