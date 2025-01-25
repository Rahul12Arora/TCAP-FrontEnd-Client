
const { groupChatSocket } = require("../Config/socketConfig");

module.exports.joinRoomService = async (payload) => {
    try {
        groupChatSocket.emit("JoinRoom", payload); // Join the specified room
    } catch (error) {
        console.error("Error ->", error);
    }
}