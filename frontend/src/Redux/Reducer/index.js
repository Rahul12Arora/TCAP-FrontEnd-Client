import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: localStorage.getItem("username") || null,
    email: null,
    userDetails: JSON.parse(localStorage.getItem("userDetails")) || null,
    token: localStorage.getItem("token") || null,
};

const store = createSlice({
    name: "auth",
    initialState,
    reducers: {
        saveToken(state, action) {
            state.token = action.payload;
            localStorage.setItem("TOKEN_KEY", action.payload);
        },
        setName(state, action) {
            state.username = action.payload;
            localStorage.setItem("username", action.payload);
        },
        setEmail(state, action) {
            state.email = action.payload;
        },
        setUserDetails(state, action) {
            console.log("Loggin User Details ", state, action);
            state.userDetails = action.payload;
            localStorage.setItem("userDetails", JSON.stringify(action.payload));
        }
    },
});

export const { saveToken, setName, setEmail, setTaskArray, setUserDetails } = store.actions;
export default store.reducer;