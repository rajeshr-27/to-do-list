import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
export const loginUser = createAsyncThunk('user/login',async (postData, {rejectWithValue}) => {
    try{
        //login user
        const response = await axios.post(`${API_URL}/user/login`, postData);
        return response.data;

    }catch(error){
        if(error.response){
            return rejectWithValue(error.response.data.message);
        }else if(error.request){
            return rejectWithValue('Network error: No response received')
        }else {
            return rejectWithValue(error.message);
        }
    }
})

export const authUser = createAsyncThunk('user/auth-user', async(token, {rejectWithValue}) => {
    try{
        //auth use
        const response = await axios.get(`${API_URL}/user/auth-user`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }catch(error){
        return rejectWithValue(error);
    }
})
const initialState={
    isLoading:false,
    isAuth: (localStorage.getItem('token')) ? true : false,
    authUser:'',
    token:localStorage.getItem('token') || '',
    message:'',
    error:''
}

const loginSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        clearMessage:(state)=>{
            state.message = '';
        },
        clearError:(state)=>{
            state.error = '';
        },
        logOut:(state) => {
            state.isAuth = false;
            state.authUser = '';
            state.token = '';
            localStorage.removeItem('token');
        }
    },
    extraReducers:(builder) => {
        builder.addCase(loginUser.pending, (state)=> {
            state.isLoading = true;
        });
        builder.addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isAuth = true;
            state.authUser = action.payload.authUser;
            state.token = action.payload.token;
            state.message = action.payload.message;
            localStorage.setItem('token', action.payload.token);

        })
        builder.addCase(loginUser.rejected, (state, action)=> {
            state.isLoading = false;
            state.error = action.payload;
        })
        builder.addCase(authUser.pending, (state)=> {
            state.isLoading = true;
        })
        builder.addCase(authUser.fulfilled, (state,action)=> {

            state.isLoading = false;
            state.isAuth = true;
            state.authUser = action.payload.authUser;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);

        })
        builder.addCase(authUser.rejected, (state,action)=>{
            state.isLoading = false;
            state.isAuth = false;
            state.authUser = '';
            state.token = '';
            localStorage.removeItem('token');
        })
    }
})

const {reducer, actions} = loginSlice;

export default reducer;

export const {clearMessage, clearError, logOut} = actions;