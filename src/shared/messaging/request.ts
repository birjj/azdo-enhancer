import type { Messages, RequestMessage, ResponseMessage } from ".";
import { Console } from "../log";
const console = new Console("Messages");

/** Used to keep track of callbacks for messages, filtered by ID */
type Callback<K extends keyof Messages> = (
  data: Messages[K]["response"]
) => void;
const CALLBACKS: {
  [k in keyof Messages]?: {
    [id: number]: {
      progress?: Callback<keyof Messages>;
      final: Callback<keyof Messages>;
      error: (err: string) => void;
    };
  };
} = {};

/** Sends a message to the background script, optionally with a progress callback if backend gives non-final responses */
export async function sendMessage<K extends keyof Messages>(
  key: K,
  value: Messages[K]["request"],
  onProgress?: Callback<K>,
  noToken = false
): Promise<Messages[K]["response"]> {
  const id = Math.floor(Math.random() * 1e9);
  let token: string = "";
  try {
    token = JSON.parse(localStorage.getItem("token")!).data;
    if (!token) {
      throw new Error();
    }
  } catch (e) {
    if (!noToken) {
      throw new Error("No valid login token");
    }
  }

  const outp: Promise<Messages[K]["response"]> = new Promise((res, rej) => {
    if (!CALLBACKS[key]) {
      CALLBACKS[key] = {};
    }
    CALLBACKS[key]![id] = {
      progress: onProgress,
      final: res,
      error: rej,
    };
  });

  const msg: RequestMessage<K> = {
    type: "request",
    key,
    id,
    token,
    ...value,
  };
  console.log("Sending message", msg);
  chrome.runtime.sendMessage(msg);

  return await outp;
}

type Responder<K extends keyof Messages> = (
  data: Messages[K]["request"] & { token: string },
  progressCb: (data: Messages[K]["response"]) => void,
  senderId: number | null
) => Promise<Messages[K]["response"]>;
const RESPONDERS: { [k in keyof Messages]?: Responder<keyof Messages> } = {};

/** Adds a listener in the background script that responds to requests */
export function registerResponder<K extends keyof Messages>(
  key: K,
  responder: Responder<K>
) {
  if (RESPONDERS[key]) {
    throw new Error(`A listener for message key "${key}" already exists`);
  }
  RESPONDERS[key] = responder;
}

export function handleRequest(
  request: RequestMessage<keyof Messages>,
  senderId: number | null
) {
  console.log("Received request", request);
  if (!RESPONDERS[request.key]) {
    console.warn("No listeners for request", request);
    return;
  }
  const sendMessage = (msg: any) => {
    if (senderId === null) {
      chrome.runtime.sendMessage(msg);
    } else {
      chrome.tabs.sendMessage(senderId, msg);
    }
  };

  const onProgress = <K extends keyof Messages>(
    data: Messages[K]["response"]
  ) => {
    const msg: ResponseMessage<K> = {
      ...data,
      type: "response",
      key: request.key as K,
      final: false,
      id: request.id,
    };
    sendMessage(msg);
  };
  RESPONDERS[request.key]!(request, onProgress, senderId)
    .then(<K extends keyof Messages>(data: Messages[K]["response"]) => {
      const msg: ResponseMessage<K> = {
        ...data,
        type: "response",
        key: request.key as K,
        final: true,
        id: request.id,
      };
      sendMessage(msg);
    })
    .catch(<K extends keyof Messages>(err: any) => {
      const msg: ResponseMessage<K> = {
        type: "response",
        key: request.key as K,
        final: false,
        id: request.id,
        error: "" + err,
      };
      sendMessage(msg);
    });
}

export function handleResponse(response: ResponseMessage<keyof Messages>) {
  if (!response) {
    console.warn("Empty response from backend");
    return;
  }
  const key = response.key;
  if (!CALLBACKS[key]) {
    CALLBACKS[key] = {};
  }
  const callbacks = CALLBACKS[key]![response.id];
  if (!callbacks) {
    console.warn("Response received for unknown ID", response);
    return;
  }

  const { error, final, progress } = callbacks;
  let isFinal = false;
  if ("error" in response) {
    error(response.error);
    isFinal = true;
  } else if (response.final) {
    final(response);
    isFinal = true;
  } else {
    progress?.(response);
  }

  if (isFinal) {
    if (!CALLBACKS[key]) {
      CALLBACKS[key] = {};
    }
    delete CALLBACKS[key]![response.id];
  }
}
