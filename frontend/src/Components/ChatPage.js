import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import HttpService from "../services/HttpService";
import { io } from 'socket.io-client';
import { useSelector } from "react-redux";
const socket = io('http://localhost:5003'); // Replace with your backend URL

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
      }
      socket.emit('message', payload); // Send message to backend
      setNewMessage(''); // Clear the input field
    }
  };
  useEffect(() => {
    // Listen for incoming messages from backend
    socket.on('message', (data) => {
      setChatMessage((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off('message');
    };
  }, []);

  // Function to get group Details of specific group using id
  const getChatGroupDetailsById = async () => {
    try {
      const response = await HttpService.getChatGroupDetailsById(id);
      console.log("getChatGroupDetailsById -> ", response.data);
    } catch (error) {
      console.log("Error -> ", error);
    }
  };

  useEffect(() => {
    getChatGroupDetailsById();
    console.log("Mounting chat Page", id);
  }, [props]);

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
    // <div>
    //     {chatMessage && chatMessage?.map((el, i) => {
    //         return (
    //             <div key={i} style={{ background: i % 2 === 0 ? "grey" : "lightgreen", color: i % 2 === 0 ? "white" : "red", textAlign: i % 2 === 0 ? "left" : "right" }}>
    //                 <p>{el}</p>
    //             </div>
    //         );
    //     })}
    //     <form onSubmit={(e) => { e.preventDefault(); sendMessageHandler(); }} style={{ display: 'flex', alignItems: 'center' }}>
    //         <FormControl fullWidth sx={{ m: 1, flexGrow: 1 }}>
    //             <InputLabel htmlFor="outlined-adornment-amount">Text</InputLabel>
    //             <OutlinedInput
    //                 id="outlined-adornment-amount"
    //                 startAdornment={<InputAdornment position="start"></InputAdornment>}
    //                 label="Amount"
    //                 value={newMessage} onChange={newMessageChangeHandler}
    //             />
    //         </FormControl>
    //         <Button type="submit" variant="outlined"><SendIcon /></Button>
    //     </form>

    // </div>
    <div>
      {/* 
      <div
        style={{
          height: "calc(100vh - 100px)",
          overflowY: "auto",
          paddingBottom: "50px",
        }}
      >
        {chatMessage &&
          chatMessage?.map((el, i) => {
            const isSelfUser = el?.userDetails?._id?.toString() === userDetails?._id?.toString();
            const messageStyle = {
              background: isSelfUser ? "lightgreen" : "grey",
              color: isSelfUser ?  "black" : "white",
              textAlign: isSelfUser ?  "right" : "left",
              borderRadius: "10px", // Optional: Adds rounded corners to the message bubbles
              maxWidth: "70%", // Optional: Limits the width of the message bubbles
              alignSelf: isSelfUser ? "flex-start" : "flex-end", // Aligns the messages to the left or right
              marginBottom: "5px", // Adds spacing between messages
              padding: "8px 12px", // Adds padding inside the message bubbles
            };
            const containerStyle = {
              display: "flex",
              justifyContent: isSelfUser ? "flex-end" : "flex-start",
            };
            return (
              <div
                key={i}
                style={containerStyle}
                ref={i == 0 ? messagesStartRef : messagesMiddleRef}
              >
                <div style={messageStyle}>
                  <p style={{ margin: 0 }}>{el.msgBody}</p>
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
      */}
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
              el?.userDetails?._id?.toString() === userDetails?._id?.toString();
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
              chatMessage[i - 1]?.userDetails?._id?.toString();

            return (
              <div
                key={i}
                style={containerStyle}
                ref={i === 0 ? messagesStartRef : messagesMiddleRef}
              >
                {showUsername && (
                  <p
                    style={{
                      margin: "0 0 5px 0",
                      fontWeight: "bold",
                      color: isSelfUser ? "lightgreen" : "grey",
                    }}
                  >
                    {isSelfUser ? "You" : el?.userDetails?.name || "Unknown User"}
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
          <FormControl fullWidth sx={{ m: 1, flexGrow: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Text</InputLabel>
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
          <Button type="submit" variant="outlined">
            <SendIcon />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;

// SCROLLING TO THE BOTTOM OF THE PAGE IS DONE HERE
// -----------------------------------------------------------------------------
// import React, { useEffect, useState, useRef } from "react";
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button'
// import FormControl from '@mui/material/FormControl';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import InputAdornment from '@mui/material/InputAdornment';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import SendIcon from '@mui/icons-material/Send';
// const ChatPage = (props) => {
//     console.log("Props -> ", props);
//     const [chatMessage, setChatMessage] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const messagesEndRef = useRef(null);
//     // Function to hanlde change in new message
//     const newMessageChangeHandler = (event) => {
//         setNewMessage(event.target.value);
//     }

//     // Function send new message to chat
//     const sendMessageHandler = () => {
//         const tempArray = [...chatMessage];
//         tempArray.push(newMessage);
//         setChatMessage(tempArray);
//         setNewMessage("");
//         console.log(newMessage);
//     }

//     useEffect(() => {
//         console.log("Mounting chat Page")
//         let tempArray = [];
//         for (let el of props.MSG_ARR) {
//             tempArray.push(el);
//         }
//         console.log("From Chat Page", tempArray);
//         setChatMessage(tempArray);
//     }, [props])

//     useEffect(() => {
//         scrollToBottom();
//     }, [chatMessage]);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }

//     return (
//         <div>
//             <div style={{ height: "calc(100vh - 100px)", overflowY: "auto", paddingBottom: "50px" }}>
//                 {chatMessage && chatMessage?.map((el, i) => {
//                     return (
//                         <div key={i} style={{ background: i % 2 === 0 ? "grey" : "lightgreen", color: i % 2 === 0 ? "white" : "red", textAlign: i % 2 === 0 ? "left" : "right" }}>
//                             <p>{el}</p>
//                         </div>
//                     );
//                 })}
//                 <div ref={messagesEndRef} />
//             </div>
//             <div style={{ position: "fixed", bottom: 0, left: 249, right: 0, backgroundColor: "white", padding: "10px", borderTop: "1px solid lightgray" }}>
//                 <form onSubmit={(e) => { e.preventDefault(); sendMessageHandler(); }} style={{ display: 'flex', alignItems: 'center' }}>
//                     <FormControl fullWidth sx={{ m: 1, flexGrow: 1 }}>
//                         <InputLabel htmlFor="outlined-adornment-amount">Text</InputLabel>
//                         <OutlinedInput
//                             id="outlined-adornment-amount"
//                             startAdornment={<InputAdornment position="start"></InputAdornment>}
//                             label="Amount"
//                             value={newMessage} onChange={newMessageChangeHandler}
//                             style={{ width: "100%" }} // match the width of the messages container
//                         />
//                     </FormControl>
//                     <Button type="submit" variant="outlined"><SendIcon /></Button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default ChatPage;