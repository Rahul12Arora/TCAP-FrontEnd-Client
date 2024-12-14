import React, { useState, useEffect, useCallback } from "react";
import logo from "../../logo.svg";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { setUserDetails, saveToken } from "../../Redux/Reducer";
// import { Redirect, Link } from "react-router-dom";
// import { isLogin, setAuthToken } from '../../utils';
// import './index.css';
import HttpService from "../../services/HttpService";
import { useDispatch } from "react-redux";
// import { setLoading, setSnackInfo } from '../../redux/actions/appAction';
// import { connect } from "react-redux";
// import { setUserDetails } from '../../redux/actions/userAction'
// import { useHistory } from 'react-router-dom';

// import decorpotLogo from '../../assets/img/org/latestDecorpot.png'
// import decorpotLogo from '../../assets/img/org'

const useStyles = makeStyles({
	mainContainer: {
		display: "flex",
		justifyContent: "center" /* Centers horizontally */,
		alignItems: "center" /* Centers vertically */,
		height: "100vh" /* Takes full viewport height */,
		textAlign:
			"center" /* Ensures text and children are centered as well */,
		backgroundColor: " #62636e",
		animation: "colorChange 10s infinite alternate" /* Apply animation */,
	},
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		// height: '100vh', // Make container full height of the viewport
		backgroundColor: "#2C2E3E",
		padding: "4rem",
		color: "white", // Set text color to white
		borderRadius: "10px",
	},
	form: {
		width: "100%", // Make form width 100% of its container
		maxWidth: "300px", // Limit form width for larger screens
		textAlign: "center", // Center align form elements
	},
	input: {
		// color: 'white',
		borderBottom: "1px solid #fff",
		borderRadius: "50px",
		marginBottom: "5%",
		height: "40px",
		padding: "0 15px", // Increase padding for better mobile responsiveness
		width: "calc(100% - 30px)", // Make input width responsive
		maxWidth: "calc(300px - 30px)", // Limit input width for larger screens
	},
	loginButton: {
		backgroundColor: "white",
		color: "#2c2e3e",
		margin: "20px auto", // Center button horizontally with some vertical margin
		padding: "10px 20px",
		borderRadius: "50px",
		"&:hover": {
			backgroundColor: "#3f51b5",
			color: "white",
		},
	},
});

const Login = (props) => {
    const dispatch = useDispatch();
	const classes = useStyles();
	// const history = useHistory()
	const [isLoginPage, setIsLoginPage] = useState(true);


	const [formValue, setFormValue] = useState({
		email: "",
		password: "",
        name: "",
	});
	const { name, email, password } = formValue;

	const onChange = (e) => {
		setFormValue({ ...formValue, [e.target.name]: e.target.value });
	};

	const onSubmit = useCallback(async () => {
		// props.setLoading(true)
		try {
			let isEmailValid = email.match(
				/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
			);
			if (isEmailValid) {
				console.log("email is", email);
				if (isLoginPage) {
					// / props.setLoading(false)

					console.log("Using as login page", email);
					// console.log('Password', password);

					// history.push('/changePassword');
					// return

					if (!localStorage.getItem("TOKEN_KEY")) {
						const response = await HttpService.userLogin(formValue);
                        dispatch(setUserDetails(response.data.user));
                        dispatch(saveToken(response.data.token));
						console.log("response -> ", response);
                        localStorage.setItem('TOKEN_KEY', response.data.token);
                        if(response.data.token){
                            props.UserLoginHandler(true);
                        }else{
                            props.UserLoginHandler(false);
                        }

						// console.log('response', response)

						// if (response.status == 202) {

						//     history.push('/changePassword');

						//     // props.setSnackInfo(response.data.message, "warning")

						//     return

						// }

						// const cacheUpdateResult = await HttpService.updateUserCacheById(response.data.userDetails._id);
						//update locally as well
						// if (cacheUpdateResult.data == 'ok') {
						//     response.data.userDetails.cacheClearRequired = false;
						//     console.log('response.data', response.data)
						// }

						// let user = response.data.userDetails

						// console.log('user', user)

						// let MyLastPasswordCreationDate = new Date(user.LastPasswordCreationDate)

						// console.log('MyLastPasswordCreationDate', MyLastPasswordCreationDate)

						// let CurrentDate = new Date()

						// console.log('CurrentDate', CurrentDate)

						// let timeDifference = CurrentDate.getTime() - MyLastPasswordCreationDate.getTime();

						// console.log('timeDifference', timeDifference)

						// let DaysRemainingToChangePassword = 90 - (Math.floor(timeDifference / (1000 * 60 * 60 * 24)))

						// console.log('DaysRemainingToChangePassword', DaysRemainingToChangePassword)

						// if (DaysRemainingToChangePassword < 1) {

						//     history.push('/changePassword');

						//     return

						// }

						// setAuthToken(response.data.token)

						localStorage.setItem('TOKEN_KEY', response.data.token);

						// await HttpService.updateUserCacheById(user._id);

						// if (response.data.userDetails.experienceCenterId.length !== 1) {

						// props.setUserDetails(response.data.userDetails)

						//NEW FLOW
						// props.setUserDetails({
						//     ...response.data.userDetails,
						//     selectedExpCenter: response.data.userDetails.experienceCenterId,
						//     selectedLocation: response.data.userDetails.locationId.map((el) => el._id)
						// })

						// if(response.data.userDetails?.roles[0]['name'] === 'Admin') {

						// props.history.push('/select-organisation')
						// props.history.push('/dashboard')

						// } else {

						// let userDetails = response.data.userDetails

						// let MyLastPasswordCreationDate = new Date(userDetails.LastPasswordCreationDate)

						// console.log('MyLastPasswordCreationDate', MyLastPasswordCreationDate)

						// let CurrentDate = new Date()

						// console.log('CurrentDate', CurrentDate)

						// let timeDifference = CurrentDate.getTime() - MyLastPasswordCreationDate.getTime();

						// console.log('timeDifference', timeDifference)

						// let DaysRemainingToChangePassword = 90 - (Math.floor(timeDifference / (1000 * 60 * 60 * 24)));

						// console.log('differenceInDays', DaysRemainingToChangePassword)

						// props.setUserDetails({
						//     ...response.data.userDetails,
						//     selectedExpCenter: response.data.userDetails.experienceCenterId[0],
						//     selectedLocation: response.data.userDetails.locationId[0]._id,
						//     DaysRemainingToChangePassword: DaysRemainingToChangePassword
						// })
						// props.history.push('/dashboard');
						// }
					} else {
						// props.setUserDetails({})
						localStorage.clear()
						// props.setSnackInfo('Please logout from other tabs', "error")
					}
				} else {
					console.log("using as register page -> f", email);
                    const response = await HttpService.userRegistration(formValue);
                    dispatch(setUserDetails(response.data.user));
                    dispatch(saveToken(response.data.token));
                    localStorage.setItem('TOKEN_KEY', response.data.token);
                    console.log("response -> ", response);
                    if(response.data.token){
                        props.UserLoginHandler(true);
                    }else{
                        props.UserLoginHandler(false);
                    }
				}
			} else {
				// props.setSnackInfo('Invalid Credentials!', "error")
			}
		} catch (error) {
			console.error(error);
			// props.setSnackInfo(error.response.data.failed, "error")
		}
		// props.setLoading(false)
	});

	const toggleLoginAndRegistration = () => {
		try {
			console.log(isLoginPage);
			setIsLoginPage((state) => !state);
			setFormValue({ email: "", password: "" });
		} catch (error) {
			console.error("Error -> ", error);
		}
	};

	useEffect(() => {
		const listener = (event) => {
			if (event.code === "Enter" || event.code === "NumpadEnter") {
				event.preventDefault();
				onSubmit();
			}
		};
		document.addEventListener("keydown", listener);
		return () => {
			document.removeEventListener("keydown", listener);
		};
	}, [formValue, onSubmit]);

	/*
    if (isLogin()) {
        return (<Redirect to="/dashboard" />)
    }
    */
	return (
		<div>
			<div className={classes.mainContainer}>
				<div className={classes.container}>
					<div className={classes.form}>
						<div className="test-logo responsive-container">
							<img
								className="test-logo"
								src={logo}
								alt="test-logo"
								style={{ width: "150px", height: "auto" }}
							/>
						</div>
						<h3>User Account {isLoginPage ? "Login" : "Registration"}</h3>
						{!isLoginPage && <input
							type="name"
							id="name"
							value={name}
							name="name"
							placeholder="User Name"
							onChange={onChange}
							className={classes.input}
						/>}
                        <input
							type="email"
							id="email"
							value={email}
							name="email"
							placeholder="Email ID"
							onChange={onChange}
							className={classes.input}
						/>
						<input
							type="password"
							id="password"
							value={password}
							name="password"
							placeholder="Password"
							onChange={onChange}
							className={classes.input}
						/>
						<Button
							className={classes.loginButton}
							onClick={onSubmit}
							variant="contained"
						>
							{isLoginPage ? "Sign in" : "Register"}
						</Button>

						{/* <Link to="/" style={{ padding: '10px 0', marginLeft: "10px" }}> */}
						<br></br>
						<Button onClick={toggleLoginAndRegistration}>
							<span
								style={{
									fontSize: 12,
									fontWeight: 200,
									cursor: "pointer",
									color: "white",
								}}
								onMouseOver={(e) => {
									e.target.style.color = "grey";
								}}
								onMouseOut={(e) => {
									e.target.style.color = "white";
								}}
							>
								<u> {isLoginPage ? "Register" : "Login"}</u>
							</span>
						</Button>
						{/* </Link> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
