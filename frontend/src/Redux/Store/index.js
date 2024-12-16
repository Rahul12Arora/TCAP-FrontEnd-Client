import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Reducer/index.js";

const store = configureStore({
    reducer: authReducer,
});

export default store;