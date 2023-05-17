import type { BroadcastMessage, BroadcastMessages } from ".";
import { Console } from "../log";
const console = new Console("Broadcast");

export function broadcast<K extends keyof BroadcastMessages>(
  key: K,
  data: BroadcastMessages[K]
) {
  const msg: BroadcastMessage<K> = { key, type: "broadcast", data };
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (!tab.id) {
        return;
      }
      chrome.tabs.sendMessage(tab.id, msg);
    });
  });
  chrome.runtime.sendMessage(msg);
}

export const BROADCAST_LISTENERS: {
  [K in keyof BroadcastMessages]?: ((data: BroadcastMessages[K]) => void)[];
} = {};
export function handleBroadcast(
  message: BroadcastMessage<keyof BroadcastMessages>
) {
  console.log("Received broadcast from backend", message);
  if (!BROADCAST_LISTENERS[message.key]) {
    return;
  }
  BROADCAST_LISTENERS[message.key]!.forEach((listener) => {
    listener(message.data);
  });
}
export function addBroadcastListener<K extends keyof BroadcastMessages>(
  key: K,
  listener: (data: BroadcastMessages[K]) => void
) {
  if (!BROADCAST_LISTENERS[key]) {
    BROADCAST_LISTENERS[key] = [];
  }
  BROADCAST_LISTENERS[key]!.push(listener);
}
export function removeBroadcastListener<K extends keyof BroadcastMessages>(
  key: K,
  listener: (data: BroadcastMessages[K]) => void
) {
  if (!BROADCAST_LISTENERS[key]) {
    return;
  }
  const index = BROADCAST_LISTENERS[key]!.indexOf(listener);
  if (index === -1) {
    return;
  }
  BROADCAST_LISTENERS[key]!.splice(index, 1);
}
