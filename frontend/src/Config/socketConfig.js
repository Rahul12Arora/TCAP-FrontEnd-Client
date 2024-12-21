import { io } from "socket.io-client";
import config from "../Config/index";

export const dmChatSocket = io(`${config.apiUrl}/dmchat`, { autoConnect: true });
export const groupChatSocket = io(`${config.apiUrl}groupChat`, { autoConnect: true });
export const notificationSocket = io(`${config.apiUrl}/notification`, { autoConnect: true });

// // plain object
// const socket = io({
//     auth: {
//       token: "abc"
//     }
//   })