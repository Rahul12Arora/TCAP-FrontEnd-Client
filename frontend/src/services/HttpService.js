import axios from 'axios';
import config from '../Config';
const QTurl = config.apiUrl;

const HttpService = {
    /**
     * Function to handle the user login
     */
    userLogin: function (data) {
        return axios.post(`${QTurl}user/login`, data);
    },
    /**
     * Function to handle the user registration
     */
    userRegistration: function (data) {
        return axios.post(`${QTurl}user/register`, data);
    },
    getAllUser: function (data) {
        return axios.get(`${QTurl}user/getAllUser`, data);
    },
    getAllChatGroupOfAUser: function (userId) {
        return axios.get(`${QTurl}user/getAllChatGroupOfAUser/${userId}`);
    },
    createNewChatGroup: function (data) {
        return axios.post(`${QTurl}chat-group/createNewChatGroup`, data);
    },
    addNewMemberToGroup: function (payload) {
        return axios.post(`${QTurl}chat-group/add-new-member-to-group`, payload);
    },
    getAllChatGroup: function (data) {
        return axios.get(`${QTurl}chat-group/getAllChatGroup`, data);
    },
    getChatGroupDetailsById: function (id) {
        return axios.get(
            `${QTurl}chat-group/getChatGroupDetailsById/${id}`
        );
    },
}

export default HttpService;