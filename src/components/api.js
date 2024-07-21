
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const getTasks = async (token) => {
    try{
        //get Tasks
        const response = await axios.get(`${API_URL}/task/list`, {
            headers:{
                Authorization : `Bearer ${token}`
            }
        });
        return response.data;

    }catch(error){
        return error.response.data.message;
    }
}

export const getTask = async (token, id) => {
    try{
        //get Task
        const response = await axios.get(`${API_URL}/task/detail/${id}`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }catch(error){
        return error.response.data.message
    }
}