import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./Pages/Login";
import SideBar from "./Components/SideBar";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

function App() {
	const [isLoggedInUser, setIsLoggedInUser] = useState(false);

	const userLoginLogoutHandler = (value) => {
		try {
			setIsLoggedInUser(value);
		} catch (error) {
			console.error("Error -> ", error);
		}
	};

	useEffect(() => {
		if (!localStorage.getItem("TOKEN_KEY")) {
			setIsLoggedInUser(false);
		} else {
			setIsLoggedInUser(true);
		}
	}, []);
	return (
		<Router>
			<div className="App">
				{!isLoggedInUser && (
					<Login UserLoginHandler={userLoginLogoutHandler} />
				)}
				{isLoggedInUser && <SideBar />}
			</div>
		</Router>
	);
}

export default App;
