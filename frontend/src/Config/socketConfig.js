import { io } from "socket.io-client";

export const dmChatSocket = io('/dmchat', { autoConnect: false });
export const groupChatSocket = io('/groupChat', { autoConnect: false });
export const notificationSocket = io('/notification', { autoConnect: false });

// // plain object
// const socket = io({
//     auth: {
//       token: "abc"
//     }
//   })