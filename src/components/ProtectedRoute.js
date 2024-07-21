import React, { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { authUser } from "../redux/features/loginSlice";

function ProtectedRoute(){
    const{isAuth, token} = useSelector((state)=> state.user);
    const dispatch = useDispatch();

    useEffect(()=>{

        if(isAuth){
            dispatch(authUser(token))
        }

    }, [isAuth,dispatch,token])
    return(
        (isAuth) ? <Outlet />:<Navigate to="/login" />
    )
}

export default ProtectedRoute;