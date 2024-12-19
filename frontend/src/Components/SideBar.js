import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChatPage from "./ChatPage";
import { Link } from "react-router-dom";
import {
	Routes,
	Route,
	useNavigate,
} from "react-router-dom";
// import Home from "../Page/Home";
// import About from "../Page/About";
// import Contact from "../Page/Contact";
import { setUserDetails } from "../Redux/Reducer";
import { useDispatch } from "react-redux";
import { TextField, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import HttpService from "../services/HttpService";
import { useSelector } from "react-redux";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Slide from "@mui/material/Slide";
import { io } from "socket.io-client";
import config from "../Config";
const socket = io(config.apiUrl); // Replace with your backend URL

const Transition = React.forwardRef(function Transition(props, ref) {
	return (
		<Slide
			direction="up"
			ref={ref}
			{...props}
		/>
	);
});

const drawerWidth = 240;

const SideBar = (props) => {
	const userDetails = useSelector((state) => state.userDetails);
	const [chatMessage, setChatMessage] = useState([]);
	const [openNewChatGroupDialog, setOpenNewChatGroupDialog] = useState(false);
	const [openAddNewMemberInGroupDialog, setOpenAddNewMemberInGroupDialog] =
		useState(false);
	const [activeUsers, setActiveUsers] = useState([]);
	const [newGroupName, setNewGroupName] = useState("");
	const [newGroupUsers, setNewGroupUsers] = useState([]);
	const [groupNameArray, setGroupNameArray] = useState([]);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [selectedGroupDetails, setSelectedGroupDetails] = useState({});
	const [room, setRoom] = useState("");
	const [showGroupMembers, setShowGroupMembers] = useState(false);
	const [chatGroupMembers, setChatGroupMembers] = useState([]);

	// Function to handle change in the selected chat group
	const groupNameChangeHandler = (event, el) => {
		if (el) {
			setRoom(el._id);
			let payload = {
				roomName: el.groupName,
				roomId: el._id,
				oldRoomId: selectedGroupDetails._id,
				userName: userDetails.name,
			};
			socket.emit("JoinRoom", payload); // Join the specified room
		}
		setSelectedGroupDetails(el);
		let tempArray = [];
		for (let i = 0; i < 20; i++) {
			tempArray.push(el.groupName + " " + i);
		}
		setChatMessage(tempArray);
	};

	// Function to handle user logout
	const logOutHandler = () => {
		dispatch(setUserDetails(null));
		localStorage.clear();
		props.UserLoginHandler(false);
		navigate("/");
	};

	// function to create new Group
	const createNewChatGroupHandler = async (event) => {
		try {
			if (newGroupName.trim().length === 0) {
				return alert("Please Enter Group Name");
			}
			if (newGroupUsers.length === 0) {
				return alert("Please Add Group Members");
			}
			let obj = { groupName: newGroupName, createdBy: userDetails._id };
			obj.users = newGroupUsers.map((user) => user._id);
			const response = await HttpService.createNewChatGroup(obj);
            console.log("response -> ", response);
			setNewGroupName("");
			setNewGroupUsers([]);
			getAllChatGroups();
			setOpenNewChatGroupDialog(false);
		} catch (error) {
			console.error("Error -> ", error);
		}
	};

	// Function to open new Chat Group dialog box
	const handleClickOpenNewChatGroupDialog = async () => {
		try {
			const response = await HttpService.getAllUser();
			setActiveUsers(response.data);
			setOpenNewChatGroupDialog(true);
		} catch (error) {
			console.error("Error -> ", error);
		}
	};

	// Function to open new Chat Group dialog
	const handleCloseNewChatGroupDialog = () => {
		setOpenNewChatGroupDialog(false);
	};

	// Function to open dialog box to add new member
	const addGroupMembersHandler = async () => {
		try {
			if (!selectedGroupDetails) {
				alert("No Group Selected");
				return;
			}
			const response = await HttpService.getAllUser();
			const arr = response.data.filter(
				(user) => !selectedGroupDetails.users.includes(user._id)
			);
			setActiveUsers(arr);
			setOpenAddNewMemberInGroupDialog(true);
		} catch (error) {
			console.error("Error -> ", error);
		}
	};

	// Function to close add new member to Chat Group dialog
	const handleCloseAddNewMemberInGroupDialog = () => {
		setOpenAddNewMemberInGroupDialog(false);
	};

	// Function to add users to existing group
	const addUsersToChatGroupHandler = (event, values) => {
		setNewGroupUsers(values);
	};

	// function to create new Group
	const addNewMemberToChatGroupHandler = async (event) => {
		try {
			let payload = { groupId: selectedGroupDetails._id };
			payload.users = newGroupUsers.map((user) => user._id);
			const response = await HttpService.addNewMemberToGroup(payload);
            console.log("response -> ", response);
			setNewGroupName("");
			setNewGroupUsers([]);
			getAllChatGroupOfAUser(userDetails._id);
			setOpenAddNewMemberInGroupDialog(false);
		} catch (error) {
			console.error("Error -> ", error);
		}
	};

	// Function to add users to group
	const addUsersToNewChatGroupHandler = (event, values) => {
		setNewGroupUsers(values);
	};

	// Function to get all chat groups of a user
	const getAllChatGroupOfAUser = async (userId) => {
		try {
			const response = await HttpService.getAllChatGroupOfAUser(userId);
            console.log(response.data)
			setSelectedGroupDetails(response.data.chatGroups[0]);
			setRoom(response?.data?.chatGroups[0]?._id);
			setGroupNameArray(response.data.chatGroups);
		} catch (error) {
			console.error("Error -> ", error);
		}
	};

	// Function to get all chat groups associated with a user
	const getAllChatGroups = async (userId) => {
		try {
			const response = await HttpService.getAllChatGroup();
			setSelectedGroupDetails(response.data[0]);
			setRoom(response.data.chatGroups[0]._id);
			setGroupNameArray(response.data);
		} catch (error) {
			console.error("Error -> ", error);
		}
	};

	// Function to view all group members
	const viewGroupMembersHandler = async () => {
		try {
			const response = await HttpService.getChatGroupDetailsById(
				selectedGroupDetails._id
			);
			setChatGroupMembers(response.data.users);
			setShowGroupMembers(true);
		} catch (error) {
			console.error("Error -> ", error);
		}
	};

	useEffect(() => {
		// console.log("Side bar mounted")
		getAllChatGroupOfAUser(userDetails._id);
		// console.log(" -> ", userDetails)
		socket.on("RoomJoined", (data) => {
			console.log("Message from backend -> ", data);
			// setChatMessage((prevMessages) => [...prevMessages, data]);
			// Acknowledge message receipt by calling the callback
			// callback('Message received successfully');
		});
	}, [userDetails]);

	return (
		<div>
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<AppBar
					position="fixed"
					sx={{
						width: `calc(100% - ${drawerWidth}px)`,
						ml: `${drawerWidth}px`,
					}}
				>
					<Toolbar>
						{/* Group Name */}
						<Typography
							variant="h6"
							noWrap
							component="div"
							sx={{ flexGrow: 1 }}
						>
							{selectedGroupDetails.groupName}
						</Typography>

						{/* Right-side Buttons */}
						<Box sx={{ display: "flex", gap: 2 }}>
							<IconButton
								color="inherit"
								onClick={viewGroupMembersHandler} // Add your handler function
								title="View Group Members"
							>
								<GroupIcon />
							</IconButton>

							<IconButton
								color="inherit"
								onClick={addGroupMembersHandler} // Add your handler function
								title="Add Group Members"
							>
								<PersonAddIcon />
							</IconButton>

							<IconButton
								color="inherit"
								onClick={logOutHandler} // Add your handler function
								title="Log Out"
							>
								<LogoutIcon />
							</IconButton>
						</Box>
					</Toolbar>
				</AppBar>
				<Drawer
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						"& .MuiDrawer-paper": {
							width: drawerWidth,
							boxSizing: "border-box",
						},
					}}
					variant="permanent"
					anchor="left"
				>
					<Toolbar />
					<Divider />
					<List>
						<ListItem
							component={Link}
							key="new-chat-group"
							disablePadding
							onClick={(event) =>
								handleClickOpenNewChatGroupDialog()
							}
							sx={{ textDecoration: "none", color: "inherit" }} // Add this line
						>
							<ListItemButton>
								<ListItemIcon>
									<PersonAddIcon />
								</ListItemIcon>
								<ListItemText primary={"Create New Group"} />
							</ListItemButton>
						</ListItem>
						{groupNameArray.map((el, index) => {
							return (
								<ListItem
									component={Link}
									to={`/groupChat/${el._id.toString()}`}
									key={index + el.groupName}
									disablePadding
									onClick={(event) =>
										groupNameChangeHandler(event, el)
									}
									sx={{
										textDecoration: `${
											selectedGroupDetails?._id?.toString() ===
											el?._id?.toString()
												? ""
												: "none"
										}`,
										color: `${
											selectedGroupDetails?._id?.toString() ===
											el?._id?.toString()
												? ""
												: "inherit"
										}`,
									}} // Add this line
								>
									<ListItemButton>
										<ListItemIcon>
											{index % 2 === 0 ? (
												<GroupIcon />
											) : (
												<PeopleAltIcon />
											)}
										</ListItemIcon>
										<ListItemText primary={el.groupName} />
									</ListItemButton>
								</ListItem>
							);
						})}
					</List>
				</Drawer>
				<Box
					component="main"
					sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
				>
					<Toolbar />
					<Routes>
						<Route
							path="/:id"
							element={
								<ChatPage
									MSG_ARR={chatMessage}
									ROOM_ID={room}
								/>
							}
						/>
					</Routes>
				</Box>
			</Box>
			<Dialog
				open={openNewChatGroupDialog}
				onClose={handleCloseNewChatGroupDialog}
				fullWidth={true}
				width="sm"
				TransitionComponent={Transition}
			>
				<DialogTitle>Enter Group Details</DialogTitle>
				<DialogContent>
					<TextField
						required
						id="groupName"
						name="groupName"
						label="Group Name"
						type="text"
						onChange={(event) =>
							setNewGroupName(event.target.value)
						}
					/>
				</DialogContent>
				<FormControl sx={{ ml: 3, minWidth: 120 }}>
					<Autocomplete
						multiple
						onChange={(e, v) => {
							addUsersToNewChatGroupHandler(e, v);
						}}
						id="combo-box-demo"
						options={activeUsers}
						getOptionLabel={(option) => option.email}
						filterSelectedOptions
						sx={{ width: 300 }}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Select Users For Group"
							/>
						)}
					/>
				</FormControl>
				<DialogActions>
					<Button onClick={handleCloseNewChatGroupDialog}>
						Close
					</Button>
					<Button
						type="submit"
						onClick={createNewChatGroupHandler}
					>
						Create
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openAddNewMemberInGroupDialog}
				onClose={handleCloseAddNewMemberInGroupDialog}
				fullWidth={true}
				width="sm"
				TransitionComponent={Transition}
			>
				<DialogTitle>Add Members To Group</DialogTitle>
				<FormControl sx={{ ml: 3, minWidth: 120 }}>
					<Autocomplete
						multiple
						onChange={(e, v) => {
							addUsersToChatGroupHandler(e, v);
						}}
						id="combo-box-demo"
						options={activeUsers}
						getOptionLabel={(option) => option.email}
						filterSelectedOptions
						sx={{ width: 300 }}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Select Users For Group"
							/>
						)}
					/>
				</FormControl>
				<DialogActions>
					<Button onClick={handleCloseAddNewMemberInGroupDialog}>
						Close
					</Button>
					<Button
						type="submit"
						onClick={addNewMemberToChatGroupHandler}
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
			<Drawer
				open={showGroupMembers}
				onClose={() => setShowGroupMembers(false)}
				anchor={"right"}
			>
				<Box
					sx={{ width: 250 }}
					role="presentation"
					onClick={() => setShowGroupMembers(false)}
				>
					<List>
						{chatGroupMembers.map((member, index) => (
							<ListItem
								key={member._id}
								disablePadding
							>
								<ListItemButton>
									<ListItemIcon>
										<PersonIcon />
									</ListItemIcon>
									<ListItemText primary={member.name} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
		</div>
	);
};

export default SideBar;
