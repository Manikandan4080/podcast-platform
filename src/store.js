import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js";
import podcastReducer from "./slices/podcastSlice.js";


export default configureStore({
    reducer:{
        user:userReducer,
        podcasts:podcastReducer
    }
})