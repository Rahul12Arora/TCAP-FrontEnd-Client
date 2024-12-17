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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import CreateIcon from "@mui/icons-material/Create";
import ChatPage from "./ChatPage";
import { json, Link } from "react-router-dom";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";
// import Home from "../Page/Home";
// import About from "../Page/About";
// import Contact from "../Page/Contact";
import { setUserDetails } from "../Redux/Reducer";
import { useDispatch } from "react-redux";
import { TextField, Grid, Paper, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import HttpService from "../services/HttpService";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const SideBar = (props) => {
    const userDetails = useSelector((state) => state.userDetails);
    const [chatMessage, setChatMessage] = useState([]);
    const [openNewChatGroupDialog, setOpenNewChatGroupDialog] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupUsers, setNewGroupUsers] = useState([]);
    const [groupNameArray, setGroupNameArray] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [groupName, setGroupName] = useState("Text");
    // console.log("user Details -> ", userDetails);

    // Function to handle the chat of a group
    const groupNameChangeHandler = (event, el) => {
        setGroupName(el.groupName);
        // console.log("Text", el.groupName);
        let tempArray = [];
        for (let i = 0; i < 20; i++) {
            tempArray.push(el.groupName + " " + i);
        }
        // console.log("Temp Array", tempArray);
        setChatMessage(tempArray);
        // navigate(`/groupChat/${el._id.toString()}`);
    };

    // Function to Logout
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
            console.log("New Group Name -> ", response);
            console.log("New Group Members -> ", newGroupUsers);
            setNewGroupName("");
            setNewGroupUsers([]);
            getAllChatGroups();
            setOpenNewChatGroupDialog(false);
        } catch (error) {
            console.log("Error -> ", error);
        }
    };

    // Function to open new Chat Group dialog
    const handleClickOpenNewChatGroupDialog = async () => {
        try {
            const response = await HttpService.getAllUser();
            console.log("Response -> ", response);
            setActiveUsers(response.data);
            setOpenNewChatGroupDialog(true);
        } catch (error) {
            console.log("Error -> ", error);
        }
    };

    // Function to open new Chat Group dialog
    const handleCloseNewChatGroupDialog = () => {
        setOpenNewChatGroupDialog(false);
    };

    // Function to add users to group
    const addUsersToNewChatGroupHandler = (event, values) => {
        setNewGroupUsers(values);
    };

    // Function to get all chat groups of a user
    const getAllChatGroupOfAUser = async (userId) => {
        try {
            const response = await HttpService.getAllChatGroupOfAUser(userId);
            console.log("All Chat Group 1 -> ", response.data);
            setGroupName(response.data.chatGroups[0].groupName);
            setGroupNameArray(response.data.chatGroups);
        } catch (error) {
            console.log("Error -> ", error);
        }
    }

    // Function to get all chat groups associated with a user
    const getAllChatGroups = async (userId) => {
        try {
            const response = await HttpService.getAllChatGroup();
            console.log("All Chat Group -> ", response.data);
            setGroupName(response.data[0].groupName);
            setGroupNameArray(response.data);
        } catch (error) {
            console.log("Error -> ", error);
        }
    };

    useEffect(() => {
        console.log("Side bar mounted")
        getAllChatGroupOfAUser(userDetails._id);
        console.log(" -> ", userDetails)
    }, []);

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
                        <Typography variant="h6" noWrap component="div">
                            {groupName}
                        </Typography>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: "10px" }}
                            onClick={logOutHandler}
                        >
                            LogOut
                        </Button>
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
                            onClick={(event) => handleClickOpenNewChatGroupDialog()}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <CreateIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Create New Group"} />
                            </ListItemButton>
                        </ListItem>
                        {groupNameArray.map((el, index) => {
                            return (
                                <ListItem
                                    component={Link}
                                    to={`/groupChat/${el._id.toString()}`}
                                    key={index}
                                    disablePadding
                                    onClick={(event) => groupNameChangeHandler(event, el)}
                                    sx={{ textDecoration: "none", color: "inherit" }} // Add this line
                                >
                                    <ListItemButton>
                                        <ListItemIcon>
                                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
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
                        <Route path="/:id" element={<ChatPage MSG_ARR={chatMessage} />} />
                    </Routes>
                </Box>
            </Box>
            <Dialog
                open={openNewChatGroupDialog}
                onClose={handleCloseNewChatGroupDialog}
                fullWidth={true}
                width="sm"
            >
                <DialogTitle>Enter Group Details</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        id="groupName"
                        name="groupName"
                        label="Group Name"
                        type="text"
                        onChange={(event) => setNewGroupName(event.target.value)}
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
                            <TextField {...params} label="Select Users For Group" />
                        )}
                    />
                </FormControl>
                <DialogActions>
                    <Button onClick={handleCloseNewChatGroupDialog}>Close</Button>
                    <Button type="submit" onClick={createNewChatGroupHandler}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SideBar;