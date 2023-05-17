import { handleBroadcast } from "./broadcast";
import { handleRequest, handleResponse } from "./request";

export { registerResponder, sendMessage } from "./request";
export {
  addBroadcastListener,
  removeBroadcastListener,
  broadcast,
} from "./broadcast";

/** The types of messages we can send back and forth between background and content scripts */
export type Messages = {
  foo: { request: never; response: never };
};

/** The types of messages we can broadcast to all content scripts from the background script */
export type BroadcastMessages = {
  bar: never;
};

export type RequestMessage<K extends keyof Messages> = {
  type: "request";
  key: K;
  id: number;
  token: string;
} & Messages[K]["request"];
export type ResponseMessage<K extends keyof Messages> = {
  type: "response";
  key: K;
  id: number;
  final: boolean;
} & (Messages[K]["response"] | { error: string });
export type BroadcastMessage<K extends keyof BroadcastMessages> = {
  type: "broadcast";
  key: K;
  data: BroadcastMessages[K];
};

/** Listen for responses from the backend and call the relevant callbacks */
chrome.runtime.onMessage.addListener(
  (
    message:
      | RequestMessage<keyof Messages>
      | ResponseMessage<keyof Messages>
      | BroadcastMessage<keyof BroadcastMessages>,
    sender
  ) => {
    switch (message.type) {
      case "response":
        return handleResponse(message);
      // @ts-ignore
      case "request":
        return handleRequest(message, sender.tab ? sender.tab.id! : null);
      case "broadcast":
        return handleBroadcast(message);
    }
  }
);
