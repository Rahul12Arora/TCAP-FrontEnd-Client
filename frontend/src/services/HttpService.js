import axios from "axios";
// import Config from '../config'
// const Apiurl = Config.apiUrl
// const QTurl = Config.qtUrl
const QTurl = "http://localhost:5003/";

const HttpService = {
	/**
	 * Function to handle the user login
	 */
	userLogin: function (data) {
		console.log("Login data -> ", data);
		return axios.post(`${QTurl}user/login`, data);
	},
	/**
	 * Function to handle the user registration
	 */
	userRegistration: function (data) {
		console.log("Registration  data -> ", data);
		return axios.post(`${QTurl}user/register`, data);
	},
	getAllUser: function (data) {
		console.log("getAllUser", data);
		return axios.get(`${QTurl}user/getAllUser`, data);
	},
	getAllChatGroupOfAUser: function (userId) {
		console.log("getAllChatGroupOfAUser", userId);
		return axios.get(`${QTurl}user/getAllChatGroupOfAUser/${userId}`);
	},
	createNewChatGroup: function (data) {
		console.log("createNewChatGroup", data);
		return axios.post(`${QTurl}chat-group/createNewChatGroup`, data);
	},
	getAllChatGroup: function (data) {
		console.log("getAllChatGroup", data);
		return axios.get(`${QTurl}chat-group/getAllChatGroup`, data);
	},
	getChatGroupDetailsById: function (id) {
		console.log("getChatGroupDetailsById", id);
		return axios.get(`${QTurl}chat-group/getChatGroupDetailsById/${id}`);
	},
};

export default HttpService;
