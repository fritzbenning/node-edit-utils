import { handlePostMessage } from "./handlePostMessage";

export const setupPostMessageListener = () => {
  window.addEventListener("message", (event) => {
    handlePostMessage(event);
  });

  return () => {
    window.removeEventListener("message", (event) => {
      handlePostMessage(event);
    });
  };
};