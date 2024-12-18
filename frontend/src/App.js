import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Pages/Login";
import SideBar from "./Components/SideBar";
import {
	BrowserRouter as Router,
	Routes,
	Route,
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
				{/* {isLoggedInUser && <SideBar />} */}
				<Routes>
					{isLoggedInUser && (
						<Route
							path="/groupChat/*"
							element={
								<SideBar
									UserLoginHandler={userLoginLogoutHandler}
								/>
							}
						/>
					)}
				</Routes>
			</div>
		</Router>
	);
}

export default App;
