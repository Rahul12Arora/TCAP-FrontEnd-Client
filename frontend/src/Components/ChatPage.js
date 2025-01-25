import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import HttpService from "../services/HttpService";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { groupChatSocket } from "../Config/socketConfig";

const ChatPage = (props) => {
	const userDetails = useSelector((state) => state.userDetails);
	const { id } = useParams();
	const [chatMessage, setChatMessage] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const messagesEndRef = useRef(null);
	const messagesStartRef = useRef(null);
	const messagesMiddleRef = useRef(null);

	// Function to hanlde change in new message
	const newMessageChangeHandler = (event) => {
		setNewMessage(event.target.value);
	};

	// Function send new message to chat
	const sendMessageHandler = () => {
		// If message is empty return from here
		if (newMessage === "") return;

		setNewMessage("");
		if (newMessage.trim()) {
			// Payload for backend
			let payload = {
				msgBody: newMessage,
				userDetails: userDetails,
				roomId: props.ROOM_ID,
			};
			let room = props.ROOM_ID;
			if (newMessage && room) {
				// console.log("Room and msg -> ", room, payload.msgBody);
				// socket.emit('JoinRoom', props.ROOM_ID); // Send room name
				groupChatSocket.emit("message", payload);
				// socket.emit("message", { room, payload }); // Send a message to the room
				setNewMessage(""); // Clear the message input
			}
		}
	};
	useEffect(() => {
		// Listen for incoming messages from backend
		// socket.on('message', (data, callback) => {
		//   console.log("Message from backend -> ", data);
		//   setChatMessage((prevMessages) => [...prevMessages, data]);
		//   // Acknowledge message receipt by calling the callback
		//   callback('Message received successfully');
		// });
		// socket.emit('JoinRoom', props.ROOM_ID); // Send room name

		// Listen for incoming messages from the backend
		groupChatSocket.on("message", (data, callback) => {
			console.log("Message received from backend --> ", data);

			// Append the received message to your chat state
			setChatMessage((prevMessages) => [...prevMessages, data]);

			// Acknowledge message receipt by calling the callback
			if (callback) {
				callback("Message received successfully");
			}
		});

		// Cleanup listener on component unmount
		return () => {
			groupChatSocket.off("message");
		};
	}, []);

	// Function to get group Details of specific group using id
	const getChatGroupDetailsById = async (id) => {
		try {
			const response = await HttpService.getChatGroupDetailsById(id);
    //   console.log("response -> ", response);
		} catch (error) {
			console.error("Error -> ", error);
		}
	};

	useEffect(() => {
		getChatGroupDetailsById(id);
		// console.log("Mounting chat Page", id);
	}, [id]);

	useEffect(() => {
		// const messagesEndElement = messagesEndRef.current;
		// const messagesStartElement = messagesStartRef.current;
		// console.log("Message Element -> ", messagesStartElement)
		// if (messagesEndElement) {
		//     const { top, left } = messagesEndElement.getBoundingClientRect();
		//     console.log(`Top: ${top}px, Left: ${left}px`);
		// }
		// if (messagesStartElement) {
		//     const { top, left } = messagesStartElement.getBoundingClientRect();
		//     console.log("------",`Top: ${top}px, Left: ${left}px`);
		// }
		scrollToBottom();
	}, [chatMessage]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div>
			<div
				style={{
					height: "calc(100vh - 100px)",
					overflowY: "auto",
					paddingBottom: "50px",
				}}
			>
				{chatMessage &&
					chatMessage.map((el, i) => {
						const isSelfUser =
							el?.userDetails?._id?.toString() ===
							userDetails?._id?.toString();
						const messageStyle = {
							background: isSelfUser ? "lightgreen" : "grey",
							color: isSelfUser ? "black" : "white",
							textAlign: "left",
							borderRadius: "10px",
							maxWidth: "70%",
							alignSelf: isSelfUser ? "flex-end" : "flex-start",
							marginBottom: "5px",
							padding: "8px 12px",
						};
						const containerStyle = {
							display: "flex",
							flexDirection: "column",
							alignItems: isSelfUser ? "flex-end" : "flex-start",
						};
						const showUsername =
							i === 0 || // Always show for the first message
							el?.userDetails?._id?.toString() !==
								chatMessage[
									i - 1
								]?.userDetails?._id?.toString();

						return (
							<div
								key={i}
								style={containerStyle}
								ref={
									i === 0
										? messagesStartRef
										: messagesMiddleRef
								}
							>
								{showUsername && (
									<p
										style={{
											margin: "0 0 5px 0",
											fontWeight: "bold",
											color: isSelfUser
												? "lightgreen"
												: "grey",
										}}
									>
										{isSelfUser
											? "You"
											: el?.userDetails?.name ||
											  "Unknown User"}
									</p>
								)}
								<div style={messageStyle}>
									<p style={{ margin: 0 }}>{el.msgBody}</p>
								</div>
							</div>
						);
					})}
				<div ref={messagesEndRef} />
			</div>

			{props.ROOM_ID && (
				<div
					style={{
						position: "fixed",
						bottom: 0,
						left: 249,
						right: 0,
						backgroundColor: "transparent",
						padding: "10px",
					}}
				>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							sendMessageHandler();
						}}
						style={{ display: "flex", alignItems: "center" }}
					>
						<FormControl
							fullWidth
							sx={{ m: 1, flexGrow: 1 }}
						>
							<InputLabel htmlFor="outlined-adornment-amount">
								Text
							</InputLabel>
							<OutlinedInput
								id="outlined-adornment-amount"
								startAdornment={
									<InputAdornment position="start"></InputAdornment>
								}
								label="Amount"
								value={newMessage}
								onChange={newMessageChangeHandler}
								style={{ width: "100%" }} // match the width of the messages container
							/>
						</FormControl>
						<Button
							type="submit"
							variant="outlined"
						>
							<SendIcon />
						</Button>
					</form>
				</div>
			)}
		</div>
	);
};

export default ChatPage;
